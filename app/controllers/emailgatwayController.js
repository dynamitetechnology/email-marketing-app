
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

    
    getGatwayPage: (req, res, next) => {
       ;(async () => {
        let db = req.app.locals.db;
        let redisDb = req.app.locals.redisdb;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
        let userObj = {};

        console.log('USername------------->',res.locals.username)
        let smtpserverList = await new Promise(resolve => {
            const statement = {
                text: "select id, email,password,portno,smtpserver,createdby,active from email_gatway where active ='Y' and createdby = $1",
                values: [res.locals.username]
            }
            db.query(statement, async function (err, obj) {
                if (err) throw err;
                let resultSet = await obj.rows;
                return resolve(resultSet);
            })
        })
        console.log('smtpserverList------------->',smtpserverList)
        res.render("emailGetway.ejs", {
            smtpserverList:smtpserverList
        });

    })()
    },

    getInsertGatway: (req, res, next) => {
        ;(async () => {
         let db = req.app.locals.db;
         let redisDb = req.app.locals.redisdb;
         let loginToken = req.cookies.token;
         let errors = validationResult(req);
         let userObj = {};
 
         console.log('email------------->',req.body.email)
         console.log('smtpserver------------->',req.body.smtpserver)
         console.log('portno------------->',req.body.portno)
         console.log('password------------->',req.body.password)



         let smtpserverList = await new Promise(resolve => {
             const statement = {
                 text: "insert into email_gatway(email, password, portno, smtpserver, createdby) values ($1, $2, $3, $4, $5)",
                 values: [req.body.email, req.body.password, req.body.portno, req.body.smtpserver, res.locals.username]
             }
             db.query(statement, async function (err, obj) {
                 if (err) throw err;
                 let resultSet = await obj.rows;
                 return resolve(resultSet);
             })
         })
         res.redirect("emailgatway");
 
     })()
     },

     getUpdateGatway: (req, res, next) => {
        ;(async () => {
         let db = req.app.locals.db;
         let redisDb = req.app.locals.redisdb;
         let loginToken = req.cookies.token;
         let errors = validationResult(req);
         let userObj = {};
 
         console.log('id------------->',req.body.id)
         console.log('smtpserver------------->',req.body.smtpserver)
         console.log('smtpserveremail------------->',req.body.smtpserveremail)
         console.log('smtpserverport------------->',req.body.smtpserverport)
         console.log('smtpserverpass------------->',req.body.smtpserverpass)



         let smtpserverList = await new Promise(resolve => {
             const statement = {
                 text: " update  email_gatway set email = $1, password = $2, portno = $3, smtpserver = $4, createdby = $5 where id = $6 ",
                 values: [req.body.smtpserveremail, req.body.smtpserverpass, req.body.smtpserverport, req.body.smtpserver, res.locals.username,req.body.id]
             }
             db.query(statement, async function (err, obj) {
                 if (err) throw err;
                 let resultSet = await obj.rows;
                 return resolve(resultSet);
             })
         })
         res.json({
             status:"200",
             msg:"success"
         })
 
     })()
     },

     getDeleteGatway: (req, res, next) => {
        ;(async () => {
         let db = req.app.locals.db;
         let redisDb = req.app.locals.redisdb;
         let loginToken = req.cookies.token;
         let errors = validationResult(req);
         let userObj = {};
 
         console.log('id------------->',req.body.id)

         let smtpserverList = await new Promise(resolve => {
             const statement = {
                 text: " update  email_gatway set active = 'N' where id = $1 ",
                 values: [req.body.id]
             }
             db.query(statement, async function (err, obj) {
                 if (err) throw err;
                 let resultSet = await obj.rows;
                 return resolve(resultSet);
             })
         })
         res.json({
             status:"200",
             msg:"success"
         })
 
     })()
     }

  
}

