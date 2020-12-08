const {
    check,
    validationResult
} = require('express-validator');
const { createRequire } = require("module")
const { uuid } = require('uuidv4');

const emailfunction = require('../utils/emailRouter');
const crypto = require("crypto");

const fs = require('fs');
const imgGen = require('js-image-generator');
    
module.exports = {

    
    getSourceListPage: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)

            let sourcelist = await new Promise(resolve => {
                const statement = {
                    text: "SELECT id,NAME FROM email_source WHERE active ='Y' and createdby = $1 order by id desc",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.render("sourceList.ejs", {
                sourcelist: sourcelist
            });

        })()
    },


    getInsertSourceList: (req, res, next) => {

        console.log('Name----------->',req.body.name)
        
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)


            let statics = await new Promise(resolve => {
                const statement = {
                    text: "insert into email_source(name, createdby) values ($1, $2)",
                    values: [req.body.name,res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    console.log('err1------->',err)
                    if (err) throw err;
                  
                    let resultSet = await obj.rows[0];
                    
                    return resolve(resultSet);
                })
            })

           
            res.redirect("sourceList");

        })()
    },

    getSourceListPage: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)

            let sourcelist = await new Promise(resolve => {
                const statement = {
                    text: "SELECT id,NAME FROM email_source WHERE active ='Y' and createdby = $1 order by id desc",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.render("sourceList.ejs", {
                sourcelist: sourcelist
            });

        })()
    },


    getUpdateSourceList: (req, res, next) => {

        console.log('Id----------->',req.body.id)
        console.log('Name----------->',req.body.name)
        
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)


            let statics = await new Promise(resolve => {
                const statement = {
                    text: "update email_source set name = $1 where id = $2 ",
                    values: [req.body.name,req.body.id]
                }
                db.query(statement, async function (err, obj) {
                    console.log('err1------->',err)
                    if (err) throw err;
                  
                    let resultSet = await obj.rows[0];
                    
                    return resolve(resultSet);
                })
            })

           
            res.json({
                status: "200",
                message: "Updates Success Fully"
            })

        })()
    },

    getDeleteSourceList: (req, res, next) => {

        console.log('Id----------->',req.body.id)
        
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            let statics = await new Promise(resolve => {
                const statement = {
                    text: " update email_source set active = 'N' where id = $1 ",
                    values: [req.body.id]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })

            res.json({
                status: "200",
                message: "Deleted Success Fully"
            })

        })()
    }

}

