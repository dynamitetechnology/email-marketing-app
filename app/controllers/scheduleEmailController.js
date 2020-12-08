
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


    emailschedulerpage: (req, res, next) => {
    
       ;(async () => {
        let db = req.app.locals.db;
        let redisDb = req.app.locals.redisdb;
        let loginToken = req.cookies.token;
        let errors = validationResult(req);
        let userObj = {};

        console.log('USername------------->',res.locals.username)

        // let emailLoglist = await new Promise(resolve => {
        //     const statement = {
        //         text: " SELECT es.ip_address AS ipaddress, ess.user_email AS viewby, ess.from_email AS from_email, ess.senddate AS senddate, es.viewdatetime AS viewdatetime FROM email_statics es INNER JOIN email_send_statics ess ON es.image_path = ess.imagestaticpath WHERE createdby  = $1 ORDER BY ess.id desc",
        //         values: [res.locals.username]
        //     }
        //     db.query(statement, async function (err, obj) {
        //         if (err) throw err;
        //         let resultSet = await obj.rows;
        //         return resolve(resultSet);
        //     })
        // })
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

        let scheduleList = await new Promise(resolve => {
            const statement = {
                text: "select id, source_id,template_id,email_gaytway_id,schedule_date,createdby,active from email_schedule where active ='Y' and createdby = $1",
                values: [res.locals.username]
            }
            db.query(statement, async function (err, obj) {
                if (err) throw err;
                let resultSet = await obj.rows;
                return resolve(resultSet);
            })
        })

        //console.log('emailLoglist------------->',emailLoglist)
        res.render("emailscheduler.ejs", {
            templatelist: templatelist,
            sourceList: sourceList,
            smtpserverList:smtpserverList,
            scheduleList: scheduleList
        });

    })()

    },
  
}

