const express = require('express');
const { createAccount } = require('../controllers/auth.controller');
const route = express.Router()


// create new account
route.post('/createAccount', createAccount)

module.exports = route; 