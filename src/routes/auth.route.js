const express = require('express');
const { createAccount, loginAccount, updateAccount, sentOTP, loginAccountGoogle } = require('../controllers/auth.controller');
const route = express.Router()
require('../middlewares/passport.middleware')
const passport = require('passport');





// create new account
route.post('/register', createAccount)
// gui OTP
route.post('/sent_otp', sentOTP)
// login
route.post('/login', loginAccount)

route.get('/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }));

route.get('/google/callback', passport.authenticate(
    'google',
    { failureRedirect: '/auth/google/failure', session: false }
),
    loginAccountGoogle
);


route.get('/google/failure', (req, res, next) => {
    return res.send('that bai')
})

route.put('/update', passport.authenticate('jwt', { session: false }), updateAccount)


module.exports = route;  