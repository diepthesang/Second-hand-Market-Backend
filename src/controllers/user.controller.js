const httpMessage = require('../Helps/httpMessage');
const { createCategory, createImgPost, createPost, getUserInfo, updateLikePost, getPostShowByUserId, updateActiveIdPost, getAllPostByUserId } = require('../services/user.service');
const { v4: uuidv4 } = require('uuid');
var fs = require('fs');
const { deleteMultiFiles } = require('./helps.controller');
const { getFirstImageForProduct } = require('../services/common.service');

module.exports = {
    createPost: async (req, res, next) => {
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

            console.log("images::::::", req.files)





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
            const { activeId } = req.params
            console.log(activeId)
            const data = await getPostShowByUserId(req.user.userId, activeId);
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

    updateActiveIdPost: async (req, res, next) => {
        try {
            const { postId, activeId } = req.body
            console.log(postId);
            console.log(activeId);
            console.log(req.user.userId)
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
    }



}