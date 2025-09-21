// Topics module
// DOM elements for topics
const topicTemplate = document.getElementById('topic-template');
const createTopicContainer = document.getElementById('topic-container');
const createTopicButton = document.getElementById("create-topic-button");
const topicTitleInput = document.getElementById("topic-name");
const topicDescriptionInput = document.getElementById("topic-description");

// Topics page initialization
function initializeTopicsPage() {
    console.log('Topics page loaded!');
    if (topicTemplate) topicTemplate.style.display = 'none';
    
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
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
    
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
    
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;
    
    try {
        const response = await fetch(`/api/topics/${topicId}`, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username: currentUsername})
        });
        
        const data = await response.json();
        
        if (response.ok) {
            //alert('Topic deleted successfully!');
            loadAllTopics(); // Reload the topics
        } else {
            alert(data.error || 'Failed to delete topic');
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        alert('An error occurred while deleting the topic');
    }
}

// Topic detail page functionality
async function initializeTopicDetailPage(topicId) {
    try {
        const response = await fetch(`/api/topics/${topicId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'},
        });
        const data = await response.json();

        if (response.ok) {
            const topic = data.topic;

            const topicName = topic.topicTitle;
            const topicDescription = topic.topicDescription;
            const topicCreator = topic.createdBy;

            DisplayTopicTitles(topicName, topicDescription, topicCreator);
            window.userModule.updateSignOutButton();
            window.userModule.updateAccountText();
        }
    } catch (error) {
        console.error(`Unable to load topic with id ${topicId}:`, error);
    }
}

function DisplayTopicTitles(topicName, topicDescription, topicCreator) {
    const topicTitleElement = document.getElementById('topic-title');
    const topicDescriptionElement = document.getElementById('topic-description');
    const topicCreatorElement = document.getElementById('topic-creator');

    if (topicTitleElement && topicDescriptionElement && topicCreatorElement) {
        topicTitleElement.textContent = topicName;
        topicDescriptionElement.textContent = "Description: " + topicDescription;
        topicCreatorElement.textContent = "Created by: " + topicCreator;
    }
}

// Create topic functionality
async function onCreateTopicButtonClicked(event) {
    event.preventDefault(); // Prevent form submission
    
    const topic = topicTitleInput.value.trim();
    const description = topicDescriptionInput.value.trim();
    const currentUsername = window.authModule ? window.authModule.currentUsername() : null;

    if (!topic || !description) {
        alert('Please fill in both topic name and description.');
        return;
    }

    if (!currentUsername) {
        alert('You must be signed in to create a topic.');
        return;
    }

    try {
        const response = await fetch('/api/topics/create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: topic,
                description: description,
                createdBy: currentUsername
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            //alert('Topic created successfully!');
            window.location.href = '/topics.html';
        } else {
            alert(data.error || 'Failed to create topic');
        }
    } catch (error) {
        console.error('Error creating topic:', error);
        alert('An error occurred while creating the topic. Please try again.');
    }
}

// Export functions for global access
window.topicsModule = {
    initializeTopicsPage,
    initializeTopicDetailPage,
    viewTopic,
    deleteTopic,
    onCreateTopicButtonClicked
};
