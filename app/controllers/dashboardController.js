const { createRequire } = require("module")
const { uuid } = require('uuidv4');

const emailfunction = require('../utils/emailRouter');
const crypto = require("crypto");

const fs = require('fs');
const imgGen = require('js-image-generator');
    
module.exports = {

    
    // getIndexPage: (req, res, next) => {
    //     emailfunction.sendEmailAmazonTemplate('surajvishwakarma338@gmail.com','username','password');
    //     res.render("index.ejs")
    // }

    getDashboard: (req, res, next) => {

           

        
        //emailfunction.sendEmailAmazonTemplate('surajvishwakarma338@gmail.com','http://68ba779d0bdd.ngrok.io/assets/img/web3.png','password');

        ;(async () => {
            let db = req.app.locals.db;

            let statics = await new Promise(resolve => {
                const statement = {
                    text: "select count(*) as statics from email_statics",
                    values: []
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })

            //Template Count

            let templatecount = await new Promise(resolve => {
                const statement = {
                    text: "select count(*) as templatecount from email_templates",
                    values: []
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })

            //usercount
            let usercount = await new Promise(resolve => {
                const statement = {
                    text: "select count(*) as usercount from user_email_source",
                    values: []
                }
                db.query(statement, async function (err, obj) {
                    if (err) throw err;
                    let resultSet = await obj.rows[0];
                    return resolve(resultSet);
                })
            })


            res.render("dashboard.ejs", {
                statics: statics,
                templatecount: templatecount,
                usercount:usercount
            });

        })()
    },
    
    downloadAnyImage: function (req, res) {
        res.download(req.query.filepath)
    },

}

