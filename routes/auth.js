const express = require('express');
const bcrypt = require('bcrypt')

const {runUserQuery, getUserQuery} = require('../db/database.js');

const router = express.Router();

router.get('/user/:username',async (req,res) =>{
    console.log('Fetching user data2');
    const {username} = req.params;
    console.log(`username: ${username}`);
    if(!username){
        return res.status(400).json({error:'Username is required'});
    }
    try{
        const user = await getUserQuery('SELECT * FROM user_database WHERE username = ?',[username]);
        console.log(`UserID: ${user.userId}`);
        if(!user){
            return res.status(400).json({error:'User not found'});
        }
        res.json({user});
    }
    catch(err){
        console.log('Internal server error', err);
        res.status(500).json({error:'Internal Server Error'});
    }
}); 

router.post('/register', async (req,res) =>{
    const{username, password} = req.body;

    if(!username||!password){
        return res.status(400).json({error:'All fields required'});
    }

    try{
        //Query database to see if username already exists
        const existingUser = await getUserQuery('SELECT * FROM user_database WHERE username = ?',[username])
        if(existingUser){
            return res.status(400).json({error: 'Username Already Exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const result = await runUserQuery('INSERT INTO user_database (username, password) VALUES (?,?)',[username,hashedPassword]);

        res.json({message: 'User successfully added', userId:result.id, userUsername:username});
    }
    catch(err){
        console.log('registration failed', err)
        return res.status(500).json({error: 'Registration failed'});
    }
});

router.post('/signin',async (req,res) =>{
    const{username, password} = req.body;

    if(!username||!password){
        return res.status(400).json({error:'All fields required'});
    }

    //Query database to see if username exists
    try{
        const user = await getUserQuery('SELECT * FROM user_database WHERE username = ?',[username]);

        if(!user){
            //username does not exist
            return res.status(400).json({error: 'Username does not exist'});
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json({error:'Invalid Password'})
        } 

        res.json({message:'Login Successful', userId: user.userID, userUsername:user.username});
    }
    catch(err){
        console.log("Internal server error", err)
        res.status(500).json({error: 'Internal Server Error'})
    }
});

module.exports = router;