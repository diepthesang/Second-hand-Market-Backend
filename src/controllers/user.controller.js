const httpMessage = require('../Helps/httpMessage');
const { createCategory, createImgPost, createPost, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId, likePost, unlikePost, getCurrentLikePost, getCurentLikePostByUser, updateProfileByUser, addPostToCart, getPostCartByUser, removePostCartByPostId, getPostToCheckout, checkPostCartToCheckout } = require('../services/user.service');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
const { deleteMultiFiles, validateEmail } = require('./helps.controller');
const { getFirstImageForProduct } = require('../services/common.service');
const { getUserByEmail } = require('../services/auth.service');
const db = require('../db/models');

module.exports = {
    createPost: async (req, res, next) => {
        console.log('req.body:::', req.body);

        try {
            const { cateId, name, statusId, warrantyId, madeInId, description, free, price, province, district, ward, address, images } = req.body;


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

            console.log("images::::::", req.files);

            console.log('post::::', post);





            if (post.dataValues.id) {
                for (let item in req.files) {
                    let _pathImg = `/upload/${req.files[item].filename}`;
                    await createImgPost(_pathImg, post.dataValues.id, req.user.userId)
                }
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
    }



}