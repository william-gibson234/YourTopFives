const express = require('express');
const bcrypt = require('bcrypt')

const {runQuery, getQuery} = require('../db/database.js');

router = express.Router();

router.post('\register', async (req,res) =>{
    const{username, password} = req.body;

    if(!username||!password){
        return res.status(400).json({error:'All fields required'});
    }

    try{
        //Query database to see if username already exists
        const existingUser = await getQuery('SELECT * FROM user_database WHERE username = ?',[username])
        if(existingUser){
            return res.status(400).json({error: 'Username Already Exists'});
        }

        const hashedPassword = bcrypt.hash(password,10);

        const result = await runQuery('INSERT INTO user_database (username, password) VALUES (?,?)',[username,hashedPassword]);

        res.json({message: 'User successfully added', userId:result.id});
    }
    catch(err){
        console.log('registration failed')
        return res.status(500).json({error: 'User already exists'});
    }
});

router.post('/signin',async (res,req) =>{
    const{username, password} = req.body;

    if(!username||!password){
        return res.status(400).json({error:'All fields required'});
    }

    //Query database to see if username exists
    try{
        const user = await getQuery('SELECT * FROM user_database WHERE username = ?',[username]);

        if(!user){
            //username does not exist
            return res.status(400).json({error: 'Username does not exist'});
        }

        const validPassword = bcrypt.compare(user.password,password);
        if(!validPassword){
            return res.status(400).json({error:'Invalid Password'})
        } 

        res.json({message:'Login Successful', userId: user.id, userUsername:user.username});
    }
    catch{
        console.log("Internal server error")
        res.status(400).json({error: 'Internal Server Error'})
    }
});

module.exports = router;