'use strict';

var express = require('express');
var controller = require('./employee.controller');

var router = express.Router();

var bodyparser = require('body-parser');
var urlparser = bodyparser.urlencoded({extended: false});

router.get('/:_admin_id', controller.getAllEmployees);
router.get('/:id', controller.getById);
router.post('/', controller.insert)
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;