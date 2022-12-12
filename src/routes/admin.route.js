const express = require('express');
const { getUserInfo, removeUser, searchUserByLastname, getAllPost, removePostByPostId, searchPostByTitle, getParentCategories, addCategory, removeCategoryById, updateCategory, getCategoryById, getUsersByMonth, getPostingsByMonth, getPostingsSoldByMonth, getPostAndPostingsSoldByMonth, getBidPostingsByMonth } = require('../controllers/admin.controller');
const { uploadSingleImage } = require('../middlewares/uploadIFile.middleware');
const route = express.Router();


route.get('/user', getUserInfo);
route.delete('/user/remove/userId/:userId', removeUser);
route.get('/user/search/lastName/:lastName', searchUserByLastname);
route.get('/post/', getAllPost);
route.delete('/post/remove/postId/:id', removePostByPostId);
route.get('/post/search/title/:title', searchPostByTitle)
route.get('/category/parentCate/:parentCate', getParentCategories)
route.post('/category/create', uploadSingleImage, addCategory);
route.delete('/category/remove/:id', removeCategoryById);
route.put('/category/update', uploadSingleImage, updateCategory)
route.get('/category/:id', getCategoryById)
route.get('/chart/user/', getUsersByMonth)
route.get('/chart/posting/', getPostingsByMonth)
route.get('/chart/postingSold/:status', getPostAndPostingsSoldByMonth)
route.get('/chart/bidPosting/', getBidPostingsByMonth)



module.exports = route;
