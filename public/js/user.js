// User module for account-related functionality
const accountButton = document.getElementById("account-button");
const signOutButton = document.getElementById("sign-out-button");

document.addEventListener('DOMContentLoaded', function(){
    if(document.body.classList.contains('account-detail')){
        console.log('Account detail page loaded');
    }
});

// Account button functionality
async function onAccountButtonClicked() {
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
    
    if (currentUsername) {
        //set location to userScreen
        //alert('Fetching user data');
        const response = await fetch(`/api/auth/user/${currentUsername}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();
        //alert(`Data: ${data}`);
        const userId = data.user.userID;
        const username = data.user.username;
        //alert(`User ID: ${userId}, Username: ${username}`);
        if (response.ok) {
            //alert(`Setting location to account-detail.html?userId=${userId}`);
            window.location.href = `/account-detail.html?userId=${userId}`;
        }
    } else {
        window.location.href = '/usersignin.html';
    }
}

// Navigation functions
function onTopicsButtonClicked() {
    window.location.href = "/topics.html";
}

// Account UI update functions
function updateSignOutButton() {
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
    
    if (!currentUsername) {
        //hide sign out button
        if (signOutButton) signOutButton.style.display = 'none';
    } else {
        if (signOutButton) signOutButton.style.display = 'block';
    }
}

// Function to update account text display
function updateAccountText() {
    const accountTextElement = document.getElementById('account-text');
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
    
    if (accountTextElement) {
        if (currentUsername) {
            accountTextElement.textContent = currentUsername;
        } else {
            accountTextElement.textContent = 'Account';
        }
    }
}
function displayUserDetailPage(userId, username){
    const titleElement = document.getElementById('title');
    console.log(`User ID: ${userId}, Username: ${username}`);
    console.log(`Title Element: ${titleElement.textContent}`);
    if (titleElement) {
        titleElement.textContent = username;
    }
}
// Export functions for global access
window.userModule = {
    onAccountButtonClicked,
    onTopicsButtonClicked,
    updateSignOutButton,
    updateAccountText,
    displayUserDetailPage
};
