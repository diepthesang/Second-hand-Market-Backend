const db = require("../db/models")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { create } = require("domain");
const { Op } = require("sequelize");

module.exports = {
    createCategory: async (cateName, cateLogoImg, cateParent) => {
        try {
            const [row, created] = await db.Category.findOrCreate({
                where: {
                    cateName
                },
                defaults: {
                    cateName,
                    cateLogoImg,
                    cateParent
                },
            });

            return created;
        } catch (error) {
            throw error
        }
    },

    createImgPost: async (imagePath, postId, userId) => {
        try {
            db.PostImage.create(
                {
                    imagePath,
                    postId,
                    userId,
                }
            )
        } catch (error) {
            throw error
        }
    },

    createPost: async (cateId, name, statusId, warrantyId, madeInId, description, free, price, province, district, ward, address, userId) => {
        try {
            free === null ? free = 0 : free;
            console.log('freee:::', free);
            return await db.Post.create(
                {
                    cateId,
                    title: name,
                    statusId,
                    warrantyId,
                    originId: madeInId,
                    description,
                    free,
                    price,
                    province,
                    district,
                    ward,
                    street: address,
                    userId,
                }
            )
        } catch (error) {
            throw error
        }
    },

    getUserInfo: async (userId) => {
        try {
            return await db.User.findOne(
                {
                    where: {
                        userId
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    updateLikePost: async (liked, id, userId) => {
        try {
            return await db.Post.update(
                {
                    liked
                },
                {
                    where: {
                        id,
                        userId,
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    getPostShowByUserId: async (userId, activeId, page) => {
        try {
            const _page = page * 5 - 5;
            return await db.Post.findAndCountAll(
                {
                    limit: 5,
                    offset: _page,
                    where: {
                        userId,
                        activeId,
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    updateActiveIdPost: async (userId, id, activeId) => {
        // const _activeId = Number(activeId)
        try {
            return await db.Post.update(
                {
                    activeId
                },
                {
                    where: {
                        id,
                        userId,
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    getAllPostByUserId: async (userId) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        userId
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    likePost: async (userId, postId) => {
        try {
            return await db.Like.findOrCreate(
                {
                    where: {
                        userId,
                        postId,
                    }
                }
            );
        } catch (error) {
            throw error;
        }
    },

    unlikePost: async (userId, postId) => {
        try {
            return await db.Like.destroy(
                {
                    where: {
                        userId,
                        postId,
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    getCurrentLikePost: async (userId, postId) => {
        try {
            return await db.Like.findOne(
                {
                    where: {
                        userId,
                        postId,
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    getCurentLikePostByUser: async (userId,) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        userId,
                        activeId: 1,
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: db.Like
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    updateProfileByUser: async (userId, firstName, lastName, email, phone, address, changePassword, imagePath) => {
        console.log('service:::::', {
            userId, firstName, lastName, email, address, changePassword, imagePath
        });



        try {

            if (changePassword === undefined) {
                return await db.User.update(
                    {
                        firstName,
                        lastName,
                        email,
                        phone,
                        address,
                        password: changePassword,
                        avatarImg: imagePath,
                    },
                    {
                        where: {
                            userId
                        }
                    }
                )
            } else {
                return bcrypt.hash(changePassword, 8).then(async function (hashPassword) {
                    await db.User.update(
                        {
                            firstName,
                            lastName,
                            email,
                            phone,
                            address,
                            password: hashPassword,
                            avatarImg: imagePath,
                        },
                        {
                            where: {
                                userId
                            }
                        }
                    )
                });


            }

            // return 'success'

        } catch (error) {
            throw error;
        }
    },

    addPostToCart: async (userId, postId) => {
        try {
            const [row, created] = await db.Cart.findOrCreate(
                {
                    where: {
                        postId,
                        userId,
                    },
                    defaults: {
                        postId,
                        userId
                    }
                }
            );
            return created;
        } catch (error) {
            throw error;
        }
    },

    getPostCartByUser: async (userId, page) => {
        let _page = page * 5 - 5;
        try {
            const data = await db.Cart.findAndCountAll(
                {
                    limit: 5,
                    offset: _page,
                    where: {
                        userId
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: db.Post
                    }
                }
            )
            return data;
        } catch (error) {
            throw error;
        }
    },

    removePostCartByPostId: async (postId, userId) => {
        try {
            return await db.Cart.destroy(
                {
                    where: {
                        postId,
                        userId,
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    getPostToCheckout: async (userId, ...postId) => {
        try {
            return await db.Cart.findAll(
                {
                    where: {
                        userId,
                        postId: {
                            [Op.not]: [...postId]
                        }
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    checkPostCartToCheckout: async (checked, postId, userId) => {
        try {
            return await db.Cart.update(
                {
                    checked
                },
                {
                    where: {
                        postId,
                        userId,
                    }
                }
            )
        } catch (error) {
            throw error
        }
    }
}
