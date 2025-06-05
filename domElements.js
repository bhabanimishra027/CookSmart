// js/domElements.js
export const recipesGrid = document.getElementById('recipesGrid');
export const loadMoreBtn = document.getElementById('loadMoreBtn');
export const viewMoreIdeasBtn = document.getElementById('viewMoreIdeasBtn');
export const recipesSectionTitle = document.getElementById('recipesSectionTitle');
export const navLinks = document.getElementById('navLinks'); // For main page nav
// ... other exports
export const savePlanBtn = document.getElementById('savePlanBtn');
export const savePlanMessage = document.getElementById('savePlanMessage');
export const mealPlanSlots = document.querySelectorAll('.meal-plan .meal-item'); // Get all meal slots
export const mealPlanTotalRecipes = document.getElementById('mealPlanTotalRecipes');
export const clearPlanBtn = document.getElementById('clearPlanBtn');
export const mealPlanSection = document.getElementById('mealPlanSection'); // Ensure your main meal plan div has this ID

// For Account Page (if you have a separate nav ID there)
export const navLinksAccount = document.getElementById('navLinksAccount');
export const userEmailSpan = document.getElementById('userEmail');
export const recentlyViewedList = document.getElementById('recentlyViewedList');
export const savedSearchesList = document.getElementById('savedSearchesList');
export const myReviewsList = document.getElementById('myReviewsList');
// export const logoutBtnAccount = document.getElementById('logoutBtn'); // If logout on account page has specific ID

// Modal elements
export const modal = document.getElementById('recipeModal');
export const modalTitle = document.getElementById('modalRecipeTitle');
export const modalImage = document.getElementById('modalRecipeImage');
export const modalIngredientsList = document.getElementById('modalRecipeIngredients');
export const modalInstructions = document.getElementById('modalRecipeInstructions');
export const modalVideo = document.getElementById('modalRecipeVideo');
export const closeModalBtn = modal ? modal.querySelector('.close-button') : null;
export const modalReviewSection = document.getElementById('modalReviewSection');
export const reviewRatingInput = document.getElementById('reviewRating');
export const reviewTextInput = document.getElementById('reviewText');
export const submitReviewBtn = document.getElementById('submitReviewBtn');
export const reviewMessage = document.getElementById('reviewMessage');
export const modalDisplayReviews = document.getElementById('modalDisplayReviews');
export const modalRecipeReviewsList = document.getElementById('modalRecipeReviewsList');

// Filter elements
export const recipeNameSearchInput = document.getElementById('recipeNameSearch');
export const ingredientsSearchInput = document.getElementById('ingredientsSearch');
export const maxTimeInput = document.getElementById('maxTime');
export const cuisineSelect = document.getElementById('cuisineSelect');
export const mealTypeSelect = document.getElementById('mealTypeSelect');
export const applyFiltersBtn = document.getElementById('applyFiltersBtn');
export const resetFiltersBtn = document.getElementById('resetFiltersBtn');
export const noResultsMessage = document.getElementById('noResultsMessage');

// Personalized Suggestions
export const personalizedSuggestionsContainer = document.getElementById('personalizedSuggestions');
export const personalizedRecipesGrid = document.getElementById('personalizedRecipesGrid');
export const personalizedTitle = document.getElementById('personalizedTitle');


// Meal Plan Items
export const mealItems = document.querySelectorAll('.meal-plan .meal-item');
export const avgProteinPercent = document.getElementById('avgProteinPercent');
export const avgProteinFill = document.getElementById('avgProteinFill');
export const avgCarbsPercent = document.getElementById('avgCarbsPercent');
export const avgCarbsFill = document.getElementById('avgCarbsFill');
export const avgFatsPercent = document.getElementById('avgFatsPercent');
export const avgFatsFill = document.getElementById('avgFatsFill');
export const nutritionAlertsContainer = document.getElementById('nutritionAlertsContainer');
export const initialNutritionAlert = document.getElementById('initialNutritionAlert');

export const avgCalories = document.getElementById('avgCalories');
export const avgProteinGrams = document.getElementById('avgProteinGrams');
export const avgCarbsGrams = document.getElementById('avgCarbsGrams');
export const avgFatsGrams = document.getElementById('avgFatsGrams'); // Added
export const keyNutrientsList = document.getElementById('keyNutrientsList');
export const nutritionRecommendations = document.getElementById('nutritionRecommendations');

// Debugging logs (optional, remove after confirming)
// console.log({ recipesGrid, loadMoreBtn, applyFiltersBtn, resetFiltersBtn, personalizedRecipesGrid });