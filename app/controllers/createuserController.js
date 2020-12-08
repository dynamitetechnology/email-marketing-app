
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

    createUserPage: (req, res, next) => { 
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
            // get all source list by user
            let usersourceList = await new Promise(resolve => {
                const statement = {
                    text: " select id, active, NAME, email_source_id, email_address, createdby, (SELECT name FROM email_source WHERE id = user_email_source.email_source_id) AS sourcename, (SELECT id FROM email_source WHERE id = user_email_source.email_source_id) AS sourcedropdown  FROM user_email_source WHERE  active ='Y' and createdby = $1 ORDER BY id desc ",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            console.log('usersourceList---------->',usersourceList)

            res.render("createuser.ejs", {
                sourceList: sourceList,
                usersourceList:usersourceList
            });

        })()
    },


    getInsertSourceUser: (req, res, next) => { 
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('sourceid------------->',req.body.sourceid)
            console.log('email_address------------->',req.body.email_address)
            console.log('name------------->',req.body.name)
            console.log('USername------------->',res.locals.username)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    //text: "select id, name from email_source where active ='Y' and createdby = $1",
                    text: " insert into user_email_source(name, email_source_id, email_address, createdby)  values($1, $2 ,$3, $4) ",
                    values: [req.body.name, req.body.sourceid, req.body.email_address, res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.redirect("createuser");

        })()
    },


    uploadUserSourceUsingExcel: function (req, res) {
        (async () => {
            try {
                console.log("req------->",req.files)

                console.log("uploadUserUsingExcel")
                const file = req.files.excelFile;
                const fileName = file.name;
                const size = file.data.length;
                const extension = path.extname(fileName);
                const allowedExtensions = /xlsx/;
                if (!allowedExtensions.test(extension)) {
                    res.json({
                        status: "failed",
                        msg: "unsupported extension"
                    })
                    throw "unsupported extension!"
                }
                if (size > 10000000) {
                    res.json({
                        status: "failed",
                        msg: "File must be less than 10 MB"
                    })
                    throw "File must be less than 10 MB"
                }
                let URL = "";
                const md5 = file.md5 + randomstring.generate(10);
                URL = uploadSpace + md5 + extension;
                console.log("URL----> ", URL);
                await util.promisify(file.mv)(URL);
                console.log("uploadUserUsingExcel ---> ", "file upload complete. Now reading excel file");

                //Read-Excel-File
                readXlsxFile(uploadPath + md5 + extension).then((rows) => {
                    console.log("rows before insert --> ", rows)
                    rows.shift() //remove first row
                    let input = "";
                    for (i in rows) {
                        rows[i].unshift(req.app.locals.aadharCardNumber)
                        let values = "("
                        for (j in rows[i]) {
                            values += "'" + rows[i][j] + "',"
                        }
                        values = values.substring(0, values.length - 1) + "),"
                        input += values
                    }
                    input = input.substring(0, input.length - 1)
                    console.log("rows to insert --> ", input)
                    const db = res.app.locals.db;
                    let sql = "insert into user_reg (adminAadhar, fullName,flatNo,block,flatType,flatRent) values " + input + " ";
                    console.log("sql --> ", sql)
                    db.query(sql, async function (err, result) {
                        if (err) {
                            console.log("err with batch insert --> ", err)
                            // removing just uploaded excel file
                            fs.unlink(uploadPath + md5 + extension, (err) => {
                                if (err) {
                                    console.error("error with deleting excel file --> ", err)
                                    return
                                }
                                console.log("excel file removed")
                                res.json({
                                    status: "error"
                                })
                            })

                        } else {
                            console.log("user batch insert --> ", await result)
                            // removing just uploaded excel file
                            fs.unlink(uploadPath + md5 + extension, (err) => {
                                if (err) {
                                    console.error("error with deleting excel file --> ", err)
                                    return
                                }
                                console.log("excel file removed")
                                res.json({
                                    status: "success"
                                })
                            })
                        }
                    })


                })
            } catch (err) {
                console.log("err", err);
                res.json({
                    status: "error"
                })
            }
        })();
    },


    getUpdateSourceUser: (req, res, next) => { 
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('id------------->',req.body.id)
            console.log('sourceId------------->',req.body.sourceId)
            console.log('username------------->',req.body.username)
            console.log('useremail------------->',req.body.useremail)
            console.log('USername------------->',res.locals.username)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " update  user_email_source set name = $1, email_address = $2, createdby = $3 where id = $4 ",
                    values: [req.body.username, req.body.useremail, res.locals.username , req.body.id]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            res.json({
                status:"200",
                msg:"Successfully updated"
            });

        })()
    },

    getDeleteSourceUser: (req, res, next) => { 
        ;(async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('id------------->',req.body.id)

            let sourceList = await new Promise(resolve => {
                const statement = {
                    text: " update  user_email_source set active = 'N' where id = $1 ",
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
                msg:"Successfully Deleted"
            });

        })()
    },

  
}

