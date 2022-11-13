const httpMessage = require('../Helps/httpMessage');
// var paypal = require('paypal-rest-sdk');
const { createCategory, createImgPost, createPost, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId, likePost, unlikePost, getCurrentLikePost, getCurentLikePostByUser, updateProfileByUser, addPostToCart, getPostCartByUser, removePostCartByPostId, getPostToCheckout, checkPostCartToCheckout, getPostChecked, getAmountPostToCheckout, createPayment, removePostInCart, createListPostOrder, createAuction, createPriceBidByUser, getHighestBidder, removeAution, getPriceBidByUserUserId } = require('../services/user.service');
const { v4: uuidv4 } = require('uuid');
const { deleteMultiFiles, validateEmail } = require('./helps.controller');
const { getFirstImageForProduct } = require('../services/common.service');
const { getUserByEmail } = require('../services/auth.service');
const db = require('../db/models');
const paypalRestSdk = require('paypal-rest-sdk');
const { _infoTransformers } = require('passport/lib');

module.exports = {
    createPost: async (req, res, next) => {
        console.log('req.body:::', req.body);

        try {
            const { cateId, name, statusId, warrantyId, madeInId, description, free, price, province, district, ward, address, images, bidOption, startPrice, bidEndTime } = req.body;


            if (!cateId || !name || !statusId || !warrantyId || !madeInId || !description || !price || !province || !district || !ward || !address) {
                throw {
                    status: 404,
                    codeMessage: 'ERR_FIELD',
                    message: httpMessage.ERR_FIELD,
                }
            }

            if (req.files.length === 0) {
                throw {
                    status: 404,
                    codeMessage: 'ERR_FIELD',
                    message: 'Chưa có hình ảnh cho sản phẩm của bạn',
                }
            }


            const post = await createPost(cateId, name, statusId, warrantyId, madeInId, description, free, price, province, district, ward, address, req.user.userId);


            if (post.dataValues.id) {
                for (let item in req.files) {
                    let _pathImg = `/upload/${req.files[item].filename}`;
                    await createImgPost(_pathImg, post.dataValues.id, req.user.userId)
                }
            };

            // create auction

            if (bidOption === 'true') {
                await createAuction(post.dataValues.id, bidEndTime, startPrice);
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
            console.log('postId:::', postId)
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
            const data = await getPostChecked(checked);
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


        let listPost = await getPostChecked();
        console.log('*getPostChecked:::', listPost);
        const _listPostItems = listPost.map(item => {
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
        const _total = listPrice.reduce((a, b) => a + b, 0);

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
                    const data = await createPayment(0, _userId, _total, _payment, _payerId, message);
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
                            }
                        )
                    });

                    console.log('** lispostorder:::', _listPostOrder);
                    await createListPostOrder(_listPostOrder)
                    await removePostInCart(_userId);
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
            const { bid } = req.body;
            _io.emit('userBid', bid);
            return res.status(200).json(
                {
                    status: 200,
                    data: bid
                }
            )
        } catch (error) {

        }
    }




}