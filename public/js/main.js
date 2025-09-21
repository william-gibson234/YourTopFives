// Main entry point - imports all modules and sets up event listeners
// This file replaces script.js and coordinates all modules

// Import all modules (they will be loaded via script tags in HTML)
// The modules will be available as window.authModule, window.topicsModule, etc.

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    console.log('Initializing app...');
    
    // Set up authentication event listeners
    setupAuthListeners();
    
    // Set up user interface
    setupUserInterface();
    
    // Set up page-specific functionality
    setupPageSpecificFunctionality();
    
    // Additional timeout to ensure DOM is ready
    setTimeout(() => {
        setupPageSpecificFunctionality();
    }, 100);
}

// Set up authentication event listeners
function setupAuthListeners() {
    const enterButton = document.getElementById("enter-button");
    const createAccountButton = document.getElementById("create-acc-button");
    
    if (enterButton) {
        enterButton.addEventListener("click", window.authModule.onEnterButtonClicked);
    }
    if (createAccountButton) {
        createAccountButton.addEventListener("click", window.authModule.onCreateAccountButtonClicked);
    }
}

// Set up user interface event listeners
function setupUserInterface() {
    const signOutButton = document.getElementById("sign-out-button");
    const accountButton = document.getElementById("account-button");
    const topicsButton = document.getElementById("topic-navigation-button");
    const createTopicButton = document.getElementById("create-topic-button");
    
    if (signOutButton) {
        signOutButton.addEventListener("click", window.userModule.onSignOutButtonClicked);
    }
    if (accountButton) {
        accountButton.addEventListener("click", window.userModule.onAccountButtonClicked);
    }
    if (topicsButton) {
        topicsButton.addEventListener("click", window.userModule.onTopicsButtonClicked);
    }
    if (createTopicButton) {
        createTopicButton.addEventListener("click", window.topicsModule.onCreateTopicButtonClicked);
    }
}

// Set up page-specific functionality
function setupPageSpecificFunctionality() {
    const body = document.body;
    
    if (!body) return;
    
    // Update account text for pages with account container
    if (body.classList.contains('homepage') || 
        body.classList.contains('topics') || 
        body.classList.contains('create-topic')) {
        window.userModule.updateAccountText();
        window.userModule.updateSignOutButton();
    }
    
    // Initialize specific pages
    if (body.classList.contains('topics')) {
        window.topicsModule.initializeTopicsPage();
    }
    
    if (body.classList.contains('topic-detail')) {
        const topicId = parseInt(window.location.search.split('=')[1]);
        window.topicsModule.initializeTopicDetailPage(topicId);
    }
    
    if (body.classList.contains('topic-detail') && window.location.pathname.includes('account-detail')) {
        const userId = parseInt(window.location.search.split('=')[1]);
        const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
        if (currentUsername) {
            window.userModule.displayUserDetailPage(userId, currentUsername);
        }
    }
}

// Make functions available globally for backward compatibility
window.onEnterButtonClicked = window.authModule.onEnterButtonClicked;
window.onCreateAccountButtonClicked = window.authModule.onCreateAccountButtonClicked;
window.onSignOutButtonClicked = window.userModule.onSignOutButtonClicked;
window.onAccountButtonClicked = window.userModule.onAccountButtonClicked;
window.onTopicsButtonClicked = window.userModule.onTopicsButtonClicked;
window.onCreateTopicButtonClicked = window.topicsModule.onCreateTopicButtonClicked;
window.viewTopic = window.topicsModule.viewTopic;
window.deleteTopic = window.topicsModule.deleteTopic;
