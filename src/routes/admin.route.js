const express = require('express');
const { getUserInfo, removeUser, searchUserByLastname, getAllPost, removePostByPostId, searchPostByTitle } = require('../controllers/admin.controller');
const route = express.Router();


route.get('/user', getUserInfo);
route.delete('/user/remove/userId/:userId', removeUser);
route.get('/user/search/lastName/:lastName', searchUserByLastname);
route.get('/post/', getAllPost);
route.delete('/post/remove/postId/:id', removePostByPostId);
route.get('/post/search/title/:title', searchPostByTitle)
// route.delete('/user/remove/userI')





module.exports = route;
