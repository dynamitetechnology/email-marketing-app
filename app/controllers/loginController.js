const {
    check,
    validationResult
} = require('express-validator');
const functions = require('../utils/functions');
require('dotenv').config();
const bcrypt = require('bcrypt');

const {
    v4: uuidv4
} = require('uuid');

module.exports = {

    getLoginPage: (req, res, next) => {
        
        res.render("index.ejs")
    },

    authenticateUsers: (req, res, next) => {

        console.log('USERNAME----------->', req.body.username)
        console.log('PASSWORD----------->', req.body.password)

        let db = req.app.locals.db;
        let redisDb = req.app.locals.redisdb;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
        let userObj = {};
        //async function execLogin() {
        ;
        (async () => {

            let userInput = await new Promise(function (resolve) {
                let userInputs = {
                    username: req.body.username
                };
                return resolve(userInputs);
            });

            let userData = await new Promise(resolve => {
                const userStmt = {
                    //text: "SELECT id, email, first_name, last_name, password, contact_number, email_verified, address, (SELECT name FROM country_list WHERE id = users.country_id) AS country, state, city, pincode, (SELECT role FROM user_role WHERE id = users.role) AS role, is_instructor FROM users WHERE email = $1",
                    text: "SELECT id,username,email,password,(SELECT name FROM role WHERE role.id = users.roleid) AS role FROM users WHERE username = $1 ",
                    values: [req.body.username]
                }
                db.query(userStmt, async (err, obj) => {
                    if (err) throw err;
                    let result = await obj.rows;
                    if (result.length == 0) {
                        return res.render("index.ejs", {
                            isLoggedIn: false,
                            msg: "Username or password is invalid",
                            userInput: userInput
                        })
                    } else {
                        return resolve(result[0]);
                    }
                })
            })

            let verifyPass = await new Promise(resolve => {
                console.log('bycrept enter------>', req.body.password, '+      +', userData.password)
                bcrypt.compare(req.body.password, userData.password, (err, result) => {
                    if (err) throw err;
                    console.log('result enter------>', result)
                    if (result) {
                        console.log('bycrept enter------>1')
                        userObj.id = userData.id;
                        userObj.username = userData.username;
                        userObj.email = userData.email;
                        userObj.role = userData.role;
                        let randomToken = uuidv4();
                        console.log('userObj------>', userObj)
                        //redisDb.hmset(randomNo, userObj, async (err, obj) => {          
                        redisDb.hmset(randomToken, userObj, async (err, obj) => {
                            if (err) throw err;
                            let response = await obj;

                            res.cookie('token', randomToken, {
                                httpOnly: true,
                                signed: false
                            });

                            
                                if (userData.role === "ADMIN") {

                                    console.log('Redirecting to ADMIN page----------->')

                                    return res.redirect('dashboard')

                                }

                        })
                    } else {
                        return res.render("login.ejs", {
                            msg: "Username or password is invalid",
                            isLoggedIn: false
                        })
                    }

                });

            })

            res.render("index.ejs");

        })()

    },

    logout: function (req, res, next) {
        console.log('logoutsucessfull')
        if (req.cookies.token) {
            let redisDb = req.app.locals.redisdb
            redisDb.hmget(req.cookies.token, 'username', async function (err, obj) {
                if (err) throw err;

                let response = await obj
                redisDb.del(req.cookies.token, async function (err, obj) {
                    if (err) throw err;
                    let response = await obj
                    res.clearCookie('token');
                    res.redirect('/')

                })
            })
        }
    },

}