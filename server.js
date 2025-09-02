const express = require('express');
const path = require('path');

const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api/auth',authRoutes);

app.get('/', (res,req) =>{
    res.sendFile(path.join(__dirname,'public','yourtopfives.html'));
});
app.get('/signin', (res,req) =>{
    res.sendFile(path.join(__dirname,'public','usersignin.html'))
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
});