// js/modal.js
import * as DOM from './domElements.js';
import { allRecipes } from './recipeData.js';
import { placeholderVideoEmbed } from './config.js';
import { getLoggedInUser } from './auth.js';
import { saveRecentlyViewed, saveRecipeReview } from './userData.js';
import { displayRecipeReviews } from './ui.js';

let currentOpenRecipeId = null;

export function getCurrentOpenRecipeId() {
    return currentOpenRecipeId;
}

export function openRecipeModal(recipeId) {
    const recipe = allRecipes.find(r => r.id === recipeId);
    if (!recipe || !DOM.modal) return;
    currentOpenRecipeId = recipeId;

    if (DOM.modalTitle) DOM.modalTitle.textContent = recipe.title;
    if (DOM.modalImage) {
        DOM.modalImage.src = recipe.image;
        DOM.modalImage.alt = recipe.title;
    }
    if (DOM.modalIngredientsList) {
        DOM.modalIngredientsList.innerHTML = '';
        if(recipe.ingredients && Array.isArray(recipe.ingredients)){
            recipe.ingredients.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = ing;
                DOM.modalIngredientsList.appendChild(li);
            });
        }
    }
    if (DOM.modalInstructions) DOM.modalInstructions.innerHTML = `<p>${(recipe.instructions || "").replace(/\n/g, '<br>')}</p>`;
    if (DOM.modalVideo) DOM.modalVideo.innerHTML = recipe.videoEmbed || placeholderVideoEmbed;

    // Reset and display reviews
    if (DOM.reviewRatingInput) DOM.reviewRatingInput.value = '';
    if (DOM.reviewTextInput) DOM.reviewTextInput.value = '';
    if (DOM.reviewMessage) DOM.reviewMessage.textContent = '';
    displayRecipeReviews(recipeId); // from ui.js

    DOM.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    saveRecentlyViewed(recipeId); // from userData.js
}

export function closeModal() {
    if (!DOM.modal) return;
    DOM.modal.style.display = 'none';
    if (DOM.modalVideo) DOM.modalVideo.innerHTML = '';
    document.body.style.overflow = 'auto';
    currentOpenRecipeId = null;
}

// Review submission logic
if (DOM.submitReviewBtn) {
    DOM.submitReviewBtn.addEventListener('click', () => {
        if (!currentOpenRecipeId || !DOM.reviewRatingInput || !DOM.reviewTextInput || !DOM.reviewMessage) return;

        const rating = DOM.reviewRatingInput.value;
        const text = DOM.reviewTextInput.value.trim();
        const loggedInUser = getLoggedInUser(); // from auth.js

        if (!loggedInUser) {
            DOM.reviewMessage.textContent = "You must be logged in to submit a review.";
            DOM.reviewMessage.style.color = "red";
            return;
        }

        if (!rating || parseInt(rating) < 1 || parseInt(rating) > 5) {
            DOM.reviewMessage.textContent = "Please provide a rating between 1 and 5.";
            DOM.reviewMessage.style.color = "red";
            return;
        }

        if (saveRecipeReview(currentOpenRecipeId, rating, text)) { // from userData.js
            DOM.reviewMessage.textContent = "Review submitted successfully!";
            DOM.reviewMessage.style.color = "green";
            DOM.reviewRatingInput.value = '';
            DOM.reviewTextInput.value = '';
            displayRecipeReviews(currentOpenRecipeId); // from ui.js
        } else {
            // This else might not be hit if saveRecipeReview already alerts or if the main issue is not being logged in.
            DOM.reviewMessage.textContent = "Failed to submit review. Please try again.";
            DOM.reviewMessage.style.color = "red";
        }
    });
}