// Authentication module
// Global variables for authentication
let currentUsername = localStorage.getItem('currentUsername') || null;

// DOM elements for authentication
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const enterButton = document.getElementById("enter-button");
const createAccountButton = document.getElementById("create-acc-button");

// Authentication functions
async function onEnterButtonClicked() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username && password) {
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            clearTextInputs();

            if (response.ok) {
                currentUsername = data.userUsername;
                localStorage.setItem('currentUsername', currentUsername);
                //alert('Sign in successful!');
                window.location.href = '/yourtopfives.html';
            } else {
                alert(data.error || 'Sign in failed');
            }
        } catch (err) {
            console.log('Sign in failed', err);
        }
    }
}

async function onCreateAccountButtonClicked() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username && password) {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });
            const data = await response.json();
            if (response.ok) {
                currentUsername = data.userUsername;
                localStorage.setItem('currentUsername', currentUsername);
                //alert('Account created successfully!');
                window.location.href = '/yourtopfives.html';
            } else {
                alert(data.error || 'Account creation failed');
            }
        } catch (err) {
            console.log('Registration failed', err);
        }
        clearTextInputs();
    }
}

function onSignOutButtonClicked() {
    localStorage.removeItem('currentUsername');
    currentUsername = null;
    window.userModule.updateAccountText();
    window.userModule.updateSignOutButton();
}

// Utility function for clearing inputs
function clearTextInputs() {
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";
}

// Export functions for use in other modules
window.authModule = {
    currentUsername: () => currentUsername,
    setCurrentUsername: (username) => {
        currentUsername = username;
        localStorage.setItem('currentUsername', currentUsername);
    },
    clearCurrentUsername: () => {
        currentUsername = null;
        localStorage.removeItem('currentUsername');
    },
    onEnterButtonClicked,
    onCreateAccountButtonClicked,
    onSignOutButtonClicked
};
