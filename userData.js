// js/userData.js
import { getLoggedInUser } from './auth.js';
import { getCurrentMealPlan } from './mealPlan.js';

export function saveSearchQuery(queryDetails) {
    const user = getLoggedInUser();
    if (!user) return;

    // Only save if there's some actual query
    const { nameQuery, ingredientsQuery, maxTimeQuery, cuisineQuery, mealTypeQuery } = queryDetails;
    if (!nameQuery && !ingredientsQuery && !maxTimeQuery && !cuisineQuery && !mealTypeQuery) {
        return;
    }

    let users = JSON.parse(localStorage.getItem('cooksmart_users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex !== -1) {
        if (!users[userIndex].searches) {
            users[userIndex].searches = [];
        }
        users[userIndex].searches.unshift({ query: queryDetails, date: new Date().toISOString() });
        users[userIndex].searches = users[userIndex].searches.slice(0, 10); // Keep last 10
        localStorage.setItem('cooksmart_users', JSON.stringify(users));
    }
}

export function saveRecentlyViewed(recipeId) {
    const user = getLoggedInUser();
    if (!user) return;

    let users = JSON.parse(localStorage.getItem('cooksmart_users')) || [];
    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex !== -1) {
        if (!users[userIndex].recentlyViewed) {
            users[userIndex].recentlyViewed = [];
        }
        // Remove if already exists to move it to the top
        users[userIndex].recentlyViewed = users[userIndex].recentlyViewed.filter(id => id !== recipeId);
        users[userIndex].recentlyViewed.unshift(recipeId);
        users[userIndex].recentlyViewed = users[userIndex].recentlyViewed.slice(0, 10); // Keep last 10
        localStorage.setItem('cooksmart_users', JSON.stringify(users));
    }
}

export function saveRecipeReview(recipeId, rating, text) {
    const user = getLoggedInUser();
    if (!user) {
        // This case should ideally be handled before calling this function,
        // e.g., by disabling review submission if not logged in.
        // Or, the UI calling this should handle the false return.
        console.warn("Attempted to save review without logged in user.");
        return false;
    }

    // Store reviews globally, associated with recipeId and userEmail
    let allSiteReviews = JSON.parse(localStorage.getItem('cooksmart_reviews')) || [];

    // Remove previous review by this user for this recipe, if any, to update it
    allSiteReviews = allSiteReviews.filter(review =>
        !(review.recipeId === recipeId && review.userEmail === user.email)
    );

    allSiteReviews.unshift({
        recipeId,
        userEmail: user.email,
        rating: parseInt(rating),
        text,
        date: new Date().toISOString()
    });
    localStorage.setItem('cooksmart_reviews', JSON.stringify(allSiteReviews));
    return true;
}

export function getRecipeReviews(recipeId) {
    const allSiteReviews = JSON.parse(localStorage.getItem('cooksmart_reviews')) || [];
    return allSiteReviews.filter(review => review.recipeId === recipeId);
}

export function getUserData() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return null;

    const users = JSON.parse(localStorage.getItem('cooksmart_users')) || [];
    return users.find(u => u.email === loggedInUser.email);
}


export function getMealPlanDataFromUI() {
    const plan = {};
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const mealTimes = ["Breakfast", "Lunch", "Dinner"];
    const mealPlanSectionEl = document.getElementById('mealPlanSection'); // Get it directly

    if (!mealPlanSectionEl) return plan; // Or throw an error

    const mealTimeHeaders = mealPlanSectionEl.querySelectorAll('.meal-time');

    mealTimeHeaders.forEach((mealTimeHeader, mealTimeIndex) => {
        const currentMealTime = mealTimes[mealTimeIndex];
        const mealItemsContainer = mealTimeHeader.nextElementSibling;

        if (mealItemsContainer && mealItemsContainer.classList.contains('meal-plan-days')) {
            const items = mealItemsContainer.querySelectorAll('.meal-item');
            items.forEach((item, dayIndex) => {
                const day = daysOfWeek[dayIndex];
                if (!plan[day]) {
                    plan[day] = {};
                }
                // Each mealtime under a day should be an array if you plan to allow multiple items per meal slot
                // For now, assuming one item per slot based on current UI. If multiple, initialize as array.
                plan[day][currentMealTime] = item.textContent.trim() || "-";
            });
        }
    });
    return plan;
}


export function saveUserMealPlan() { // Renamed from saveMealPlan to avoid conflict if not modular
    const loggedInUser = getLoggedInUser();
    const savePlanMessageEl = document.getElementById('savePlanMessage'); // Get it here for feedback

    if (!loggedInUser) {
        if (savePlanMessageEl) {
            savePlanMessageEl.textContent = "Please log in to save your meal plan.";
            savePlanMessageEl.style.color = "red";
            setTimeout(() => { if (savePlanMessageEl) savePlanMessageEl.textContent = ""; }, 3000);
        } else {
            alert("Please log in to save your meal plan.");
        }
        return;
    }

    const currentPlan = getMealPlanDataFromUI();
    if (Object.keys(currentPlan).length === 0) {
         if (savePlanMessageEl) {
            savePlanMessageEl.textContent = "Could not read meal plan data from the page.";
            savePlanMessageEl.style.color = "red";
             setTimeout(() => { if(savePlanMessageEl) savePlanMessageEl.textContent = ""; }, 3000);
        } else {
            alert("Error: Could not read meal plan data.");
        }
        return;
    }


    let users = JSON.parse(localStorage.getItem('cooksmart_users')) || [];
    const userIndex = users.findIndex(u => u.email === loggedInUser.email);

    if (userIndex !== -1) {
        if (!users[userIndex].savedMealPlans) {
            users[userIndex].savedMealPlans = {};
        }
        users[userIndex].savedMealPlans.latest = {
            plan: currentPlanData,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('cooksmart_users', JSON.stringify(users));

        if (savePlanMessageEl) {
            savePlanMessageEl.textContent = "Meal plan saved successfully!";
            savePlanMessageEl.style.color = "green";
            setTimeout(() => { if (savePlanMessageEl) savePlanMessageEl.textContent = ""; }, 3000);
        } else {
            alert("Meal plan saved successfully!");
        }
    } else {
        // This case should ideally not happen if user is loggedInUser
        if (savePlanMessageEl) {
            savePlanMessageEl.textContent = "Error: User profile not found.";
            savePlanMessageEl.style.color = "red";
            setTimeout(() => { if (savePlanMessageEl) savePlanMessageEl.textContent = ""; }, 3000);
        } else {
            alert("Error: User profile not found.");
        }
    }
}

export function loadUserMealPlan() {
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return null; // No user, no plan to load

    const users = JSON.parse(localStorage.getItem('cooksmart_users')) || [];
    const user = users.find(u => u.email === loggedInUser.email);

    if (user && user.savedMealPlans && user.savedMealPlans.latest) {
        return user.savedMealPlans.latest.plan;
    }
    return null;
}
