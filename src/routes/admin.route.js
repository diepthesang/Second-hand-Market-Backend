const express = require('express');
const { getUserInfo, removeUser } = require('../controllers/admin.controller');
const route = express.Router();


route.get('/user', getUserInfo);
route.delete('/remove/user/:userId', removeUser);





module.exports = route;
