// Utility functions and shared functionality
// This module contains functions that are used across multiple modules

// Global utility functions
function showAlert(message) {
    alert(message);
}

function navigateTo(url) {
    window.location.href = url;
}

function getCurrentUsername() {
    return window.authModule ? window.authModule.currentUsername() : null;
}

// DOM utility functions
function getElementById(id) {
    return document.getElementById(id);
}

function addEventListenerSafe(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

// Export utility functions
window.utilsModule = {
    showAlert,
    navigateTo,
    getCurrentUsername,
    getElementById,
    addEventListenerSafe
};
