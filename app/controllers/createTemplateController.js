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

    
    getCreateTemplate: (req, res, next) => {

        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)

       
            let templateList = await new Promise(resolve => {
                const statement = {
                    text: "  SELECT id, name, subject, content, active, createdby from email_templates WHERE active = 'Y' and createdby = $1 ORDER BY id desc ",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            console.log('templateList---------->',templateList)

            res.render("createtemplate.ejs", {
                templateList:templateList
            });

        })()
        
      
    },

    getInsertTemplate: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " insert into email_templates (name, subject, content, createdby)  values($1, $2 ,$3, $4) ",
                    values: [req.body.name, req.body.subject, req.body.content, res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.redirect("createemailtemplate");

        })()
      
    },

    getUpdateTemplate: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('id------------------',req.body.id)
            console.log('templatename------------------',req.body.templatename)
            console.log('templatesubject------------------',req.body.templatesubject)
            console.log('templatecontent------------------',req.body.templatecontent)


            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " update email_templates set name = $1, subject = $2, content = $3, createdby = $4 where id = $5",
                    values: [req.body.templatename, req.body.templatesubject, req.body.templatecontent, res.locals.username, req.body.id]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.json({
                status:"200",
                msg:"success fully updated"
            });

        })()
      
    },

    priviewTemplateSendEmail: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('templateId------------------',req.body.templateId)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " select id, name, subject, content, active  from email_templates where id = $1 and active ='Y' and createdby = $2 ",
                    values: [req.body.templateId,res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })

            res.json({
                status:"200",
                msg:"success fully updated",
                sourceList:sourceList
            });

        })()
      
    },

    getDeleteTemplate: (req, res, next) => {
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('id------------------',req.body.id)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " update email_templates set active = 'N' where id = $1 ",
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
                msg:"success fully updated"
            });

        })()
      
    },
  
}

