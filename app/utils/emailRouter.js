const nodemailer = require('nodemailer');
require('dotenv').config();
var HTML = require('html-parse-stringify')

const utilfunctions = require('../utils/functions');
var handlebars = require('handlebars');

const Entities = require('html-entities').AllHtmlEntities;
 
const entities = new Entities();

module.exports = {

    sendEmailCustom: (toEmail, verificationCode, reqType, userName) => {

        let transporter = nodemailer.createTransport({
            host: 'mail.indiawebcraft.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS
            }
        });

        let mailOptions;

        if (reqType == "newUser") {
            mailOptions = {
                from: '"SK eLearn" <suraj@indiawebcraft.com>', // sender address (who sends)
                to: `${toEmail}`, // list of receivers (who receives)
                subject: `Welcome To SK eLearn`, // Subject line
                html: `<h4>Hello ${userName},</h4> 
                      <p>We welcome you to SK eLearn, a world full of opportunities. Start your journey to success by completing the registration process.</p>
                      <p>Your verification code is <strong>${verificationCode}</strong>.</p>` // html body
            };
        } else if (reqType == "resetPwd") {
            mailOptions = {
                from: '"SK eLearn" <suraj@indiawebcraft.com>', // sender address (who sends)
                to: `${toEmail}`, // list of receivers (who receives)
                subject: `Password reset request - SK eLearn`, // Subject line
                html: `<h4>Hello ${userName},</h4> 
                       <h4>To reset your password verify yourself with the verification code given below.</h4> 
                       <p>Your verification code is <strong>${verificationCode}</strong>.</p>` // html body
            };
        } else if (reqType == "resendCode") {
            mailOptions = {
                from: '"SK eLearn" <info@skelearn.com>', // sender address (who sends)
                to: `${toEmail}`, // list of receivers (who receives)
                subject: `Verify your email address - SK eLearn`, // Subject line
                html: `<h4>Hello ${userName},</h4> 
                      <p>Your new verification code is <strong>${verificationCode}</strong>.</p>` // html body
            };
        } else if (reqType == "changeEmail") {
            mailOptions = {
                from: '"SK eLearn" <info@skelearn.com>', // sender address (who sends)
                to: `${toEmail}`, // list of receivers (who receives)
                subject: `Change email address - SK eLearn`, // Subject line
                html: `<h4>Hello ${userName},</h4> 
                      <p>OTP to change your email is <strong>${verificationCode}</strong>.</p>` // html body
            };
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
            console.log('Email sent: ', info);
        });

    },

    sendContactEmail: (name, email, phone, subject, message) => {

        let transporter = nodemailer.createTransport({
            host: 'smtp.zoho.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.ZOHO_EMAIL,
                pass: process.env.ZOHO_PASS
            }
        });

        let mailOptions = {
            from: `"${name}" <${process.env.ZOHO_EMAIL}>`, // sender address (who sends)
            to: `${process.env.ZOHO_EMAIL, process.env.ADMIN_EMAIL}`, // list of receivers (who receives)
            subject: `${subject}`, // Subject line
            html: `<p>Name: ${name}</p> <p>Email: ${email}</p> <p>Phone: ${phone}</p> <p>Message: </p> ${message}` // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) throw error;

            transporter.sendMail({
                from: `"${name}" <${process.env.ZOHO_EMAIL}>`, // sender address (who sends)
                to: email, // list of receivers (who receives)
                subject: `Reply to ${subject}`, // Subject line
                html: `<p>Hello ${name},</p><p>Thank you for contacting us. Our team will get back to you soon.</p>` // html body
            }, (error, info) => {
                if (error) throw error;
                console.log(info)
            })
        });

    },

    sendCheckoutEmail: (to) => {
        let transporter = nodemailer.createTransport({
            host: 'mail.indiawebcraft.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS
            }
        });

        let mailOptions = {
            from: '"SK eLearn" <info@skelearn.com>', // sender address (who sends)
            to: `${to}`, // list of receivers (who receives)
            subject: `<h4>Application Rejected</h4>`, // Subject line
            html: `<p>Dear Vendor,<br> Your Application Rejected By Electroguru for more information</p>` // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
        });
    },

    sendEmailRejectVendor: (to, sub, msg) => {
        let transporter = nodemailer.createTransport({
            host: 'mail.dynamitetechnology.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS
            }
        });

        let mailOptions = {
            from: '"Electroguru" <suraj@indiawebcraft.com>', // sender address (who sends)
            to: `${to}`, // list of receivers (who receives)
            subject: `Application Rejected`, // Subject line
            html: `<p>Dear Vendor,<br> Your Application Rejected By Electroguru for more information</p>` // html body
        };

        console.log('Mail Server Calling ', transporter)
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
        });
    },

    sendEmailAcceptVendor: (to, username, password) => {
        let transporter = nodemailer.createTransport({
            host: 'mail.dynamitetechnology.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS
            }
        });

        let mailOptions = {
            from: '"Electroguru" <suraj@indiawebcraft.com>', // sender address (who sends)
            to: `${to}`, // list of receivers (who receives)
            subject: `Application Approve`, // Subject line
            html: `<p>Dear Vendor,<br> Your Application Approve Here is your login credentials of portal.<br>username:${username} <br>password: ${password} <br>Website: <a href='www.electoguru.in'>www.electoguru.in</a></p>` // html body
        };

        console.log('Mail Server Calling ', transporter)
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
        });
    },


    sendEmailAmazonTemplate: (to, imageUrl) => {
        let transporter = nodemailer.createTransport({
            host: 'mail.dynamitetechnology.in',
            port: 465,
            secure: true,
            auth: {
                user: process.env.SERVER_EMAIL,
                pass: process.env.SERVER_PASS
            }
        });
        let date = new Date();
        var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        var greaterDate = new Date(new Date().getTime()+(2*24*60*60*1000));
        let mailOptions = {
            from: '"Electroguru" <suraj@indiawebcraft.com>', // sender address (who sends)
            to: `${to}`, // list of receivers (who receives)
            subject: `Application Approve`, // Subject line
            html: `
            <!DOCTYPE html>
<html>
   <head>
      <title>Amazon</title>
     
   </head>
   <body style="background-color:#e2e1e0;font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;color:#000;">
   
      <table style="max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;-webkit-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);-moz-box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24); ">
         <thead>
            <tr>
               <th style="text-align:left;"><img style="max-width: 150px;" src="F:\client email template\img/amazon_PNG12.png" alt=""></th>
               <th style="text-align:right;font-weight:400;">
                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px;">Order Confirmation</p>
                  </span>
               </th>
            </tr>
         </thead>
         <tbody>
            <tr>
               <td style="height:35px;"></td>
            </tr>
            <tr>
               <td colspan="2">
                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">
                     <span style="color:#ff9800b0;">Hello Customer Name</span>, <br>
                     Thank you for your order.We will need a confirmation when your order ships your estimated
                     delivery date is indicated below.if you would like to view the status of your order or make any
                     changes to it.<br>
                     Please visit <span style="color:blue;">Yours Orders on Amazon.com </span>
                     </span>
                  </p>
               </td>
            <tr>
               <td colspan="2">
                  <p style="font-size:14px;margin:0 0 6px 0;"><span style="font-weight:bold;display:inline-block;min-width:146px">
                     For assistance a call our Customer Service Toll Free
                     <br>
                     <br>
                     (855)581-8005
                     </span>
                  </p>
               </td>
            </tr>
            <tr>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Arriving</span> ${greaterDate.getDate()}  ${months[greaterDate.getMonth()]},${greaterDate.getFullYear()}</p>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;">Your order will be sent</p>
            <tr>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px">Your shipping speed:</span></p>
                  <span style="color:blue;font-weight:bold;font-size:13px;">Prime</span> Two Day Delievry at $10 FREE with Prime
            <tr>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <button type="button" style="background-color:#ff9800b0; padding:15px; font-size:10px; color:#fff; font-weight:bold border:1px solid:black; border-radius:5px;"  class="btn btn-warning">View or Manage Order</button>
            </tr>
            </tr>
            </tr>
            <td style="height:20px;"></td>
            </tr>
            <tr>
               <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                  <h2 style="display:block;margin:0 0 10px 0; color:#ff9800b0; ">Order Details</h2>
                  Placed on : ${date.getDate()+ ' - ' +months[date.getMonth()] +' - ' +date.getFullYear()}<br> 
                  P.s If you did not place this order call us on <br><br>
                  <b>Phone:</b>(855)581-8005 (Fraud Protection Team)<br>
               </td>
            </tr>
            <tr>
               <td style="width:50%;vertical-align:top">
                  <img style="max-width: 150px;" src="F:\client email template\img/imac.jpg" alt="">
               </td>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px; color: blue;"><span style="display:block;font-weight:bold;font-size:13px;">New Apple iMAC(27-inch
                     Retina 5k display,3 0GHz -6
                     core 8th generation intel core
                     i5 processor,1TB
                     </span>
                  </p>
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Electronic Products</span> Sold by Amazon Tal USA</p>
               <td style="width:50%;padding:20px;vertical-align:top">
                  <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">699.505</span></p>
               </td>
            </tr>
            <tr colspan="2" style="width:100%;padding:20px;vertical-align:top">
               <th>
               <td>Items Subtotal:</td>
               <td>$699.50</td>
               </th>
            </tr>
            <tr colspan="2" style="width:100%;padding:20px;vertical-align:top">
               <th>
               <td>Shipping $ :</td>
               <td>$120.00</td>
               </th>
            </tr>
            <tr colspan="2" style="width:100%;padding:20px;vertical-align:top">
               <th>
               <td>Order total</td>
               <td>$819.50</td>
               </th>
            </tr>
         </tbody>
         <tfooter>
            <tr>
               <td colspan="2" style="font-size:14px;padding:50px 15px 0 15px;">
                  <b>We hope to see you again soon</b><br>
                  <b>Amazon.com</b> 
               </td>
            </tr>
         </tfooter>
         <img src="${imageUrl}" style="display:none;">
         <!--<img src="https://bd0a96bb3af4.ngrok.io/assets/img/web3.png" style="display:none;">-->
        <!--Pass image url with server-->
      </table>
   </body>
</html>` // html body
        };
        
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) throw error;
        });
    },


          

    sendBulkEmailUsingSMTPServer: (smtpserverList,templatelist,to,completeFilePath) => {

      
        let transporter = nodemailer.createTransport({
            //host: 'mail.dynamitetechnology.in',
            host:smtpserverList.smtpserver,//smtp server ex mail.dynamitetechnology.in
            port: smtpserverList.portno, //smtp server port 456
            secure: true,
            auth: {
                user:smtpserverList.email,//'sampark@dynamitetechnology.in'
                pass: smtpserverList.password// email server pasword
            }
        });
     

        console.log(entities.decode(templatelist.content));


        let mailOptions = {
            from: `${templatelist.subject}`+'<'+smtpserverList.email+'>', // sender address (who sends)
            to: `${to}`, // list of receivers (who receives)
            subject: `${templatelist.subject}`, // Subject line
            //html: `${templatelist.content}` + `<img src="${completeFilePath}" style="display:none;">` // html body
             html: entities.decode(templatelist.content + `<img src="${completeFilePath}" style="display:none;">`)
        };


        console.log("completeFilePath==================>: %s", completeFilePath);
          transporter.sendMail(mailOptions, function (error, info) {
            console.log("Message sent==================>: %s", info);
            if (error) throw error;
        });

        
    },

}