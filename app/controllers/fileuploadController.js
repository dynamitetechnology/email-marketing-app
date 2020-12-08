
const {
    check,
    validationResult
} = require('express-validator');

const { createRequire } = require("module")
const { uuid } = require('uuidv4');
const randomstring = require("randomstring");

var multer = require('multer');
var multipleFileUpload = require('../utils/multiple-file-upload');
const uploadSpace = process.env.STATIC_PATH + "upload/"; //storage path

const emailfunction = require('../utils/emailRouter');
const path = require('path');
var util = require('util');

module.exports = {

    getfileuploadPage: (req, res, next) => { 
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->',res.locals.username)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: "select id, name from email_source where active ='Y' and createdby = $1",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })
           
            console.log('usersourceList---------->',sourceList)

            res.render("uploadfile.ejs");

        })()
    },


    uploadExcelwithjson: (req, res, next) => { 
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername============>',res.locals.username)
            
            let userList = JSON.parse(req.body.userjson.trim());

            console.log('User List===============>', userList)
            
            for (let key of userList) {
                console.log('JSON===============>',key.sourceid, key.username.trim(), key.email_address.trim())
                 let sourceList = await new Promise(resolve => {
                    const statement = {
                        text: " insert into user_email_source(name, email_source_id, email_address, createdby)  values($1, $2 ,$3, $4) ",
                        values: [key.username.trim(), key.sourceid, key.email_address.trim(), res.locals.username]
                    }
                    db.query(statement, async function (err, obj) {
                        if (err) throw err;
                        let resultSet = await obj.rows;
                        return resolve(resultSet);
                    })
                })
            }
            res.json({
                status:"200",
                msg:"Successfully uploaded"
            })

        })()
    }

  

  
}

