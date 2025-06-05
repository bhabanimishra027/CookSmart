// js/main.js
import * as DOM from './domElements.js';
import { allRecipes } from './recipeData.js';
import { RECIPES_PER_PAGE } from './config.js';
import { parseTimeToMinutes } from './utils.js';
import { updateNav, getLoggedInUser } from './auth.js'; // Ensure getLoggedInUser is imported if needed directly here
import { saveSearchQuery, saveUserMealPlan, loadUserMealPlan } from './userData.js';
import { populateCuisineDropdown, populateMealTypeDropdown, displayFilteredRecipes as displayRecipeGrid } from './ui.js'; // Renamed for clarity
import { closeModal } from './modal.js'; // openRecipeModal is called from ui.js -> createRecipeCard
import { initMealPlanner, loadMealPlan as loadPlanIntoPlanner } from './mealPlan.js';
import { initNutritionDisplay, calculateAndDisplayNutrition } from './nutrition.js';

let currentFilteredRecipes = [];
let recipesToShowCount = 0;

// --- Filtering Logic ---
function applyAllFilters() {
    const nameQuery = DOM.recipeNameSearchInput ? DOM.recipeNameSearchInput.value.toLowerCase().trim() : "";
    const ingredientsQuery = DOM.ingredientsSearchInput ? DOM.ingredientsSearchInput.value.toLowerCase().trim() : "";
    const maxTimeQuery = DOM.maxTimeInput ? parseInt(DOM.maxTimeInput.value) : NaN;
    const cuisineQuery = DOM.cuisineSelect ? DOM.cuisineSelect.value.toLowerCase() : "";
    const mealTypeQuery = DOM.mealTypeSelect ? DOM.mealTypeSelect.value.toLowerCase() : "";

    currentFilteredRecipes = allRecipes.filter(recipe => {
        if (nameQuery && !(recipe.title || "").toLowerCase().includes(nameQuery)) return false;
        if (ingredientsQuery) {
            const searchIngredients = ingredientsQuery.split(',').map(ing => ing.trim()).filter(ing => ing);
            const recipeIngredientsLower = (recipe.ingredients || []).map(ing => (ing || "").toLowerCase());
            if (!searchIngredients.every(searchIng => recipeIngredientsLower.some(recipeIng => recipeIng.includes(searchIng)))) return false;
        }
        if (!isNaN(maxTimeQuery) && maxTimeQuery > 0) {
            if (parseTimeToMinutes(recipe.time) > maxTimeQuery) return false;
        }
        if (cuisineQuery && !(recipe.tags || []).map(tag => (tag || "").toLowerCase()).includes(cuisineQuery)) return false;
        if (mealTypeQuery && !(recipe.mealType || []).map(type => (type || "").toLowerCase()).includes(mealTypeQuery)) return false;
        return true;
    });
    recipesToShowCount = RECIPES_PER_PAGE;
    displayRecipeGrid(currentFilteredRecipes, recipesToShowCount); // Use the renamed function
    saveSearchQuery({nameQuery, ingredientsQuery, maxTimeQuery, cuisineQuery, mealTypeQuery });
}

function resetAllFilters() {
    if(DOM.recipeNameSearchInput) DOM.recipeNameSearchInput.value = '';
    if(DOM.ingredientsSearchInput) DOM.ingredientsSearchInput.value = '';
    if(DOM.maxTimeInput) DOM.maxTimeInput.value = '';
    if(DOM.cuisineSelect) DOM.cuisineSelect.value = '';
    if(DOM.mealTypeSelect) DOM.mealTypeSelect.value = '';
    currentFilteredRecipes = [...allRecipes];
    recipesToShowCount = RECIPES_PER_PAGE;
    displayRecipeGrid(currentFilteredRecipes, recipesToShowCount); // Use the renamed function
}

// --- Main Initialization on DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
    updateNav(); // Update nav based on login status

    // Initialize recipe filters and display
    if (allRecipes && allRecipes.length > 0) {
        if (DOM.cuisineSelect) populateCuisineDropdown();
        if (DOM.mealTypeSelect) populateMealTypeDropdown();
        resetAllFilters(); // Displays initial recipes
    } else {
        if(DOM.recipesSectionTitle) DOM.recipesSectionTitle.textContent = "No Recipes Loaded";
        if(DOM.noResultsMessage) {
            DOM.noResultsMessage.textContent = "Recipe data is missing or could not be loaded. Please check the configuration.";
            DOM.noResultsMessage.style.display = 'block';
        }
        if(DOM.loadMoreBtn) DOM.loadMoreBtn.style.display = 'none';
        if(DOM.viewMoreIdeasBtn) DOM.viewMoreIdeasBtn.style.display = 'none';
    }

    // Initialize meal planner (this will also call renderMealPlan which calls calculateAndDisplayNutrition)
    initMealPlanner(); // Sets up empty plan, click listeners, and initial render

    // Initialize nutrition display (this will show 0s initially if meal plan is empty)
    initNutritionDisplay();

    // Attempt to load saved meal plan for the user AFTER meal planner is initialized
    const savedPlan = loadUserMealPlan();
    if (savedPlan) {
        loadPlanIntoPlanner(savedPlan); // This function is in mealPlan.js and will re-render & re-calculate nutrition
    }


    // --- Event Listeners ---
    if (DOM.applyFiltersBtn) DOM.applyFiltersBtn.addEventListener('click', applyAllFilters);
    if (DOM.resetFiltersBtn) DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);

    if (DOM.loadMoreBtn) {
        DOM.loadMoreBtn.addEventListener('click', () => {
            recipesToShowCount += RECIPES_PER_PAGE;
            displayRecipeGrid(currentFilteredRecipes, recipesToShowCount); // Use the renamed function
        });
    }

    if (DOM.viewMoreIdeasBtn) {
        DOM.viewMoreIdeasBtn.addEventListener('click', resetAllFilters);
    }

    // Modal close listeners
    if (DOM.closeModalBtn) DOM.closeModalBtn.addEventListener('click', closeModal);
    if (DOM.modal) {
        window.addEventListener('click', (event) => {
            if (event.target === DOM.modal) {
                closeModal();
            }
        });
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && DOM.modal.style.display === 'block') {
                closeModal();
            }
        });
    }

    // Save Plan Button
    if (DOM.savePlanBtn) {
        DOM.savePlanBtn.addEventListener('click', saveUserMealPlan);
    }

    // The old static meal items don't need special handling anymore as the meal plan is dynamic
    // If you had specific editable features for those beyond adding recipes, they would go here.
    // For now, the initMealPlanner handles the interactive slots.
});