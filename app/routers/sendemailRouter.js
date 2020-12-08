const {
    check,
    validationResult
} = require('express-validator');

const express = require('express');
const router = express.Router()

const sendemailController = require('../controllers/sendemailController');


router.get('/sendemail', sendemailController.getSendEmailPage);

//router.get('/downloadAnyImage', sendemailController.downloadAnyImage);



router.post('/sendemailtousers',[check('templateId','templateId must not be empty').exists().notEmpty().trim().isInt().escape(),
check('smtpserverid','smtpserverid must not be empty').exists().notEmpty().trim().isInt().escape(),
check('emailsourceId','emailsourceId must not be empty').exists().notEmpty().trim().isInt().escape()], 
sendemailController.getSendBulkEmailPage);


router.get('/emaillogs', sendemailController.getEmailLogsPage);


module.exports = router;