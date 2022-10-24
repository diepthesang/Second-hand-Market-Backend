const express = require('express');
const { getAllNameCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByPostId, getImagesProduct, getFirstImageProduct, getFirstImageProductByPostId } = require('../controllers/common.controller');
const { getCategoryParent } = require('../services/common.service');
const route = express.Router()


route.get('/allCountryName', getAllNameCountry)
route.get('/warrantyStatus', getAllWarrantyStatus)
route.get('/allCategoryParent', getAllCategoryParent)
route.get('/categoryParent/:id/allCategoryChild', getAllCategoryChild)
route.get('/allStatusCurrentProduct', getAllStatusCurrentProduct)
route.get('/allPost', getAllPost)
route.get('/post/:id/', getPostByPostId)
route.get('/categoryChild/:id/post', getPostByCateId)
// route.get('/cityName/:name/post',)
route.get('/imagesProduct/:id', getImagesProduct)
route.get('/firstImageProduct/:id', getFirstImageProductByPostId)

module.exports = route;
