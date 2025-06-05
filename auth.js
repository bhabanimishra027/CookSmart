// js/auth.js
import * as DOM from './domElements.js';

export function getLoggedInUser() {
    const user = localStorage.getItem('cooksmart_loggedInUser');
    return user ? JSON.parse(user) : null;
}

export function updateNav() {
    if (!DOM.navLinks) return;
    const loggedInUser = getLoggedInUser();
    // Clear existing dynamic links (ones with class .dynamic-nav-link)
    const dynamicLinks = DOM.navLinks.querySelectorAll('.dynamic-nav-link');
    dynamicLinks.forEach(link => link.remove());

    if (loggedInUser) {
        const accountLi = document.createElement('li');
        accountLi.classList.add('dynamic-nav-link');
        accountLi.innerHTML = `<a href="account.html">My Account (${loggedInUser.email.split('@')[0]})</a>`;
        DOM.navLinks.appendChild(accountLi);

        const logoutLi = document.createElement('li');
        logoutLi.classList.add('dynamic-nav-link');
        const logoutLink = document.createElement('a');
        logoutLink.href = "#";
        logoutLink.textContent = "Logout";
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('cooksmart_loggedInUser');
            // Potentially clear other user-specific session data if needed
            updateNav(); // Refresh nav
            if (window.location.pathname.endsWith('account.html')) {
                 window.location.href = 'index.html'; // Redirect from account page after logout
            } else {
                window.location.reload(); // Reload current page to reflect logged-out state
            }
        });
        logoutLi.appendChild(logoutLink);
        DOM.navLinks.appendChild(logoutLi);
    } else {
        const loginLi = document.createElement('li');
        loginLi.classList.add('dynamic-nav-link');
        loginLi.innerHTML = `<a href="login.html">Login/Sign Up</a>`;
        DOM.navLinks.appendChild(loginLi);
    }
}