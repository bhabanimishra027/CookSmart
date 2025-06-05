// frontend/js/mealPlan.js
import * as DOM from './domElements.js';
import { allRecipes } from './recipeData.js';
import { calculateAndDisplayNutrition } from './nutrition.js'; // We'll create this file

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TIMES = ["Breakfast", "Lunch", "Dinner"];

// Initialize an empty meal plan structure
let currentMealPlan = {};

function initializeEmptyPlan() {
    currentMealPlan = {};
    DAYS.forEach(day => {
        currentMealPlan[day] = {};
        MEAL_TIMES.forEach(meal => {
            currentMealPlan[day][meal] = null; // Will store recipe ID or object
        });
    });
}

export function getRecipeById(id) {
    return allRecipes.find(recipe => recipe.id === id);
}

function renderMealPlan() {
    let recipeCount = 0;
    DOM.mealPlanSlots.forEach(slot => {
        const day = slot.dataset.day;
        const meal = slot.dataset.meal;
        const recipeId = currentMealPlan[day]?.[meal];

        if (recipeId) {
            const recipe = getRecipeById(recipeId);
            if (recipe) {
                slot.textContent = recipe.title;
                slot.classList.add('has-recipe'); // For styling if needed
                recipeCount++;
            } else {
                slot.textContent = "Recipe not found"; // Should not happen if ID is valid
                slot.classList.remove('has-recipe');
                currentMealPlan[day][meal] = null; // Clear invalid entry
            }
        } else {
            slot.textContent = "Click to add";
            slot.classList.remove('has-recipe');
        }
    });
    if (DOM.mealPlanTotalRecipes) {
        DOM.mealPlanTotalRecipes.textContent = recipeCount;
    }
    calculateAndDisplayNutrition(currentMealPlan); // Recalculate nutrition
}

export function addRecipeToPlan(day, meal, recipeId) {
    if (currentMealPlan[day] && currentMealPlan[day].hasOwnProperty(meal)) {
        currentMealPlan[day][meal] = recipeId;
        renderMealPlan();
    } else {
        console.error("Invalid day or meal slot:", day, meal);
    }
}

function handleSlotClick(event) {
    const slot = event.currentTarget;
    const day = slot.dataset.day;
    const meal = slot.dataset.meal;

    const currentRecipeId = currentMealPlan[day]?.[meal];
    if (currentRecipeId) {
        // Option to remove or change recipe
        if (confirm(`"${getRecipeById(currentRecipeId).title}" is in this slot. Remove it?`)) {
            currentMealPlan[day][meal] = null;
            renderMealPlan();
        }
        return;
    }

    const recipeName = prompt(`Enter recipe name for ${meal} on ${day}:`);
    if (recipeName && recipeName.trim() !== "") {
        const foundRecipe = allRecipes.find(r => r.title.toLowerCase().includes(recipeName.trim().toLowerCase()));
        if (foundRecipe) {
            addRecipeToPlan(day, meal, foundRecipe.id);
        } else {
            alert(`Recipe "${recipeName}" not found.`);
        }
    }
}

export function clearMealPlan() {
    if (confirm("Are you sure you want to clear the entire meal plan?")) {
        initializeEmptyPlan();
        renderMealPlan();
    }
}

export function initMealPlanner() {
    initializeEmptyPlan();
    DOM.mealPlanSlots.forEach(slot => {
        slot.addEventListener('click', handleSlotClick);
        // Make slots focusable for accessibility and to indicate they are interactive
        slot.setAttribute('tabindex', '0');
        slot.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault(); // Prevent page scroll on space
                handleSlotClick(event);
            }
        });
    });
    if (DOM.clearPlanBtn) {
        DOM.clearPlanBtn.addEventListener('click', clearMealPlan);
    }
    renderMealPlan(); // Initial render (empty state)
}

// Function to load a plan (e.g., from localStorage, eventually from backend)
export function loadMealPlan(savedPlanData) {
    if (savedPlanData && typeof savedPlanData === 'object') {
        // Basic validation: check if it has days and meal times
        const firstDay = DAYS[0];
        const firstMeal = MEAL_TIMES[0];
        if (savedPlanData[firstDay] && savedPlanData[firstDay].hasOwnProperty(firstMeal)) {
            currentMealPlan = JSON.parse(JSON.stringify(savedPlanData)); // Deep copy
            renderMealPlan();
            return true;
        }
    }
    console.warn("Could not load saved meal plan: Invalid data format.");
    initializeEmptyPlan(); // Reset to empty if loading fails
    renderMealPlan();
    return false;
}

export function getCurrentMealPlan() {
    return currentMealPlan;
}