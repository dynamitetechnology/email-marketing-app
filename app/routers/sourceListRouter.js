const {
    check,
    validationResult
} = require('express-validator');

const express = require('express');
const router = express.Router()

const souceListController = require('../controllers/sourceListController');


router.get('/sourceList', souceListController.getSourceListPage);



router.post('/createsource',[check('name','Name must not be empty')], souceListController.getInsertSourceList);

router.post('/updatesoucelistdata',[check('id','Id must not be empty').exists().notEmpty().trim().isInt().escape(),
check('name','name must not be empty').exists().notEmpty().trim().isInt().escape()], souceListController.getUpdateSourceList);


router.post('/deletesoucelistdata',[check('id','Id must not be empty').exists().notEmpty().trim().isInt().escape()], souceListController.getDeleteSourceList);

module.exports = router;