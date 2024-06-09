var express = require('express');
const { signIn, register, } = require('../controller/auth.controller');
const { validate } = require('express-validation');
const authValidation = require('../validation/auth');
var router = express.Router();

/* GET home page. */
router.post('/signIn', validate(authValidation.signIn), signIn);
router.post('/register', validate(authValidation.register), register);

module.exports = router;
