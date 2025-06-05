// js/ui.js
import * as DOM from './domElements.js';
import { allRecipes } from './recipeData.js';
import { openRecipeModal } from './modal.js'; // For recipe card click
import { getRecipeReviews } from './userData.js'; // For displaying reviews in modal

export function populateCuisineDropdown() {
    if (!DOM.cuisineSelect) return;
    const cuisines = new Set();
    const cuisineKeywords = ['indian', 'italian', 'mexican', 'chinese', 'thai', 'japanese', 'french', 'greek', 'american', 'middle eastern', 'korean', 'vietnamese', 'spanish', 'british', 'mediterranean', 'russian', 'goan', 'punjabi', 'south indian', 'mughlai', 'bengali', 'gujarati', 'hyderabadi', 'kashmiri', 'coastal', 'irish', 'european', 'north african'];
    allRecipes.forEach(recipe => {
        if(recipe.tags && Array.isArray(recipe.tags)){
            recipe.tags.forEach(tag => {
                if (tag) { // Ensure tag is not null or undefined
                    const lowerTag = tag.toLowerCase();
                    if (cuisineKeywords.includes(lowerTag)) {
                        cuisines.add(tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase());
                    }
                }
            });
        }
    });
    DOM.cuisineSelect.innerHTML = '<option value="">All Cuisines</option>'; // Reset before populating
    Array.from(cuisines).sort().forEach(cuisine => {
        const option = document.createElement('option');
        option.value = cuisine.toLowerCase();
        option.textContent = cuisine;
        DOM.cuisineSelect.appendChild(option);
    });
}

export function populateMealTypeDropdown() {
    if (!DOM.mealTypeSelect) return;
    const mealTypes = new Set();
    allRecipes.forEach(recipe => {
        if(recipe.mealType && Array.isArray(recipe.mealType)){
            recipe.mealType.forEach(type => {
                if (type) { // Ensure type is not null or undefined
                    mealTypes.add(type.charAt(0).toUpperCase() + type.slice(1).toLowerCase());
                }
            });
        }
    });
    DOM.mealTypeSelect.innerHTML = '<option value="">All Meal Types</option>'; // Reset before populating
    Array.from(mealTypes).sort().forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        DOM.mealTypeSelect.appendChild(option);
    });
}

export function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.dataset.recipeId = recipe.id;
    card.addEventListener('click', () => openRecipeModal(recipe.id));

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('recipe-image');
    imageDiv.style.backgroundImage = `url('${recipe.image}')`;

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('recipe-info');

    const titleH3 = document.createElement('h3');
    titleH3.classList.add('recipe-title');
    titleH3.textContent = recipe.title;

    const metaDiv = document.createElement('div');
    metaDiv.classList.add('recipe-meta');
    metaDiv.innerHTML = `
        <span><i class="far fa-clock"></i> ${recipe.time || 'N/A'}</span>
        <span><i class="fas fa-fire"></i> ${recipe.calories || 'N/A'}</span>
    `;

    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('recipe-rating');
    ratingDiv.textContent = recipe.rating || 'N/A';

    const tagsContainer = document.createElement('div');
    tagsContainer.classList.add('recipe-tags-container');
    if(recipe.tags && Array.isArray(recipe.tags)){
        recipe.tags.forEach(tagText => {
            if (tagText) {
                const tagSpan = document.createElement('span');
                tagSpan.classList.add('recipe-tag');
                tagSpan.textContent = tagText;
                tagsContainer.appendChild(tagSpan);
            }
        });
    }

    const mealTypesContainer = document.createElement('div');
    mealTypesContainer.classList.add('recipe-meal-types-container');
    if(recipe.mealType && Array.isArray(recipe.mealType)){
        recipe.mealType.forEach(typeText => {
            if (typeText) {
                const typeSpan = document.createElement('span');
                typeSpan.classList.add('recipe-meal-type');
                typeSpan.textContent = typeText;
                mealTypesContainer.appendChild(typeSpan);
            }
        });
    }

    infoDiv.appendChild(titleH3);
    infoDiv.appendChild(metaDiv);
    infoDiv.appendChild(ratingDiv);
    infoDiv.appendChild(tagsContainer);
    infoDiv.appendChild(mealTypesContainer);

    card.appendChild(imageDiv);
    card.appendChild(infoDiv);
    return card;
}

