const express = require('express');
const { getAllNameCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByPostId, getImagesProduct, getFirstImageProduct, getFirstImageProductByPostId, getCateParentByCateChild, getCateById, getAllPostByUserId, getUserByUserId, getPostByPlace, getPostByCityName, getPostByName, getUserBidPost, timeOutTest, getAllCityPost, getSomePost } = require('../controllers/common.controller');
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
// get post by cate child
route.get('/categoryChild/cateId/:id/desct/:desct/province/:province/post', getPostByCateId);

// route.get('/cityName/:name/post',)
route.get('/imagesProduct/:id', getImagesProduct)
route.get('/firstImageProduct/:id', getFirstImageProductByPostId)
route.get('/category/:id', getCateById);
route.get('/post/user/:id', getAllPostByUserId);
route.get('/user/:id', getUserByUserId);

route.get('/listBidPrice/postId/:postId/postAuctionId/:postAuctionId', getUserBidPost);

route.get('/timeout', timeOutTest);
route.get('/allCityPost', getAllCityPost);
route.get('/somePost/:cateParentId', getSomePost);


module.exports = route;
