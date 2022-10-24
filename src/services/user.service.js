const db = require("../db/models")
const { v4: uuidv4 } = require('uuid');

module.exports = {
    createCategory: async (cateName, cateLogoImg, cateParent) => {
        try {
            const [row, created] = await db.Category.findOrCreate({
                where: {
                    cateName
                },
                defaults: {
                    // cateId: uuidv4(),
                    cateName,
                    cateLogoImg,
                    cateParent
                },
            });

            return created;
        } catch (error) {
            return error
        }
    },

    createImgPost: async (proImg, proId, userId) => {
        try {
            db.ListImageProduct.create(
                {
                    proImg,
                    proId,
                    userId,
                }
            )
        } catch (error) {
            return error
        }
    },

    createPost: async (cateId, name, statusId, warrantyId, madeInId, description, free, price, province, district, ward, address, userId) => {
        try {
            return await db.Post.create(
                {
                    cateId,
                    name,
                    statusId,
                    warrantyId,
                    madeInId,
                    description,
                    free,
                    price,
                    province,
                    district,
                    ward,
                    address,
                    userId,
                }
            )
        } catch (error) {
            return error
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
            return error
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
            return error
        }
    },

    getPostShowByUserId: async (userId, activeId) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        userId,
                        activeId,
                    }
                }
            )
        } catch (error) {
            return error
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
            return error
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
            return error
        }
    }



}