export function displayRecipesInGrid(gridElement, recipesToDisplay) {
    if (!gridElement) {
        // console.error("Grid element not found for displaying recipes.");
        return;
    }
    gridElement.innerHTML = ''; // Clear previous recipes
    if (recipesToDisplay.length === 0) {
        gridElement.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 20px;">No recipes to display.</p>';
        return;
    }
    recipesToDisplay.forEach(recipe => {
        gridElement.appendChild(createRecipeCard(recipe));
    });
}


export function displayFilteredRecipes(currentFilteredRecipes, recipesToShowCount) {
    if (!DOM.recipesGrid) {
        // console.warn("Main recipesGrid not found, cannot display filtered recipes.");
        return;
    }
    DOM.recipesGrid.innerHTML = '';
    if (DOM.noResultsMessage) DOM.noResultsMessage.style.display = 'none';

    const recipesToDisplayOnPage = currentFilteredRecipes.slice(0, recipesToShowCount);
    const filtersAreActive = (DOM.recipeNameSearchInput && DOM.recipeNameSearchInput.value) ||
                             (DOM.ingredientsSearchInput && DOM.ingredientsSearchInput.value) ||
                             (DOM.maxTimeInput && DOM.maxTimeInput.value) ||
                             (DOM.cuisineSelect && DOM.cuisineSelect.value) ||
                             (DOM.mealTypeSelect && DOM.mealTypeSelect.value);

    if (recipesToDisplayOnPage.length === 0) {
        if (filtersAreActive) {
            if (DOM.noResultsMessage) DOM.noResultsMessage.textContent = "No recipes found matching your criteria.";
            if (DOM.recipesSectionTitle) DOM.recipesSectionTitle.textContent = "No Matches Found";
        } else {
            if (DOM.noResultsMessage) DOM.noResultsMessage.textContent = "No recipes available at the moment.";
            if (DOM.recipesSectionTitle) DOM.recipesSectionTitle.textContent = "All Recipe Ideas"; // Or "No Recipes Available"
        }
        if (DOM.noResultsMessage) DOM.noResultsMessage.style.display = 'block';
    } else {
         if (DOM.recipesSectionTitle) DOM.recipesSectionTitle.textContent = filtersAreActive ? "Filtered Recipes" : "All Recipe Ideas";
    }

    displayRecipesInGrid(DOM.recipesGrid, recipesToDisplayOnPage);


    const moreRecipesInCurrentSetAvailable = recipesToShowCount < currentFilteredRecipes.length;

    if (DOM.loadMoreBtn) {
        DOM.loadMoreBtn.style.display = moreRecipesInCurrentSetAvailable ? 'inline-block' : 'none';
    }

    if (DOM.viewMoreIdeasBtn) {
        if ((!moreRecipesInCurrentSetAvailable && filtersAreActive && currentFilteredRecipes.length > 0) ||
            (recipesToDisplayOnPage.length === 0 && filtersAreActive && allRecipes.length > 0)) {
             DOM.viewMoreIdeasBtn.style.display = 'inline-block';
             if(recipesToDisplayOnPage.length === 0 && DOM.loadMoreBtn) DOM.loadMoreBtn.style.display = 'none';
        } else {
             DOM.viewMoreIdeasBtn.style.display = 'none';
        }
    }
}

export function displayRecipeReviews(recipeId) {
    if (!DOM.modalRecipeReviewsList) return;

    DOM.modalRecipeReviewsList.innerHTML = '';
    const reviews = getRecipeReviews(recipeId); // from userData.js

    if (reviews.length === 0) {
        DOM.modalRecipeReviewsList.innerHTML = '<li>No reviews yet. Be the first!</li>';
        return;
    }

    reviews.forEach(review => {
        const li = document.createElement('li');
        li.style.borderBottom = '1px solid #eee';
        li.style.padding = '10px 0';
        li.innerHTML = `
            <strong>${review.userEmail ? review.userEmail.split('@')[0] : 'Anonymous'}</strong> (Rating: ${review.rating}/5)
            <p style="font-size:0.9em; color: #666;">${new Date(review.date).toLocaleDateString()}</p>
            <p>${review.text || 'No comment.'}</p>
        `;
        DOM.modalRecipeReviewsList.appendChild(li);
    });
}