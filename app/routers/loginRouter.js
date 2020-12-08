const {
    check,
    validationResult
} = require('express-validator');

const express = require('express');
const router = express.Router()

const loginController = require('../controllers/loginController');


router.get('/', loginController.getLoginPage);

router.post('/authenticateUsers',[check('username','Username must not be empty').exists().notEmpty().trim().isInt().escape(),
check('password','password must not be empty').exists().notEmpty().trim().isInt().escape()],loginController.authenticateUsers)



router.get('/logout',loginController.logout)

module.exports = router;