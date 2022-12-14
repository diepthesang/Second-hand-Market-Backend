const httpMessage = require('../Helps/httpMessage');
// var paypal = require('paypal-rest-sdk');
const { createCategory, createImgPost, createPost, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId, likePost, unlikePost, getCurrentLikePost, getCurentLikePostByUser, updateProfileByUser, addPostToCart, getPostCartByUser, removePostCartByPostId, getPostToCheckout, checkPostCartToCheckout, getPostChecked, getAmountPostToCheckout, createPayment, removePostInCart, createListPostOrder, createAuction, createPriceBidByUser, getHighestBidder, removeAution, getPriceBidByUserUserId, getLikePostByUser, updatePriceEnd, createRevenue, getOrderBuyPostCofirm, getOrderBuyPost, updateConfirmOrderPost, removePost, getPostsLike, getOtherBidders, getPostBidShowByUserId, getPostHideByUserId, updateTypeForPost, withdrawByUser, getRevenueByUser, getQtyPostByMonth, searchUserByLastname, getBiddingPostByUser, getQtyPostInCartByUser, getOrderPostings, getOrderPostingsByUser, updateStatusPostingCart, getPostIdCheckoutByUser, getTransactionByOrderId, updatePostingCart, getPostingBuy, getPostingBuyByUser, getPostBuy, updateStatusOrderByBuyder, createOrder } = require('../services/user.service');
const { v4: uuidv4 } = require('uuid');
const { deleteMultiFiles, validateEmail } = require('./helps.controller');
const { getFirstImageForProduct } = require('../services/common.service');
const { getUserByEmail } = require('../services/auth.service');
const db = require('../db/models');
const paypalRestSdk = require('paypal-rest-sdk');
const { _infoTransformers } = require('passport/lib');
// const { setTimeout } = require('timers/promises');

