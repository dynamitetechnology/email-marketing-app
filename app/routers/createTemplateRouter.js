const {
    check,
    validationResult
} = require('express-validator');


const express = require('express');
const router = express.Router()

const createTemplateController = require('../controllers/createTemplateController');


router.get('/createemailtemplate', createTemplateController.getCreateTemplate);


router.post('/createEmailTemplate',[check('name','name must not be empty').exists().notEmpty().trim().isInt().escape(),
check('subject','subject must not be empty').exists().notEmpty().trim().isInt().escape(),
check('content','content').exists().notEmpty().trim().isInt().escape()], createTemplateController.getInsertTemplate);



router.post('/updateTemplate',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape(),
check('templatename','templatename must not be empty').exists().notEmpty().trim().isInt().escape(),
check('templatesubject','templatesubject').exists().notEmpty().trim().isInt().escape(),
check('templatecontent','templatecontent').exists().notEmpty().trim().isInt().escape()], createTemplateController.getUpdateTemplate);



router.post('/priviewTemplateSendEmail',[check('templateId','templateId must not be empty').exists().notEmpty().trim().isInt().escape()],
createTemplateController.priviewTemplateSendEmail);


router.post('/deletetemplate',[check('id','id must not be empty').exists().notEmpty().trim().isInt().escape()], 
createTemplateController.getDeleteTemplate);



module.exports = router;