const express = require('express');
const {runTopicQuery, getTopicQuery, getAllTopicQuery, getUserQuery} = require('../db/database.js');

const router = express.Router();

// Create a new topic
router.post('/create', async (req, res) => {
    const { name, description, createdBy } = req.body;

    if (!name || !description || !createdBy) {
        return res.status(400).json({ error: 'Topic name, description, and creator are required' });
    }

    try {
        // Check if topic name already exists
        const existingTopic = await getTopicQuery('SELECT * FROM topic_database WHERE topicTitle = ?', [name]);
        if (existingTopic) {
            return res.status(400).json({ error: 'Topic name already exists' });
        }

        // Get user ID from username
        const user = await getUserQuery('SELECT user_id FROM user_database WHERE username = ?', [createdBy]);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Insert new topic
        const result = await runTopicQuery(
            'INSERT INTO topic_database (topicTitle, topicDescription, user_id) VALUES (?, ?, ?)',
            [name, description, user.user_id]
        );

        res.json({ 
            message: 'Topic created successfully', 
            topicId: result.lastID,
            topicName: name 
        });
    } catch (err) {
        console.error('Topic creation failed:', err);
        return res.status(500).json({ error: 'Failed to create topic' });
    }
});

// Get all topics
router.get('/all', async (req, res) => {
    try {
        const topics = await getAllTopicQuery('SELECT * FROM topic_database ORDER BY topicID DESC');
        
        // Get usernames for each topic
        const topicsWithUsernames = await Promise.all(
            topics.map(async (topic) => {
                const user = await getUserQuery('SELECT username FROM user_database WHERE user_id = ?', [topic.user_id]);
                return {
                    ...topic,
                    createdBy: user ? user.username : 'Unknown User'
                };
            })
        );
        
        res.json({ topics: topicsWithUsernames });
    } catch (err) {
        console.error('Failed to fetch topics:', err);
        return res.status(500).json({ error: 'Failed to fetch topics' });
    }
});

// Get topics by user
router.get('/user/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // First get the user ID
        const user = await getUserQuery('SELECT user_id FROM user_database WHERE username = ?', [username]);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Then get topics for that user
        const topics = await getAllTopicQuery('SELECT * FROM topic_database WHERE user_id = ? ORDER BY topicID DESC', [user.user_id]);
        
        // Add username to each topic
        const topicsWithUsernames = topics.map(topic => ({
            ...topic,
            createdBy: username
        }));
        
        res.json({ topics: topicsWithUsernames });
    } catch (err) {
        console.error('Failed to fetch user topics:', err);
        return res.status(500).json({ error: 'Failed to fetch user topics' });
    }
});

// Get single topic by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const topic = await getTopicQuery('SELECT * FROM topic_database WHERE topicID = ?', [id]);
        
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        // Get username for the topic
        const user = await getUserQuery('SELECT username FROM user_database WHERE user_id = ?', [topic.user_id]);
        
        const topicWithUsername = {
            ...topic,
            createdBy: user ? user.username : 'Unknown User'
        };
        
        res.json({ topic: topicWithUsername });
    } catch (err) {
        console.error('Failed to fetch topic:', err);
        return res.status(500).json({ error: 'Failed to fetch topic' });
    }
});

// Update topic
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, username } = req.body;

    if (!name || !description) {
        return res.status(400).json({ error: 'Topic name and description are required' });
    }

    try {
        // Verify user owns the topic
        const topic = await getTopicQuery('SELECT * FROM topic_database WHERE topicID = ?', [id]);
        
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        // Get user ID from username
        const user = await getUserQuery('SELECT user_id FROM user_database WHERE username = ?', [username]);
        
        if (!user || user.user_id !== topic.user_id) {
            return res.status(403).json({ error: 'You can only edit your own topics' });
        }

        // Update topic
        await runTopicQuery(
            'UPDATE topic_database SET topicTitle = ?, topicDescription = ? WHERE topicID = ?',
            [name, description, id]
        );

        res.json({ message: 'Topic updated successfully' });
    } catch (err) {
        console.error('Failed to update topic:', err);
        return res.status(500).json({ error: 'Failed to update topic' });
    }
});

// Delete topic
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        // Verify user owns the topic
        const topic = await getTopicQuery('SELECT * FROM topic_database WHERE topicID = ?', [id]);
        
        if (!topic) {
            return res.status(404).json({ error: 'Topic not found' });
        }
        
        // Get user ID from username
        const user = await getUserQuery('SELECT user_id FROM user_database WHERE username = ?', [username]);
        
        if (!user || user.user_id !== topic.user_id) {
            return res.status(403).json({ error: 'You can only delete your own topics' });
        }

        // Delete topic
        await runTopicQuery('DELETE FROM topic_database WHERE topicID = ?', [id]);

        res.json({ message: 'Topic deleted successfully' });
    } catch (err) {
        console.error('Failed to delete topic:', err);
        return res.status(500).json({ error: 'Failed to delete topic' });
    }
});

module.exports = router;
