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
    `CREATE TABLE IF NOT EXISTS user_database (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT)`
}

//Query add edit delete from rows
//Returns the new row after the additions, edits, deletions
function runQuery(sql, params[]){
    return new Promise((resolve,reject)=>{
        user_database.run(sql,params, fuction (err) {
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
function addQuery(sql,params[]){
    return new Promise((resolve,reject) =>{
        user_database.add(sql,params, (err) =>{
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
function allQuery(sql,params[]){
    return new Promise((resolve,reject) =>{
        user_database.all(sql,params,(err)=>{
            if(err){
                reject(row);
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
    addQuery,
    allQuery
}