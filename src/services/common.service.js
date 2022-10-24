const db = require("../db/models");

module.exports = {

    getAllCountry: async () => {
        try {
            return await db.MadeIn.findAll();

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
            return await db.StatusCurrentProduct.findAll()
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
                        model: db.ListImageProduct
                    }

                }
            )
        } catch (error) {
            return error
        }
    },

    getPostByCateId: async (id) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        cateId: id
                    },
                    // raw: true,
                    // nest: true,
                    // include: {
                    //     model: db.ListImageProduct
                    // }
                }
            )
        } catch (error) {
            return error
        }
    },

    getFirstImageForProduct: async (proId) => {
        try {
            return await db.ListImageProduct.findOne(
                {
                    where: {
                        proId
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
            return error
        }
    },

    getPostByPostId: async (postId) => {
        try {
            return await db.Post.findAll(
                {
                    where: {
                        id: postId
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
                            model: db.StatusCurrentProduct
                        },
                        {
                            model: db.MadeIn
                        },
                        {
                            model: db.StatusActivePost
                        },

                    ],

                }
            )
        } catch (error) {
            return error
        }
    },

    getImagesProduct: async (proId) => {
        try {
            return await db.ListImageProduct.findAll(
                {
                    where: {
                        proId
                    }
                }
            )
        } catch (error) {
            return error
        }
    }

}