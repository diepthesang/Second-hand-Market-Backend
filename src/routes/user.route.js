
const express = require('express');
const route = express.Router()
require('../middlewares/passport.middleware')
const passport = require('passport');
const { createPost, uploadImage, createCategory, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId, likePost, unlikePost, getCurrentLikePost, getCurrentLikePostByUser, updateProfile, updateProfileByUser, addPostToCart, getPostCartByUser, removePostCartByPostId, getPostToCheckout, checkPostCartToCheckout, getPostChecked, getAmountPostToCheckout, createPayment, getInfoPaymentSuccess, createPriceBidByUser, getHighestBidder, removeAution, getPriceBidByUserUserId, createBidSocket, getLikePostByUser, updatePriceEnd, getOrderBuyPost, updateConfirmOrderPost, removePost, getPostsLike, getPostBidShowByUserId, getPostHideByUserId, withdrawByUser, getRevenueByUser, getQtyPostByMonths, getBiddingPostByUser, getQtyPostInCartByUser, getOrderPostings, getOrderPostingsByUser, updateStatusPostingCart, getPostIdCheckoutByUser, getPostingBuyByUser, updateStatusOrderByBuyder, createOrder, getTransactionByUser, } = require('../controllers/user.controller');
const { uploadMultiImage, uploadSingleImage } = require('../middlewares/uploadIFile.middleware');
const { read } = require('fs');
const { getPostByCateId, getPostIsShowingByUserId } = require('../controllers/common.controller');


route.post('/createPost', passport.authenticate('jwt', { session: false }), uploadMultiImage, createPost)

route.post('/createCategory', passport.authenticate('jwt', { session: false }), uploadSingleImage, createCategory)

route.get('/userInfo', passport.authenticate('jwt', { session: false }), getUserInfo);

route.put('/updateLikePost', passport.authenticate('jwt', { session: false }), updateLikePost)

route.get('/post/activeId/:activeId/page/:page', passport.authenticate('jwt', { session: false }), getPostShowByUserId)

route.get('/postHide/activeId/:activeId/page/:page', passport.authenticate('jwt', { session: false }), getPostHideByUserId)

route.put('/updateActiveIdPost', passport.authenticate('jwt', { session: false }), updateActiveIdPost)

route.get('/allPost', passport.authenticate('jwt', { session: false }), getAllPostByUserId)

route.post('/likePost', passport.authenticate('jwt', { session: false }), likePost);

route.post('/unlikePost', passport.authenticate('jwt', { session: false }), unlikePost);

route.get('/currentLikePost/:postId', passport.authenticate('jwt', { session: false }), getCurrentLikePost);

route.get('/currentLikePostByUser/user/:userId', passport.authenticate('jwt', { session: false }), getCurrentLikePostByUser);

route.get('/post/user/:id', passport.authenticate('jwt', { session: false }), getPostIsShowingByUserId);

route.put('/updateProfile', passport.authenticate('jwt', { session: false }), uploadSingleImage, updateProfileByUser);

route.post('/addPostToCart', passport.authenticate('jwt', { session: false }), addPostToCart);

route.get('/postCart/checkout', passport.authenticate('jwt', { session: false }), getPostToCheckout)

route.get('/postCart/:page', passport.authenticate('jwt', { session: false }),
  getPostCartByUser);

route.delete('/postCart/remove/:postId', passport.authenticate('jwt', { session: false }), removePostCartByPostId);

route.put('/postCart/checked', passport.authenticate('jwt', { session: false }), checkPostCartToCheckout);

route.get('/postCart/checked/amount', passport.authenticate('jwt', { session: false }), getAmountPostToCheckout);

route.get('/postCart/checked/:checked', passport.authenticate('jwt', { session: false }),
  getPostChecked);

// THANH TOAN PAYPAL

route.post('/payment', passport.authenticate('jwt', { session: false }), createPayment);

route.get('/payment/success', getInfoPaymentSuccess);

route.post('/createPriceBid', passport.authenticate('jwt', { session: false }), createPriceBidByUser);

route.get('/highestBidder/postId/:postId/postAuctionId/:postAuctionId', passport.authenticate('jwt', { session: false }), getHighestBidder);

route.delete('/moneyAution/:id', passport.authenticate('jwt', { session: false }), removeAution);

route.get('/priceBid/:id', passport.authenticate('jwt', { session: false }), getPriceBidByUserUserId);

route.post('/createBid', createBidSocket);

route.get('/getLikePost/:postId', passport.authenticate('jwt', { session: false }), getLikePostByUser)

route.put('/updatePriceEnd', passport.authenticate('jwt', { session: false }), updatePriceEnd);

route.get('/orderBuyPost/:status', passport.authenticate('jwt', { session: false }), getOrderBuyPost);

route.put('/updateConfirmOrderPost', passport.authenticate('jwt', { session: false }), updateConfirmOrderPost);

route.delete('/Post/:id', passport.authenticate('jwt', { session: false }), removePost)

route.get('/Post/like', passport.authenticate('jwt', { session: false }), getPostsLike)

route.get('/post/bid/page/:page', passport.authenticate('jwt', { session: false }), getPostBidShowByUserId);

route.get('/revenue/isWithdrew/:isWithdrew', passport.authenticate('jwt', { session: false }), getRevenueByUser);

route.put('/revenue/isWithdrew', passport.authenticate('jwt', { session: false }), withdrawByUser);

route.get('/chart/qtyPost', passport.authenticate('jwt', { session: false }), getQtyPostByMonths);

route.get('/biddingPost/', passport.authenticate('jwt', { session: false }), getBiddingPostByUser);

route.get('/cart/qty', passport.authenticate('jwt', { session: false }), getQtyPostInCartByUser);

route.get('/cart/status/:status', passport.authenticate('jwt', { session: false }), getOrderPostingsByUser);

route.put('/cart', passport.authenticate('jwt', { session: false }), updateStatusPostingCart);

route.get('/cart/checked/:checked', passport.authenticate('jwt', { session: false }), getPostIdCheckoutByUser);

route.get('/order/posting/buy/status/:status', passport.authenticate('jwt', { session: false }), getPostingBuyByUser)

route.put('/order/buy/updateStatus', passport.authenticate('jwt', { session: false }), updateStatusOrderByBuyder);

route.get('/order/create', passport.authenticate('jwt', { session: false }), createOrder);

route.get('/transaction', passport.authenticate('jwt', { session: false }), getTransactionByUser);








module.exports = route;
