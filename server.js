const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

app.use('/api/auth',authRoutes);

app.get('/', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','yourtopfives.html'));
});
app.get('/signin', (req,res) =>{
    res.sendFile(path.join(__dirname,'public','usersignin.html'))
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});