const {Pool} = require('pg');
require('dotenv').config()

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

let query = function makeQuery(...args){
    return new Promise(function(resolve, reject){
        args[0].query(args[1])
        .then(function(result){
            args[0].release()
            resolve(result.rows)
        })
        .catch(function(err){
            args[0].release()
            reject(err)
        })
    })
}

module.exports = { pgPool: pool}