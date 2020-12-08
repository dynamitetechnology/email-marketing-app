const {
    check,
    validationResult
} = require('express-validator');


const express = require('express');
const router = express.Router()

const emailgatwayController = require('../controllers/emailgatwayController');


router.get('/emailgatway', emailgatwayController.getGatwayPage);

router.post('/createSmtpGatway',[check('email','email must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserver','smtpserver must not be empty').exists().notEmpty().trim().isInt().escape(),
check('portno','portno must not be empty').exists().notEmpty().trim().isInt().escape(),
check('password','password must not be empty').exists().notEmpty().trim().isInt().escape()], emailgatwayController.getInsertGatway);


router.post('/updateSmtpGatway',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserver','smtpserver must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserveremail','smtpserveremail must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserverport','smtpserverport must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserverpass','smtpserverpass must not be empty').exists().notEmpty().trim().isInt().escape()], 
emailgatwayController.getUpdateGatway);


router.post('/deleteemailgatway',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape()], 
emailgatwayController.getDeleteGatway);



module.exports = router;