const express = require('express');
const { getAllNameCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByPostId, getImagesProduct, getFirstImageProduct, getFirstImageProductByPostId, getCateParentByCateChild, getCateById, getAllPostByUserId, getUserByUserId, getPostByPlace, getPostByCityName, getPostByName, getUserBidPost } = require('../controllers/common.controller');
const { getCategoryParent } = require('../services/common.service');
const route = express.Router()


route.get('/allCountryName', getAllNameCountry)
route.get('/warrantyStatus', getAllWarrantyStatus)
route.get('/allCategoryParent', getAllCategoryParent)
route.get('/categoryParent/:id/allCategoryChild', getAllCategoryChild)
route.get('/allStatusCurrentProduct', getAllStatusCurrentProduct)
route.get('/allPost', getAllPost)
route.get('/post/search/value/:search', getPostByName)
route.get('/post/place', getPostByPlace)
route.get('/post/:id', getPostByPostId)
route.get('/categoryChild/:id/post', getPostByCateId)
// route.get('/cityName/:name/post',)
route.get('/imagesProduct/:id', getImagesProduct)
route.get('/firstImageProduct/:id', getFirstImageProductByPostId)
route.get('/category/:id', getCateById);
route.get('/post/user/:id', getAllPostByUserId);
route.get('/user/:id', getUserByUserId);

route.get('/listBidPrice/postId/:postId/postAuctionId/:postAuctionId', getUserBidPost);


module.exports = route;
