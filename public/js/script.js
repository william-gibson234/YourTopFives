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
async function onAccountButtonClicked(){
    if(currentUsername){
        //set location to userScreen
        alert('Fetching user data');
        const response = await fetch(`/api/auth/user?username = ${currentUsername}`,{
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data  = await response.json();
        alert(`Data: ${data}`);
        const userId = data.user.userId;
        const username = data.user.username;
        alert(`User ID: ${userId}, Username: ${username}`);
        if(response.ok){
            alert(`Setting location to account-detail.html?userId=${userId}`);
            window.location.href = `/acount-detail.html?userId=${userId}`;
        }

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

// Also call updateAccountText immediately for pages with account container
// This ensures it runs even if DOMContentLoaded has already fired
if (document.body && (document.body.classList.contains('homepage') || 
    document.body.classList.contains('topics') || 
    document.body.classList.contains('create-topic'))) {
    updateAccountText();
    updateSignOutButton();
}

// Additional timeout to ensure DOM is ready
setTimeout(() => {
    if (document.body && (document.body.classList.contains('homepage') || 
        document.body.classList.contains('topics') || 
        document.body.classList.contains('create-topic'))) {
        console.log('Timeout updateAccountText called');
        updateAccountText();
        updateSignOutButton();
    }
    
    // Run topics page specific code
    if (document.body && document.body.classList.contains('topics')) {
        initializeTopicsPage();
    }
    if(document.body && document.body.classList.contains('topic-detail')){
        initializeTopicDetailPage(parseInt(window.location.search.split('=')[1]));
    }
}, 100);

//Loading Topic Detail Page
async function initializeTopicDetailPage(topicId){
    try{
        const response  = await fetch(`/api/topics/${topicId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();

        if(response.ok){
            const topic = data.topic;

            const topicName = topic.topicTitle;
            const topicDescription = topic.topicDescription;
            const topicCreator = topic.createdBy;

            DisplayTopicTitles(topicName, topicDescription, topicCreator);
        }
    }
    catch(error){
        console.error(`Unable to load topic with id ${topicId}:`, error);
    }
}
function DisplayTopicTitles(topicName, topicDescription, topicCreator){
    const topicTitleElement = document.getElementById('topic-title');
    const topicDescriptionElement = document.getElementById('topic-description');
    const topicCreatorElement = document.getElementById('topic-creator');

    if(topicTitleElement && topicDescriptionElement && topicCreatorElement){
        topicTitleElement.textContent = topicName;
        topicDescriptionElement.textContent = "Description: "+topicDescription;
        topicCreatorElement.textContent = "Created by: "+topicCreator;
    }
}


const topicTemplate = document.getElementById('topic-template');
const createTopicContainer = document.getElementById('topic-container');

// Function to run when topics page loads
function initializeTopicsPage() {
    console.log('Topics page loaded!');
    topicTemplate.style.display = 'none';
    
    // Load all topics from the database
    loadAllTopics();
    
    // Set up any topics page specific event listeners
    setupTopicsPageListeners();
}

// Function to load all topics
async function loadAllTopics() {
    try {
        const response = await fetch('/api/topics/all');
        const data = await response.json();
        
        if (response.ok) {
            console.log('Topics loaded:', data.topics);
            displayTopics(data.topics);
        } else {
            console.error('Failed to load topics:', data.error);
        }
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

// Function to display topics on the page
function displayTopics(topics) {
    const topicContainer = document.getElementById('topic-container');
    
    if (!topicContainer) {
        console.error('Topic container not found');
        return;
    }
    
    // Clear existing topics (except the template)
    const existingTopics = document.querySelectorAll('.topic-item');
    existingTopics.forEach(topic => topic.remove());
    
    // Create topic elements for each topic
    topics.forEach(topic => {
        const topicElement = createTopicElement(topic);
        topicContainer.appendChild(topicElement);
    });
}

// Function to create a topic element
function createTopicElement(topic) {
    const topicDiv = document.createElement('div');
    topicDiv.className = 'topic-item';
    topicDiv.style.cssText = `
        flex: 0 0 300px;
        border: 3px white solid;
        padding: 5px;
        margin: 15px;
        background-color: transparent;
        min-height: 150px;
        max-width: 300px;
        visibility: visible;
        opacity: 1;
    `;
    
    topicDiv.innerHTML = `
        <h3 class="topic-title">${topic.topicTitle}</h3>
        <p class="topic-creator">Created by: ${topic.createdBy}</p>
        <p class="topic-description">${topic.topicDescription}</p>
        <div class="topic-actions">
            <a href="#" class="button" onclick="viewTopic(${topic.topicID})">View Topic</a>
            ${topic.createdBy === currentUsername ? 
                `<a href="#" class="button" onclick="deleteTopic(${topic.topicID})">Delete</a>` : 
                ''
            }
        </div>
    `;
    
    return topicDiv;
}

// Function to set up topics page specific event listeners
function setupTopicsPageListeners() {
    // Add any specific event listeners for the topics page
    console.log('Topics page listeners set up');
}

// Topic action functions
function viewTopic(topicId) {
    window.location.href = `/topic-detail.html?topicId=${topicId}`;
}

async function deleteTopic(topicId) {
    if (!confirm('Are you sure you want to delete this topic?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/topics/${topicId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: currentUsername})
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Topic deleted successfully!');
            loadAllTopics(); // Reload the topics
        } else {
            alert(data.error || 'Failed to delete topic');
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        alert('An error occurred while deleting the topic');
    }
}

//Functionality to create topics
const createTopicButton = document.getElementById("create-topic-button");
const topicTitleInput = document.getElementById("topic-name");
const topicDescriptionInput = document.getElementById("topic-description");

if(createTopicButton){
    createTopicButton.addEventListener("click",onCreateTopicButtonClicked);
}

async function onCreateTopicButtonClicked(event){
    event.preventDefault(); // Prevent form submission
    
    const topic = topicTitleInput.value.trim();
    const description = topicDescriptionInput.value.trim();

    if(!topic || !description){
        alert('Please fill in both topic name and description.');
        return;
    }

    if(!currentUsername){
        alert('You must be signed in to create a topic.');
        return;
    }

    try{
        const response = await fetch('/api/topics/create', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                name: topic,
                description: description,
                createdBy: currentUsername
            })
        });
        
        const data = await response.json();
        
        if(response.ok){
            alert('Topic created successfully!');
            window.location.href = '/topics.html';
        } else {
            alert(data.error || 'Failed to create topic');
        }
    } catch(error) {
        console.error('Error creating topic:', error);
        alert('An error occurred while creating the topic. Please try again.');
    }
}