module.exports = {
    createPost: async (req, res, next) => {
        try {
            let { cateId, name, statusId, warrantyId, madeInId, description, price, province, district, ward, address, startPrice, bidEndTime, isBid, isFree } = req.body;

            let typePost = 'SELL';

            console.log({ cateId, name, statusId, warrantyId, madeInId, description, price, province, district, ward, address, startPrice, bidEndTime, isBid, isFree });

            if (!cateId || !name || !statusId || !warrantyId || !madeInId || !description || !price || !province || !district || !ward || !address) {
                throw {
                    status: 404,
                    codeMessage: 'ERR_FIELD',
                    message: httpMessage.ERR_FIELD,
                }
            }

            if (Number.isNaN(Number(price))) {
                throw {
                    status: 404,
                    message: 'Tiền phải là số',
                }
                return
            }

            if (req.files.length === 0) {
                throw {
                    status: 404,
                    codeMessage: 'ERR_FIELD',
                    message: 'Chưa có hình ảnh cho sản phẩm của bạn',
                }
                return
            }

            if (isBid === 'true') {
                price = -1;
                typePost = 'BIDDING'
                if (!Number.isNaN(Number(bidEndTime))) {
                    throw {
                        status: 404,
                        message: 'Thời gian đấu giá phải ít nhất là 10 phút'
                    }
                }
            } else if (isFree === 'true') {
                typePost === 'FREE'
                price = 0;
            } else {
                if (Number(price) < 1000) {
                    throw {
                        status: 404,
                        message: 'Số tiền phải lớn hơn 1000 đồng'
                    }
                }
            }


            const post = await createPost(cateId, name, statusId, warrantyId, madeInId, description, price, province, district, ward, address, req.user.userId, typePost);

            console.log('post:::::::', post)

            if (post.dataValues.id) {
                for (let item in req.files) {
                    let _pathImg = `/upload/${req.files[item].filename}`;
                    await createImgPost(_pathImg, post.dataValues.id, req.user.userId)
                }
            };

            // create bid
            if (isBid === 'true') {
                console.log('vo day');
                if (new Date(bidEndTime).getTime() - Date.now() <= 1000 * 60 * 10) {
                    await db.Post.destroy({ where: { id: post.dataValues.id } });
                    return res.status(400).json(
                        {
                            status: 400,
                            message: 'Thời gian đấu giá phải ít nhất là 10 phút'
                        }
                    )
                }
                const data = await createAuction(post.dataValues.id, bidEndTime, startPrice);
                const _postAutionId = data.dataValues.id;
                const _postId = data.dataValues.postId;
                const _time = new Date(bidEndTime).getTime() - Date.now();
                setTimeout(async () => {
                    const _highestBidder = await getHighestBidder(_postId, _postAutionId);
                    await updateTypeForPost(_postId, 'BID')
                    if (_highestBidder === null) {
                        return;
                    }
                    // console.log('highestBidder:::', _highestBidder);
                    const otherBidders = await getOtherBidders(_highestBidder.userId, _postId, _postAutionId);
                    const _otherBidders = otherBidders.map(item => {
                        return (
                            {
                                userId: item.userId
                            }
                        )
                    });

                    await updatePriceEnd(_highestBidder.priceBid, _postId);
                    await addPostToCart(_highestBidder.userId, _postId)

                    if (!_highestBidder) {
                        return;
                    } else {
                        _io.emit('test', { highestBidder: _highestBidder.userId, otherBidders: _otherBidders });
                    }

                }, _time);
            }

            return res.status(200).json({
                status: 200,
                data: post,
                message: httpMessage.SUCCESS_CREATED,
            })


        } catch (error) {
            deleteMultiFiles(req.files)
            next(error)
        }
    },

    createCategory: async (req, res, next) => {
        try {
            const { name, parentId } = req.body;
            let _cateName = name.trim();
            let _cateParent = parentId.trim();
            let _pathImg = `/${req.file.path}`;

            if (req.user.role !== 'ROLE_ADMIN') {
                fs.unlink(_pathImg, (err) => {
                    console.log(err);
                })
                throw {
                    status: 500,
                    message: httpMessage.ERR_ROLE_ADMIN
                }
            }

            if (!_cateName || !_cateParent || req.file === undefined) {
                throw {
                    status: 404,
                    message: httpMessage.ERR_FIELD
                }
            };


            let rs = await createCategory(_cateName, _pathImg, _cateParent);
            if (rs) {
                return res.status(200).json(
                    {
                        status: 200,
                        message: 'Tao thanh cong'
                    }
                )
            } else {
                fs.unlink(`${__dirBaseRoot}${_pathImg}`, (err) => {
                    console.log(err);
                })
                throw {
                    status: 404,
                    message: httpMessage.ERR_CREATED
                }
            }

        } catch (error) {
            next(error)
        }
    },

    getUserInfo: async (req, res, next) => {
        try {
            const data = await getUserInfo(req.user.userId)
            res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    updateLikePost: async (req, res, next) => {
        try {
            const { liked, postId } = req.body
            const data = await updateLikePost(liked, postId, req.user.userId)
            res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getPostShowByUserId: async (req, res, next) => {
        try {
            const { activeId, page } = req.params
            // const 
            const _data = await getPostShowByUserId(req.user.userId, activeId, page);
            const data = _data.rows;
            console.log('_totalPage:::', _data.count);
            const totalPage = Math.ceil(_data.count / 5);
            console.log('total page:::', totalPage)
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }

            return res.status(200).json(
                {
                    status: 200,
                    totalPage,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getPostHideByUserId: async (req, res, next) => {
        try {
            const { activeId, page } = req.params
            // const 
            const _data = await getPostHideByUserId(req.user.userId, activeId, page);
            const data = _data.rows;
            console.log('_totalPage:::', _data.count);
            const totalPage = Math.ceil(_data.count / 5);
            console.log('total page:::', totalPage)
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }

            return res.status(200).json(
                {
                    status: 200,
                    totalPage,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getPostBidShowByUserId: async (req, res, next) => {
        try {
            const { page } = req.params
            // const 
            const _data = await getPostBidShowByUserId(req.user.userId, 1, page);
            const data = _data.rows;
            console.log('_totalPage:::', _data.count);
            const totalPage = Math.ceil(_data.count / 5);
            console.log('total page:::', totalPage)
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }

            return res.status(200).json(
                {
                    status: 200,
                    totalPage,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    updateActiveIdPost: async (req, res, next) => {
        try {
            const { postId, activeId } = req.body
            console.log('postId', postId);
            console.log("activeId", activeId);
            console.log('userId', req.user.userId)
            const data = await updateActiveIdPost(req.user.userId, postId, activeId);
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )

        } catch (error) {
            next(error)
        }
    },

    getAllPostByUserId: async (req, res, next) => {
        try {
            const data = await getAllPostByUserId(req.user.userId);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    likePost: async (req, res, next) => {
        try {
            const { postId } = req.body
            const data = await likePost(req.user.userId, postId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    unlikePost: async (req, res, next) => {
        try {
            const { postId } = req.body;
            const data = await unlikePost(req.user.userId, postId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getCurrentLikePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const data = await getCurrentLikePost(req.user.userId, postId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getCurrentLikePostByUser: async (req, res, next) => {
        try {
            const data = await getCurentLikePostByUser(req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    updateProfileByUser: async (req, res, next) => {
        try {
            let { firstName, lastName, email, phone, address, changePassword } = req.body;
            console.log('email', email);
            console.log('changePass_Input:::', changePassword)

            if (validateEmail(email) === null) {
                throw {
                    status: 400,
                    codeMessage: 'INVALID_EMAIL',
                    message: httpMessage.ERR_FORMAT_EMAIL
                }

            };

            if (changePassword === "") {
                changePassword = undefined;
            } else {
                if (changePassword.replace(/\s/g, '').length <= 6) {
                    throw {
                        status: 400,
                        codeMessage: 'ERR_FORMAT_PASSWORD',
                        message: httpMessage.ERR_FORMAT_PASSWORD
                    }
                }
            }

            console.log('changePasswrd::::', changePassword)


            const user = await getUserByEmail(email)
            // console.log('checkExistEmail::::', !user);

            if (user !== null) {
                if (user.userId !== req.user.userId) {
                    throw {
                        status: 400,
                        codeMessage: 'ERR_USE_EMAIL',
                        message: 'Không thể sử dụng địa chỉ email'
                    }
                }
            }

            let _phone = Number(phone)
            if (!Number.isInteger(_phone)) {

                throw {
                    status: 422,
                    message: httpMessage.ERR_FORMAT_PHONE,
                }
            }

            if (phone.length <= 8 || phone.length >= 12) {
                throw {
                    status: 422,
                    message: httpMessage.ERR_9_TO_11_NUMBERPHONE,
                }
            }

            let imagePath = '';
            req.file === undefined ? imagePath = undefined : imagePath = '/upload/' + req.file.filename;

            console.log('imgPath::::', imagePath);

            const data = await updateProfileByUser(req.user.userId, firstName, lastName, email, phone, address, changePassword, imagePath)
            res.status(200).json(
                {
                    status: 200,
                    message: "Chỉnh sửa trang cá nhân thành công",
                    data: data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    addPostToCart: async (req, res, next) => {
        try {
            const { postId } = req.body;
            console.log('postId:::', postId);
            const data = await addPostToCart(req.user.userId, postId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getPostCartByUser: async (req, res, next) => {
        try {
            const { page } = req.params
            const _data = await getPostCartByUser(req.user.userId, page);
            let data = _data.rows;
            console.log('data:::', data);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].postId);
            }
            return res.status(200).json(
                {
                    status: 200,
                    data: _data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    removePostCartByPostId: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const data = await removePostCartByPostId(postId, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getPostToCheckout: async (req, res, next) => {
        try {
            const data = await getPostToCheckout(req.user.userId, postId);
            console.log('data in gePostToCheckout:::', data);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    checkPostCartToCheckout: async (req, res, next) => {
        try {
            const { postId, checked } = req.body
            const data = await checkPostCartToCheckout(checked, postId, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getPostChecked: async (req, res, next) => {
        try {
            const { checked } = req.params;
            console.log('checked:::', checked)
            const data = await getPostChecked(checked, req.user.userId);
            console.log('data::::', data);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].postId);
            }
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getAmountPostToCheckout: async (req, res, next) => {
        try {
            const data = await getAmountPostToCheckout();

            res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    // THANH TOAN PAYPAL
    createPayment: async (req, res, next) => {
        const _userId = req.user.userId;
        const { status, message } = req.body;
        console.log({ _userId, status, message });

        let listPost = await getPostChecked(1, _userId);
        console.log('*getPostChecked:::', listPost);
        const listRevenue = listPost.map(item => {
            if (item.Post.price == -1) {
                item.Post.price = item.PostAuction.priceEnd
            }
            return (
                {
                    userId: item.Post.userId,
                    revenue: item.Post.price
                }
            )
        });

        await createRevenue(listRevenue);

        const _listPostItems = listPost.map(item => {
            if (item.Post.price == -1) {
                item.Post.price = item.PostAuction.priceEnd
            }
            return (
                {
                    "name": item.Post.title,
                    "price": item.Post.price + '.00',
                    "currency": "USD",
                    "quantity": 1
                }
            )
        });
        console.log('listPostItem::::', _listPostItems);

        let listPrice = []
        listPost.forEach(item => {
            listPrice.push(item.Post.price)
        });
        // tong tien
        let _total = listPrice.reduce((a, b) => a + b, 0);

        // let _listPostOrder = listPost.map(item => {
        //     return (
        //         {
        //             transactionId: null,
        //             postId: item.Post.id,
        //             price: item.Post.price,
        //             qty: null
        //         }
        //     )
        // })


        var create_payment_json = {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/payment/success",
                "cancel_url": "http://localhost:3000/"
            },
            "transactions": [{
                "item_list": {
                    "items": _listPostItems
                },
                "amount": {
                    "currency": "USD",
                    "total": _total + '.00',
                    // "details": {
                    //     "subtotal": subTotal,
                    //     "shipping": '222'
                    // }
                },
                "description": "This is the payment description."
            }]
        };

        paypalRestSdk.payment.create(create_payment_json, async function (error, payment) {
            if (error) {
                console.log(error.response);
                throw error;
            } else {
                const _payment = payment.payer.payment_method;
                const _payerId = payment.id;
                try {
                    const data = await createPayment(0, _userId, _total, _payment, _payerId, null);
                    console.log('data_createpayment:::', data);
                    let _transactionId = data.dataValues.id
                    console.log('**transactionId:::', data.dataValues.id);
                    let _listPostOrder = [];
                    _listPostOrder = listPost.map(item => {
                        return (
                            {
                                transactionId: _transactionId,
                                postId: item.Post.id,
                                price: item.Post.price,
                                qty: null,
                                msg: null
                            }
                        )
                    });

                    console.log('** lispostorder:::', _listPostOrder);
                    await createListPostOrder(_listPostOrder)
                    await removePostInCart(_userId);
                    //    await updateStatusPostingCart('')
                } catch (error) {
                    next(error);
                }

                for (var index = 0; index < payment.links.length; index++) {
                    //Redirect user to this endpoint for redirect url
                    if (payment.links[index].rel === 'approval_url') {
                        console.log(payment.links[index].href);
                        return res.status(200).json(
                            {
                                status: 200,
                                url: payment.links[index].href
                            }
                        );
                    }
                }


            }
        });


        // getInfoPaymentSuccess = () => {
        // const { PayerID } = req.query;
        var execute_payment_json = {
            "payer_id": 'this is payerId',
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": _total + ".00"
                }
            }]
        };
        // };

        // paypalRestSdk.payment.execute(_paymentId, execute_payment_json, function (error, payment) {
        //     if (error) {
        //         console.log(error.response);
        //         throw error;
        //     } else {
        //         console.log("Get Payment Response");
        //         console.log(JSON.stringify(payment));
        //     }
        // });
    },

    getInfoPaymentSuccess: async (req, res, next) => {

        const { PayerID } = req.query;
        var execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": "USD",
                    "total": "1.00",
                }
            }]
        };

        // console.log(payment);
        // const _payment = payment.payer.payment_method;
        // const _payerId = payment.id;
        // const data = await createPayment(0, _userId, _total, _payment, _payerId, message);

        return res.status(200).json(
            {
                status: 200,
                execute_payment_json
            }
        );


    },

    createPriceBidByUser: async (req, res, next) => {
        try {
            const { postId, priceBid, postAuctionId } = req.body;
            const data = await createPriceBidByUser(req.user.userId, postId, priceBid, postAuctionId);
            const count = await getBiddingPostByUser(req.user.userId);
            _io.emit('qtyBiddingPost', { qty: count.count, userId: req.user.userId });
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getHighestBidder: async (req, res, next) => {
        try {
            const { postId, postAuctionId } = req.params;
            const data = await getHighestBidder(postId, postAuctionId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    removeAution: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await removeAution(id);
            const count = await getBiddingPostByUser(req.user.userId);
            _io.emit('qtyBiddingPost', { qty: count.count, userId: req.user.userId });
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getPriceBidByUserUserId: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await getPriceBidByUserUserId(id, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    createBidSocket: async (req, res, next) => {
        try {
            const { isBid } = req.body;
            _io.emit('userBid', isBid);
            return res.status(200).json(
                {
                    status: 200,
                    data: isBid
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getLikePostByUser: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const data = await getLikePostByUser(postId, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error);
        }
    },

    updatePriceEnd: async (req, res, next) => {
        try {
            const { priceEnd, postId } = req.body;
            const data = await updatePriceEnd(priceEnd, postId);
            return res.status(200).json({
                status: 200,
                data,
            })
        } catch (error) {
            next(error);
        }
    },

    getOrderBuyPost: async (req, res, next) => {
        try {
            const { status } = req.params;
            const data = await getOrderBuyPost(status, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    updateConfirmOrderPost: async (req, res, next) => {
        try {
            const { id, status } = req.body;
            const data = await updateConfirmOrderPost(id, status);
            console.log('updatênk:::', data);

            const { userId, postId } = await getTransactionByOrderId(id);
            await updatePostingCart(postId, userId, status);

            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },


    removePost: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = await removePost(id, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getPostsLike: async (req, res, next) => {
        try {
            const data = await getPostsLike(req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error);
        }
    },

    withdrawByUser: async (req, res, next) => {
        try {
            const { isWithdrew } = req.body;
            const data = await withdrawByUser(isWithdrew, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getRevenueByUser: async (req, res, next) => {
        try {
            const { isWithdrew } = req.params;
            console.log('isWithDrew:::', isWithdrew)
            const data = await getRevenueByUser(isWithdrew, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getQtyPostByMonths: async (req, res, next) => {
        try {
            const listMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            const listPostsByMonths = await Promise.all(listMonths.map(async (item) => {
                const qtyPost = await getQtyPostByMonth(item, req.user.userId);
                return (
                    {
                        name: `T ${item}`,
                        "Bài đăng": qtyPost
                    }
                )
            }))
            return res.status(200).json(
                {
                    status: 200,
                    data: listPostsByMonths,
                }
            )

        } catch (error) {
            next(error);
        }
    },

    getBiddingPostByUser: async (req, res, next) => {
        try {
            const data = await getBiddingPostByUser(req.user.userId);
            _io.emit('qtyBiddingPost', { qty: data.count, userId: req.user.userId });
            return res.status(200).json(
                {
                    status: 200,
                    count: data.count,
                    data: data.rows,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    getQtyPostInCartByUser: async (req, res, next) => {
        try {
            const data = await getQtyPostInCartByUser(req.user.userId);
            _io.emit('qtyCart', { qty: data, userId: req.user.userId });
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {

        }
    },


    getOrderPostingsByUser: async (req, res, next) => {
        try {
            const { status } = req.params;
            const data = await getOrderPostingsByUser(req.user.userId, status);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error);
        }
    },

    updateStatusPostingCart: async (req, res, next) => {
        try {
            const { status } = req.body;
            const data = await updateStatusPostingCart(status, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getPostIdCheckoutByUser: async (req, res, next) => {
        try {
            const { checked } = req.params;
            const data = await getPostIdCheckoutByUser(checked, req.user.userId);
            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {
            throw error;
        }
    },

    // lay cac san phảm  mua boi usrid
    getPostingBuyByUser: async (req, res, next) => {
        try {
            const { status } = req.params
            // const data = await getPostingBuyByUser(req.user.userId, status);
            const data = await getPostBuy(req.user.userId, status)
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },


    updateStatusOrderByBuyder: async (req, res, next) => {
        try {
            const { postId, status } = req.body;
            console.log({ postId, status });
            const data = await updateStatusOrderByBuyder(postId, req.user.userId, status);
            return res.status(200).json(
                {
                    status: 200,
                    data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    createOrder: async (req, res, next) => {
        try {
            const { postId, status, price } = req.body;
            const postIds = await db.Cart.findAll(
                {
                    where: {
                        checked: 1,
                        userId: req.user.userId,
                    },
                    attributes: ['postId']
                }
            );
            console.log('postIds:::', postIds);

            const posts = [];

            for (const item of postIds) {
                const post = await db.Post.findOne(
                    {
                        where: {
                            id: item.postId,
                        },
                        attributes: ['id', 'price']
                    }
                );
                posts.push(post);
            }
            console.log('post::::', posts);



            for (const item of posts) {
                const transactionId = await db.Transaction.create(
                    {
                        userId: req.user.userId,
                        payment: null
                    },

                );
                console.log('transactionId:::', transactionId.dataValues.id);

                await createOrder(item.id, 'CONFIRM', item.price, transactionId.dataValues.id);
                await removePostInCart(req.user.userId)

            }

            const data = await getQtyPostInCartByUser(req.user.userId);
            _io.emit('qtyCart', { qty: data, userId: req.user.userId });



            // const data = await createOrder(postId, status, price);
            return res.status(200).json(
                {
                    status: 200,
                    data: true
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getTransactionByUser: async (req, res, next) => {
        try {
            const data = await db.Revenue.findAll(
                {
                    where: {
                        userId: req.user.userId,
                    },
                    attributes: ['revenue', 'createdAt'],
                    order: [
                        ['id', 'DESC']
                    ],
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.User,
                            attributes: ['firstName', 'lastName']
                        },
                    ]
                }
            );

            return res.status(200).json(
                {
                    status: 200,
                    data
                }
            )
        } catch (error) {

        }
    }












}