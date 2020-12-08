const {
    check,
    validationResult
} = require('express-validator');


const express = require('express');
const router = express.Router()

const createuserController = require('../controllers/createuserController');


router.get('/createuser', createuserController.createUserPage);

router.post('/createsourceuser',[check('sourceid','sourceid must not be empty').exists().notEmpty().trim().isInt().escape(),
check('email_address','email_address must not be empty').exists().notEmpty().trim().isInt().escape(),
check('name','name must not be empty').exists().notEmpty().trim().isInt().escape()], createuserController.getInsertSourceUser);



router.post('/uploadUserSourceUsingExcel', createuserController.uploadUserSourceUsingExcel);


router.post('/updateusersource',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape(),
check('sourceId','sourceId must not be empty').exists().notEmpty().trim().isInt().escape(),
check('username','username must not be empty').exists().notEmpty().trim().isInt().escape(),
check('useremail','useremail must not be empty').exists().notEmpty().trim().isInt().escape()], 
createuserController.getUpdateSourceUser);





router.post('/deleteusersource',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape()], 
createuserController.getDeleteSourceUser);

module.exports = router;