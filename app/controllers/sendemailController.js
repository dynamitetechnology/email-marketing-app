const {
    check,
    validationResult
} = require('express-validator');

const {
    createRequire
} = require("module")
const {
    uuid
} = require('uuidv4');

const emailfunction = require('../utils/emailRouter');
const crypto = require("crypto");

const fs = require('fs');
const imgGen = require('js-image-generator');

module.exports = {


    getSendEmailPage: (req, res, next) => {
        // emailfunction.sendEmailAmazonTemplate('surajvishwakarma338@gmail.com','username','password');
        ;
        (async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->', res.locals.username)

            let templatelist = await new Promise(resolve => {
                const statement = {
                    text: "SELECT id, name, subject, content, active, createdby FROM email_templates WHERE active ='Y' and createdby = $1 order by id desc",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

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

  
            res.render("sendemail.ejs", {
                templatelist: templatelist,
                sourceList: sourceList,
                smtpserverList: smtpserverList
            });

        })()

    },

    //send bulk email

    getSendBulkEmailPage: (req, res, next) => {

        ;
        (async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

  
            let templatelist = await new Promise(resolve => {
                const statement = {
                    text: "SELECT id, name, subject, content, active, createdby FROM email_templates WHERE active ='Y' and id = $1 order by id desc",
                    values: [req.body.templateId]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })

            let useremailSourceList = await new Promise(resolve => {
                const statement = {
                    text: "select id, name, email_address, email_source_id from user_email_source where active ='Y' and email_source_id = $1",
                    values: [req.body.emailsourceId]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            let smtpserverList = await new Promise(resolve => {
                const statement = {
                    text: "select id, email,password,portno,smtpserver,createdby,active from email_gatway where active ='Y' and id = $1",
                    values: [req.body.smtpserverid]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })




            //emailfunction.sendEmailAmazonTemplate('surajvishwakarma338@gmail.com','http://56830f7f0661.ngrok.io/'+'downloadAnyImage?filepath='+filePath);
            console.log('USername------------->', res.locals.username)
            for (var key of useremailSourceList) {

                const random = crypto.randomBytes(16).toString("hex");
                console.log('random---------->', random);
                let randomImg = random + 'webemailhiddenmedia.png';
                let uploadImgPath = process.env.EMAIL_TRACK_IMG_PATH + randomImg;

                // Generate one image
                imgGen.generateImage(5, 5, 1, function (err, image) {
                    fs.writeFileSync(uploadImgPath, image.data);
                });

                let trackImgUrl = process.env.DOMAIN_BASE_PATH + 'upload/' + randomImg;
                let date = new Date();

                let imagePathStatic = '/upload/' + randomImg; // path for compare the value of who view email

                emailfunction.sendBulkEmailUsingSMTPServer(smtpserverList, templatelist, key.email_address, trackImgUrl);
                //insert query 
                let useremailSourceList = await new Promise(resolve => {
                    const statement = {
                        text: "insert into email_send_statics(user_email, image_path, createdby, sendby, from_email,template_id,email_source_id, senddate, imagestaticpath) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
                        values: [key.email_address, trackImgUrl, res.locals.username, res.locals.username, smtpserverList.email, templatelist.id, key.email_source_id, date.toDateString(), imagePathStatic]
                    }
                    db.query(statement, async function (err, obj) {
                        if (err) throw err;
                        let resultSet = await obj.rows;
                        return resolve(resultSet);
                    })
                })
            }

            res.json({
                status: "200",
                msg: "successfully send"
            })

        })()

    },

    getEmailLogsPage: (req, res, next) => {

        ;
        (async () => {
            let db = req.app.locals.db;
            let redisDb = req.app.locals.redisdb;
            let loginToken = req.cookies.token;
            let errors = validationResult(req);
            let userObj = {};

            console.log('USername------------->', res.locals.username)

            let emailLoglist = await new Promise(resolve => {
                const statement = {
                    text: " SELECT es.ip_address AS ipaddress, ess.user_email AS viewby, ess.from_email AS from_email, ess.senddate AS senddate, es.viewdatetime AS viewdatetime FROM email_statics es INNER JOIN email_send_statics ess ON es.image_path = ess.imagestaticpath WHERE createdby  = $1 ORDER BY ess.id desc",
                    values: [res.locals.username]
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows;
                    return resolve(resultSet);
                })
            })

            console.log('emailLoglist------------->', emailLoglist)
            res.render("emaillogs.ejs", {
                emailLoglist: emailLoglist
            });

        })()

    },

}