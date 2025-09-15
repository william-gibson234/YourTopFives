const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")
const enterButton = document.getElementById("enter-button")
const createAccountButton = document.getElementById("create-acc-button")
const signOutButton = document.getElementById("sign-out-button")
const accountButton = document.getElementById("account-button")
const topicsButton = document.getElementById("topic-navigation-button")

currentUsername = localStorage.getItem('currentUsername') || null

// Only add event listeners if the elements exist (sign-in page)
if (enterButton) {
    enterButton.addEventListener("click",onEnterButtonClicked)
}
if (createAccountButton) {
    createAccountButton.addEventListener("click",onCreateAccountButtonClicked)
}
//Only add event listener if the element exists (yourtopfives page)
if (signOutButton) {
    signOutButton.addEventListener("click",onSignOutButtonClicked)
}
if (accountButton) {
    accountButton.addEventListener("click",onAccountButtonClicked)
}
if(topicsButton){
    topicsButton.addEventListener("click",onTopicsButtonClicked)
}

async function onEnterButtonClicked(){
    //get username and passwords from their respective inputs
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if(username && password){
        try{
            const response = await fetch(
                '/api/auth/signin', {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({username,password})
            });
        const data = await response.json();
        clearTextInputs();

        if(response.ok){
            currentUsername = data.userUsername;
            localStorage.setItem('currentUsername', currentUsername);
            alert('Sign in successful!');
            window.location.href = '/yourtopfives.html';
        }
        else{
            alert(data.error || 'Sign in failed');
        }
    }
    catch(err){
        console.log('Sign in failed', err);
    }
    }
}
async function onCreateAccountButtonClicked(){
    const username = usernameInput.value.trim()
    const password = passwordInput.value.trim()

    if(username && password){
        try{
            const response = await fetch(
                '/api/auth/register', {
                    method: 'POST',
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({username,password})
                }
            );
            const data = await response.json();
            if(response.ok){
                currentUsername = data.userUsername;
                localStorage.setItem('currentUsername', currentUsername);
                alert('Account created successfully!');
                window.location.href = '/yourtopfives.html';
            }
            else{
                alert(data.error || 'Account creation failed');
            }
        }
        catch(err){
            console.log('Registration failed',err);
        }
        clearTextInputs();
    }
    
}
function onSignOutButtonClicked(){
    localStorage.removeItem('currentUsername');
    currentUsername = null;
    updateAccountText();
    updateSignOutButton();
}
function onAccountButtonClicked(){
    if(currentUsername){
        //set location to userScreen
    }
    else{
        window.location.href = '/usersignin.html';
    }
}
function onTopicsButtonClicked(){
    window.location.href = "/topics.html";
}

function clearTextInputs(){
    usernameInput.value="";
    passwordInput.value="";
}


function updateSignOutButton(){
    if(!currentUsername){
        //hide sign out button
        signOutButton.style.display = 'none';
    }
    else{
        signOutButton.style.display = 'block';
    }
}
// Function to update account text display
function updateAccountText() {
    const accountTextElement = document.getElementById('account-text');
    
    if (accountTextElement) {
        if (currentUsername) {
            accountTextElement.textContent = currentUsername;
        } else {
            accountTextElement.textContent = 'Account';
        }
    }
}

// Update account text when page loads
document.addEventListener('DOMContentLoaded', updateAccountText);

// Also call updateAccountText immediately for yourtopfives page
// This ensures it runs even if DOMContentLoaded has already fired
if (document.body && document.body.classList.contains('homepage')) {
    updateAccountText();
    updateSignOutButton();
}

// Additional timeout to ensure DOM is ready
setTimeout(() => {
    if (document.body && document.body.classList.contains('homepage')) {
        console.log('Timeout updateAccountText called');
        updateAccountText();
        updateSignOutButton();
    }
}, 100);

