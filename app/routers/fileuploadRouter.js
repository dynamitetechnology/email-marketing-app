const {
    check,
    validationResult
} = require('express-validator');

const express = require('express');
const router = express.Router()

const fileuploadController = require('../controllers/fileuploadController');


router.get('/uploadfilepage', fileuploadController.getfileuploadPage);


router.post('/uploaduserwithjson', fileuploadController.uploadExcelwithjson)


module.exports = router;