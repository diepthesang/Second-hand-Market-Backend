const { randomBytes } = require('crypto');
const express = require('express');
const commonController = require('../controllers/common.controller');
const { getAllNameCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByPostId, getImagesProduct, getFirstImageProduct, getFirstImageProductByPostId, getCateParentByCateChild, getCateById, getAllPostByUserId, getUserByUserId, getPostByPlace, getPostByCityName, getPostByName, getUserBidPost, timeOutTest, getAllCityPost, getSomePost, getPostsByCateChildId, uploadImages, getPostsByType } = require('../controllers/common.controller');
const { uploadMultiImage, uploadSingleImage } = require('../middlewares/uploadIFile.middleware');

const { getCategoryParent } = require('../services/common.service');
const route = express.Router()


route.get('/allCountryName', getAllNameCountry)
route.get('/warrantyStatus', getAllWarrantyStatus)
route.get('/allCategoryParent', getAllCategoryParent)
route.get('/categoryParent/:id/allCategoryChild', getAllCategoryChild)
route.get('/allStatusCurrentProduct', getAllStatusCurrentProduct)
route.get('/allPost', getAllPost)
route.get('/post/place', getPostByPlace)
route.get('/post/search/value/:search', getPostByName)
route.get('/post/user/:id', getAllPostByUserId);
route.get('/post/:id', getPostByPostId)
// get post by cate child
route.get('/categoryChild/cateId/:id/desct/:desct/province/:province/post', getPostByCateId);

// route.get('/cityName/:name/post',)
route.get('/imagesProduct/:id', getImagesProduct)
route.get('/firstImageProduct/:id', getFirstImageProductByPostId)
route.get('/category/:id', getCateById);
route.get('/user/:id', getUserByUserId);

route.get('/listBidPrice/postId/:postId/postAuctionId/:postAuctionId', getUserBidPost);

route.get('/timeout', timeOutTest);
route.get('/allCityPost', getAllCityPost);
route.get('/somePost/:cateParentId', getSomePost);
route.get('/posts/cateId/:cateId', getPostsByCateChildId);
route.post('/upload', uploadMultiImage, uploadImages);
route.get('/posts/type/:type/activeId/:activeId', getPostsByType);


module.exports = route;
