const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.js');
const topicRoutes = require('./routes/topics.js')
const postRoutes = require('./routes/posts.js')

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

app.use('/api/auth',authRoutes);
app.use('/api/topics',topicRoutes);
app.use('/api/posts',postRoutes);

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','yourtopfives.html'));
});
app.get('/signin', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','usersignin.html'))
});
app.get('/topics', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','topics.html'));
});

app.get('/topics/:id', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','topic-detail.html'));
});

app.get('/create-topic', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','create-topic.html'));
});

app.get('/account', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','account-detail.html'));
});
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});