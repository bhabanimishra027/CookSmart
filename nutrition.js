// frontend/js/nutrition.js
import * as DOM from './domElements.js';
import { getRecipeById } from './mealPlan.js'; // To get recipe details

const TARGET_CALORIES = 2000; // Example daily target
const TARGET_PROTEIN_PERCENT = 30; // Example
const TARGET_CARBS_PERCENT = 40;   // Example
const TARGET_FATS_PERCENT = 30;    // Example

function calculateNutritionTotals(mealPlan) {
    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        recipeCount: 0
    };

    for (const day in mealPlan) {
        for (const meal in mealPlan[day]) {
            const recipeId = mealPlan[day][meal];
            if (recipeId) {
                const recipe = getRecipeById(recipeId);
                if (recipe && recipe.nutrition) {
                    totals.calories += recipe.nutrition.calories || 0;
                    totals.protein += recipe.nutrition.protein || 0;
                    totals.carbs += recipe.nutrition.carbs || 0;
                    totals.fats += recipe.nutrition.fats || 0;
                    totals.recipeCount++;
                }
            }
        }
    }
    return totals;
}

export function calculateAndDisplayNutrition(mealPlan) {
    const totals = calculateNutritionTotals(mealPlan);
    const numberOfDaysInPlan = 7; // Assuming a 7-day plan for averages
    const activeDays = totals.recipeCount > 0 ? numberOfDaysInPlan : 0; // Or count days with actual recipes

    const avgCalories = activeDays > 0 ? Math.round(totals.calories / activeDays) : 0;
    const avgProteinGrams = activeDays > 0 ? Math.round(totals.protein / activeDays) : 0;
    const avgCarbsGrams = activeDays > 0 ? Math.round(totals.carbs / activeDays) : 0;
    const avgFatsGrams = activeDays > 0 ? Math.round(totals.fats / activeDays) : 0;

    const totalMacroGrams = avgProteinGrams + avgCarbsGrams + avgFatsGrams;
    const proteinPercent = totalMacroGrams > 0 ? Math.round((avgProteinGrams * 4 / (avgCalories || 1)) * 100) : 0; // 4 cal per gram protein/carb
    const carbsPercent = totalMacroGrams > 0 ? Math.round((avgCarbsGrams * 4 / (avgCalories || 1)) * 100) : 0;
    const fatsPercent = totalMacroGrams > 0 ? Math.round((avgFatsGrams * 9 / (avgCalories || 1)) * 100) : 0; // 9 cal per gram fat
    
    // Clamp percentages to ensure they sum roughly to 100 if displayed directly as a pie/bar
    // For individual progress bars, this clamping might not be strictly necessary
    // const totalPercent = proteinPercent + carbsPercent + fatsPercent;
    // if (totalPercent > 100) { /* simple normalization if needed */ }


    // Update Weekly Average Progress Bars
    if (DOM.avgProteinFill) DOM.avgProteinFill.style.width = `${proteinPercent > 100 ? 100 : proteinPercent}%`;
    if (DOM.avgProteinPercent) DOM.avgProteinPercent.textContent = `${proteinPercent}%`;
    if (DOM.avgCarbsFill) DOM.avgCarbsFill.style.width = `${carbsPercent > 100 ? 100 : carbsPercent}%`;
    if (DOM.avgCarbsPercent) DOM.avgCarbsPercent.textContent = `${carbsPercent}%`;
    if (DOM.avgFatsFill) DOM.avgFatsFill.style.width = `${fatsPercent > 100 ? 100 : fatsPercent}%`;
    if (DOM.avgFatsPercent) DOM.avgFatsPercent.textContent = `${fatsPercent}%`;

    // Update Daily Average Stats
    if (DOM.avgCalories) DOM.avgCalories.textContent = avgCalories;
    if (DOM.avgProteinGrams) DOM.avgProteinGrams.textContent = `${avgProteinGrams}g`;
    if (DOM.avgCarbsGrams) DOM.avgCarbsGrams.textContent = `${avgCarbsGrams}g`;
    if (DOM.avgFatsGrams) DOM.avgFatsGrams.textContent = `${avgFatsGrams}g`;

    // Update Alerts and Recommendations
    if (DOM.nutritionAlertsContainer && DOM.initialNutritionAlert) {
        if (totals.recipeCount > 0) {
            DOM.initialNutritionAlert.style.display = 'none';
            // Add more specific alerts based on calculations later
            DOM.nutritionAlertsContainer.innerHTML = ''; // Clear old specific alerts
            if (avgCalories < TARGET_CALORIES * 0.8) {
                 addNutritionAlert('Your average daily calories are low. Consider adding more calorie-dense recipes.');
            }
            if (avgProteinGrams < (TARGET_CALORIES * (TARGET_PROTEIN_PERCENT/100) / 4) * 0.8) { // Approx target protein in grams
                 addNutritionAlert('Your average daily protein intake is low.');
            }

        } else {
            DOM.initialNutritionAlert.style.display = 'block';
            DOM.nutritionAlertsContainer.innerHTML = ''; // Clear specific alerts
            if (DOM.nutritionRecommendations) DOM.nutritionRecommendations.innerHTML = `<p>Recommendations will appear here based on your plan.</p>`;

        }
    }
    if (DOM.nutritionRecommendations && totals.recipeCount > 0) {
         DOM.nutritionRecommendations.innerHTML = `<p>Your plan provides an average of ${avgCalories} calories per day.</p>`;
         // Add more specific recommendations
    }
}

function addNutritionAlert(message) {
    if (!DOM.nutritionAlertsContainer) return;
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('nutrition-alert');
    alertDiv.innerHTML = `<p>${message}</p>`;
    DOM.nutritionAlertsContainer.appendChild(alertDiv);
}

// Initialize nutrition display
export function initNutritionDisplay() {
    calculateAndDisplayNutrition({}); // Pass an empty plan initially
}