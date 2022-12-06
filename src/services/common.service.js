const { pid } = require("process");
const { Op } = require("sequelize");
const { Sequelize, sequelize } = require("../db/models");
const db = require("../db/models");

module.exports = {

    getAllCountry: async () => {
        try {
            return await db.Origin.findAll();

        } catch (error) {
            return error
        }
    },

    getAllWarrantyStatus: async () => {
        try {
            return await db.Warranty.findAll()
        } catch (error) {
            return error
        }
    },

    getAllCategoryParent: async () => {
        try {
            return await db.Category.findAll(
                {
                    where: {
                        cateParent: 0
                    }
                }
            )
        } catch (error) {
            return error
        }
    },

    getAllCategoryChild: async (cateParent) => {
        try {
            return await db.Category.findAll(
                {
                    where: {
                        cateParent
                    }

                }
            )
        } catch (error) {
            return error
        }
    },

    getAllStatusCurrentProduct: async () => {
        try {
            return await db.PostCondition.findAll()
        } catch (error) {
            return error
        }
    },

    getAllPost: async () => {
        try {
            return await db.Post.findAll(
                {
                    raw: true,
                    nest: true,
                    include: {
                        model: db.PostImage
                    }

                }
            )
        } catch (error) {
            return error
        }
    },

    getPostByCateId: async (cateChildId, desct, province) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        activeId: 1,
                        cateId: cateChildId,
                        province,
                        price: {
                            [Op.ne]: -1
                        }
                        // province: city,
                        // price: bid
                    },
                    order: [
                        [desct, 'DESC'],
                    ],
                    // raw: true,
                    // nest: true,
                    // include: {
                    //     model: db.ListImageProduct
                    // }
                }
            )
        } catch (error) {
            throw error
        }
    },


    getSomePost: async (cateParentId) => {
        try {

            const listCateChildId = await db.Category.findAll(
                {
                    where: {
                        cateParent: cateParentId,
                    },
                    attributes: ['id']
                }
            )

            const _listCateChildId = listCateChildId.map(item => {
                return (
                    {
                        cateId: item.id
                    }
                )
            })
            console.log('listCateId:::', _listCateChildId);


            return await db.Post.findAll(
                {
                    where: {
                        activeId: 1,
                        [Op.or]: _listCateChildId
                    },
                    order: sequelize.random()
                }
            )
        } catch (error) {
            throw error;
        }
    },



    getFirstImageForProduct: async (postId) => {
        try {
            return await db.PostImage.findOne(
                {
                    where: {
                        postId
                    }

                }
            )
        } catch (error) {
            return error
        }
    },

    getPostByCityName: async (cateName) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        province: cateName
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    getPostByPostId: async (postId) => {
        console.log('postId:::', postId)
        try {
            const post = await db.Post.findOne(
                {
                    where: {
                        id: postId,
                        activeId: 1
                    },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.User
                        },
                        {
                            model: db.Warranty
                        },
                        {
                            model: db.PostCondition
                        },
                        {
                            model: db.Origin
                        },
                        {
                            model: db.PostActive
                        },
                        {
                            model: db.PostAuction,
                        },
                        {
                            model: db.Category,
                        },


                    ],

                }
            )
            const listImage = await db.PostImage.findAll(
                {
                    where: {
                        postId
                    }
                }
            );

            console.log('listImage::::', listImage);

            const data = {
                ...post,
                listImage
            }

            return data

        } catch (error) {
            throw error
        }
    },

    getImagesProduct: async (postId) => {
        try {
            return await db.PostImage.findAll(
                {
                    where: {
                        postId
                    }
                }
            )
        } catch (error) {
            return error
        }
    },

    getCateById: async (id) => {
        try {
            return await db.Category.findOne(
                {
                    where: {
                        id
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
                        userId,
                        activeId: 1
                    },
                    order: [['id', 'DESC']],


                    // raw: true,
                    // nest: true,
                    // include: {
                    //     model: db.ListImageProduct
                    // }
                }
            )
        } catch (error) {
            throw error
        }
    },

    getUserByUSerId: async (userId) => {
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

    getPostByPlace: async (province, page) => {
        const _page = page * 12 - 12
        try {
            return await db.Post.findAndCountAll(
                {
                    limit: 12,
                    offset: _page,
                    where: {
                        province,
                        activeId: 1,
                    },
                    order: [['id', 'DESC']]
                }
            )
        } catch (error) {
            throw error
        }
    },

    getPostByName: async (search) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        activeId: 1,
                        title: { [Op.substring]: `%${search}` },
                    }
                }
            )
        } catch (error) {
            throw error
        }
    },

    getPostIsShowingByUserId: async (userId, userAccountId) => {
        // userId : user cua shop
        // userAccountId: user dang dang nhap
        try {
            const data = await db.Post.findAll(
                {
                    where: {
                        userId,
                        activeId: 1,
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: db.Like,
                        where: {
                            userId: userAccountId,
                        },
                        required: false,
                    }
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    getUserBidPost: async (postId, postAuctionId,) => {
        try {
            return await db.BidOrder.findAll(
                {
                    where: {
                        postId,
                        postAuctionId,
                    },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.User
                        },],

                    order: [
                        ['priceBid', 'DESC'],
                    ],
                }

            )
        } catch (error) {
            throw error;
        }
    },

    getAllCityPost: async () => {
        try {
            return await db.Post.aggregate('province', 'DISTINCT', { plain: false });
        } catch (error) {
            throw error;
        }
    },

    getPostsByCateChildId: async (cateId) => {
        try {
            return db.Post.findAll({
                where: {
                    cateId,
                    activeId: 1
                },
                raw: false,
                nest: true,
                include: [
                    {
                        model: db.PostImage,

                    },
                ],
            })
        } catch (error) {
            throw error;
        }
    },

    getPostsByType: async (typePost, activeId) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        activeId: 1,
                        typePost,
                    },
                    raw: false,
                    nest: true,
                    include: [
                        {
                            model: db.PostImage,
                            attributes: ['imagePath']
                        }
                    ]

                }
            )
        } catch (error) {
            throw error;
        }
    }








}