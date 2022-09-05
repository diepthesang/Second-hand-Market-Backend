const express = require('express');
const { createAccount, loginAccount, updateAccount, sentOTP } = require('../controllers/auth.controller');
const route = express.Router()
require('../middlewares/passport.middleware')
const passport = require('passport');


// create new account
route.post('/register', createAccount)
route.post('/sent_otp', sentOTP)
route.post('/login', loginAccount)
route.put('/update', passport.authenticate('jwt', { session: false }), updateAccount)


module.exports = route;  