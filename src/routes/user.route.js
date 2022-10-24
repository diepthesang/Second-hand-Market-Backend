
const express = require('express');
const route = express.Router()
require('../middlewares/passport.middleware')
const passport = require('passport');
const { createPost, uploadImage, createCategory, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId } = require('../controllers/user.controller');
const { uploadMultiImage, uploadSingleImage } = require('../middlewares/uploadIFile.middleware');
const { read } = require('fs');
const { getPostByCateId } = require('../controllers/common.controller');


route.post('/createPost', passport.authenticate('jwt', { session: false }), uploadMultiImage, createPost)

route.post('/createCategory', passport.authenticate('jwt', { session: false }), uploadSingleImage, createCategory)

route.get('/userInfo', passport.authenticate('jwt', { session: false }), getUserInfo);

route.put('/updateLikePost', passport.authenticate('jwt', { session: false }), updateLikePost)

route.get('/postShowByUserId/activeId/:activeId', passport.authenticate('jwt', { session: false }), getPostShowByUserId)

route.put('/updateActiveIdPost', passport.authenticate('jwt', { session: false }), updateActiveIdPost)

route.get('/allPost', passport.authenticate('jwt', { session: false }), getAllPostByUserId)


module.exports = route;
