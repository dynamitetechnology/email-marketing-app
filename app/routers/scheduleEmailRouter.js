const {
    check,
    validationResult
} = require('express-validator');

const express = require('express');
const router = express.Router()

const scheduleController = require('../controllers/scheduleEmailController');


router.get('/emailschedule', scheduleController.emailschedulerpage);

router.post('/sendscheduleemail',[check('templateId','templateId must not be empty'),
check('smtpserverid','smtpserverid must not be empty'),
check('emailsourceId','emailsourceId must not be empty'),
check('sceduledate','sceduledate must not be empty')],scheduleController.emailschedulerpage)


module.exports = router;