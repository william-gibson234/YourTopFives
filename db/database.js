const sqlite3 = require('sqlite3');
const path = require('path');

const user_database_path = path.join(__dirname,'user_database.db');

let user_database = new sqlite3.Database(user_database_path, (err)=>{
    if(err){
        console.error('Invalid Database Path')
    }
    else{
        console.log('Valid Database');
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
            console.log('Table created or already exists');
        }
    });
});

//Query add edit delete from rows
//Returns the new row after the additions, edits, deletions
function runQuery(sql, params){
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

//Query a specific row
function getQuery(sql,params){
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

//Query multiple rows
function allQuery(sql,params){
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

module.exports = {
    user_database,
    runQuery,
    getQuery,
    allQuery
}