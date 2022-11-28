const db = require("../db/models")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { create } = require("domain");
const { Op, where } = require("sequelize");
// const { devNull } = require("os");
const fs = require('fs');


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

    createPost: async (cateId, name, statusId, warrantyId, madeInId, description, price, province, district, ward, address, userId) => {
        try {
            return await db.Post.create(
                {
                    cateId,
                    title: name,
                    statusId,
                    warrantyId,
                    originId: madeInId,
                    description,
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


    createAuction: async (postId, bidEndTime, priceStart) => {
        try {
            return await db.PostAuction.create(
                {
                    postId,
                    bidEndTime,
                    priceStart
                }
            );
        } catch (error) {
            throw error;
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
        // console.log('service:::::', {
        //     userId, firstName, lastName, email, address, changePassword, imagePath
        // });



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
                    include: [
                        {
                            model: db.Post,
                        },
                        {
                            model: db.PostAuction
                        }
                    ],

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
                    },


                }
            )
        } catch (error) {
            throw error
        }
    },

    getPostChecked: async (checked, userId) => {
        try {
            return await db.Cart.findAll(
                {
                    where: {
                        checked: true,
                        userId,
                    },
                    raw: true,
                    nest: true,
                    include: [
                        {
                            model: db.Post,
                            raw: true,
                            nest: true,
                            include: [
                                {
                                    model: db.User,
                                    attributes: ['userId', 'firstName', 'lastName']
                                }
                            ]
                        },
                        {
                            model: db.PostAuction
                        },
                        // {
                        //     model: db.User,
                        //     attributes: ['userId', 'firstName', 'lastName']
                        // },
                    ]

                }
            )
        } catch (error) {
            throw error;
        }
    },

    getAmountPostToCheckout: async () => {
        try {
            const amount = await db.Cart.sum('price',
                {
                    where: {
                        checked: true
                    },
                    raw: true,
                    nest: true,
                    include: {
                        model: db.Post
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    createPayment: async (status, userId, amount, payment, paymentInfo, message) => {
        try {
            const data = await db.Transaction.create(
                {
                    status,
                    userId,
                    amount,
                    payment,
                    paymentInfo,
                    message,
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    removePostInCart: async (userId) => {
        try {
            const data = await db.Cart.destroy(
                {
                    where: {
                        checked: true,
                        userId,
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    createListPostOrder: async (listPostOrder) => {
        try {
            const data = await db.Order.bulkCreate(
                [...listPostOrder]
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    createPriceBidByUser: async (userId, postId, priceBid, postAuctionId) => {
        try {
            const isUser = await db.BidOrder.findOne(
                {
                    where: {
                        userId,
                        postId,
                        postAuctionId,
                    }
                }
            );

            // console.log('isUser::::', isUser)

            if (isUser) {

                return await db.BidOrder.update(

                    {
                        userId,
                        postId,
                        postAuctionId,
                        priceBid

                    },
                    {
                        where: {
                            userId,
                            postId,
                            postAuctionId,
                        }
                    }

                )
            } else {
                return await db.BidOrder.create(
                    {
                        userId,
                        postId,
                        postAuctionId,
                        priceBid
                    }
                )
            }

        } catch (error) {
            throw error;
        }
    },

    getHighestBidder: async (postId, postAuctionId) => {
        try {
            return await db.BidOrder.findOne({
                where: {
                    postId,
                    postAuctionId
                },
                order: [
                    ['priceBid', 'DESC'],
                ],
            })
        } catch (error) {
            throw error;
        }
    },

    removeAution: async (id) => {
        try {
            return db.BidOrder.destroy(
                {
                    where: {
                        id
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    getPriceBidByUserUserId: async (id, userId) => {
        try {
            return await db.BidOrder.findOne(
                {
                    where: {
                        id,
                        userId,
                    },
                    // attributes: ['priceBid']
                }
            )
        } catch (error) {
            throw error;
        }
    },

    getLikePostByUser: async (postId, userId) => {
        try {
            return await db.Like.findOne(
                {
                    where: {
                        postId,
                        userId
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    updatePriceEnd: async (priceEnd, postId) => {
        try {
            return await db.PostAuction.update(
                {
                    priceEnd
                },
                {
                    where: {
                        postId
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    },

    createRevenue: async (revenue) => {
        // console.log('**revenue:::::::', revenue);
        try {
            return await db.Revenue.bulkCreate(
                [...revenue]
            )
        } catch (error) {
            throw error;
        }
    },

    // xu li don hang mua
    confirmBuyOrder: async () => {
        try {

        } catch (error) {

        }
    },
    // lay cac post cho duoc xac nhan
    getOrderBuyPost: async (status, userId) => {
        try {
            return await db.Order.findAll(
                {
                    where: {
                        status,
                    },
                    attributes: ['id', 'status'],
                    raw: false,
                    nest: true,
                    include:
                        [
                            {
                                model: db.Post,
                                attributes: ['title', 'price'],
                                where: {
                                    userId,
                                },
                                include: [
                                    {
                                        model: db.PostImage,
                                        attributes: ['imagePath']
                                    }
                                ]
                            },
                            {
                                model: db.Transaction,
                                attributes: ['createdAt'],
                                include: [
                                    {
                                        model: db.User,
                                        attributes: ['firstName', 'lastName', 'address', 'phone']
                                    }
                                ]
                            }
                        ]
                }
            )
        } catch (error) {
            throw error;
        }
    },

    updateConfirmOrderPost: async (id, status) => {
        try {
            return await db.Order.update(
                {
                    status
                },
                {
                    where: {
                        id
                    }
                }
            );

        } catch (error) {
            throw error;
        }
    },

    removePost: async (id, userId) => {
        try {
            await db.Post.destroy(
                {
                    where: {
                        id,
                        userId
                    },
                    include: [
                        {
                            model: db.PostImage
                        }
                    ]
                }
            );

            const listImagePaths = await db.PostImage.findAll(
                {
                    where: {
                        postId: id,
                    },
                    attributes: ['imagePath']
                }
            )

            const listFiles = [];

            listImagePaths.map(item => {
                return listFiles.push(item.imagePath);
            })


            listFiles.forEach(item => {
                fs.unlink(`${__dirBaseRoot}/src/public/${item}`, (err) => {
                    console.log(err);
                })
            })


            await db.PostImage.destroy(
                {
                    where: {
                        postId: id,
                        userId,
                    }
                }
            )

            return listImagePaths;

        } catch (error) {
            throw error;
        }
    },

    getPostsLike: async (userId) => {
        try {
            return await db.Like.findAll(
                {

                    where: {
                        userId
                    },
                    attributes: [],
                    raw: false,
                    nest: true,
                    include: [
                        {
                            model: db.Post,
                            attributes: ['id', 'title', 'price'],
                            include: [
                                {
                                    model: db.PostImage,
                                    attributes: ['imagePath']
                                }
                            ]

                        }
                    ]

                }
            )
        } catch (error) {
            throw error;
        }
    },

    getOtherBidders: async (highestBidder, postId, postAuctionId) => {
        try {
            return await db.BidOrder.findAll(
                {
                    where: {
                        postId,
                        postAuctionId,
                        userId: {
                            [Op.not]: highestBidder,
                        }
                    }
                }
            )
        } catch (error) {
            throw error;
        }
    }



}
