const sqlite3 = require('sqlite3');
const path = require('path');

const user_database_path = path.join(__dirname,'user_database.db');
const topic_data_path = path.join(__dirname,'topic_database.db');

let user_database = new sqlite3.Database(user_database_path, (err)=>{
    if(err){
        console.error('Invalid User Database Path')
    }
    else{
        console.log('Valid User Database');
    }
});

let topic_database = new sqlite3.Database(topic_data_path, (err)=>{
    if(err){
        console.error('Invalid Topic Database Path')
    }
    else{
        console.log('Valid TopicDatabase');
    }
});
user_database.serialize(()=>{
    user_database.run(`CREATE TABLE IF NOT EXISTS user_database (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT)`, (err) => {
        if(err) {
            console.error('Error creating table:', err);
        } else {
            console.log('UserTable created or already exists');
        }
    });
});

topic_database.serialize(()=>{
    topic_database.run(`CREATE TABLE IF NOT EXISTS topic_database (
    topicID INTEGER PRIMARY KEY AUTOINCREMENT,
    topicTitle TEXT UNIQUE,
    topicDescription TEXT,
    user_id INTEGER)`, (err) => {
        if(err) {
            console.error('Error creating topic database table:', err);
        } else {
            console.log('Topic Table created or already exists');
        }
    });
    
    // Add topicDescription column if it doesn't exist (for existing databases)
    topic_database.run(`ALTER TABLE topic_database ADD COLUMN topicDescription TEXT`, (err) => {
        if(err && !err.message.includes('duplicate column name')) {
            console.error('Error adding topicDescription column:', err);
        } else if (!err) {
            console.log('topicDescription column added successfully');
        }
    });
});

//USER DATABASE QUERY FUNCTIONS
//Query add edit delete from rows - USER DATABASE
function runUserQuery(sql, params){
    return new Promise((resolve,reject)=>{
        user_database.run(sql,params, function (err) {
            if(err){
                reject(err);
            }
            else{
                resolve({id: this.lastID});
            }
        });
    });
}

//Query a specific row - USER DATABASE
function getUserQuery(sql,params){
    return new Promise((resolve,reject) =>{
        user_database.get(sql,params, (err, row) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        });
    })
}

//Query multiple rows - USER DATABASE
function getAllUserQuery(sql,params){
    return new Promise((resolve,reject) =>{
        user_database.all(sql,params,(err, rows)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(rows)
            }
        })
    })
}

//TOPIC DATABASE QUERY FUNCTIONS
//Query add edit delete from rows - TOPIC DATABASE
function runTopicQuery(sql, params){
    return new Promise((resolve,reject)=>{
        topic_database.run(sql,params, function (err) {
            if(err){
                reject(err);
            }
            else{
                resolve({id: this.lastID});
            }
        });
    });
}

//Query a specific row - TOPIC DATABASE
function getTopicQuery(sql,params){
    return new Promise((resolve,reject) =>{
        topic_database.get(sql,params, (err, row) =>{
            if(err){
                reject(err);
            }
            else{
                resolve(row);
            }
        });
    })
}

//Query multiple rows - TOPIC DATABASE
function getAllTopicQuery(sql,params){
    return new Promise((resolve,reject) =>{
        topic_database.all(sql,params,(err, rows)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(rows)
            }
        })
    })
}

//LEGACY FUNCTIONS (for backward compatibility)
//These still work with user database only
function runQuery(sql, params){
    return runUserQuery(sql, params);
}

function getQuery(sql,params){
    return getUserQuery(sql,params);
}

function allQuery(sql,params){
    return getAllUserQuery(sql,params);
}

//Clear all data from both databases
function clearAllData(){
    return new Promise(async (resolve,reject) =>{
        try {
            // Clear user database
            await new Promise((resolveUser, rejectUser) => {
                user_database.run('DELETE FROM user_database', (err) => {
                    if(err){
                        rejectUser(err);
                    } else {
                        console.log('All user data cleared successfully');
                        resolveUser();
                    }
                });
            });

            // Clear topic database
            await new Promise((resolveTopic, rejectTopic) => {
                topic_database.run('DELETE FROM topic_database', (err) => {
                    if(err){
                        rejectTopic(err);
                    } else {
                        console.log('All topic data cleared successfully');
                        resolveTopic();
                    }
                });
            });

            resolve({message: 'All data cleared successfully from both databases'});
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    user_database,
    topic_database,
    // Legacy functions (user database only)
    runQuery,
    getQuery,
    allQuery,
    // User database functions
    runUserQuery,
    getUserQuery,
    getAllUserQuery,
    // Topic database functions
    runTopicQuery,
    getTopicQuery,
    getAllTopicQuery,
    // Utility functions
    clearAllData
}