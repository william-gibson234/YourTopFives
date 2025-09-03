const usernameInput = document.getElementById("username")
const passwordInput = document.getElementById("password")
const enterButton = document.getElementById("enter-button")
const createAccountButton = document.getElementById("create-acc-button")

currentUsername = null

enterButton.addEventListener("click",onEnterButtonClicked)
createAccountButton.addEventListener("click",onCreateAccountButtonClicked)
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
            window.location.href = '/yourtopfives.html';
        }
        else{
            console.log('Sign in failed',data.error);
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
                currentUsername = data.username;
                window.location.href = '/yourtopfives.html';
            }
            else{
                console.log('Sign in failed',data.error);
            }
        }
        catch(err){
            console.log('Registration failed',err);
        }
        clearTextInputs();
    }
    
}

function clearTextInputs(){
    usernameInput.value="";
    passwordInput.value="";
}