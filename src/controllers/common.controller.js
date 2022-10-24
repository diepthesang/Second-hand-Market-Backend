const db = require("../db/models")
const { getAllCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByCityName, getPostByPostId, getImagesProduct, getFirstImageForProduct } = require("../services/common.service")

module.exports = {

    getAllNameCountry: async (req, res, next) => {

        try {
            let nameProduct = await getAllCountry()
            return res.status(200).json(
                {
                    status: 200,
                    data: nameProduct,
                }
            )
        } catch (error) {
            next(error)
        }

    },

    getAllWarrantyStatus: async (req, res, next) => {
        try {
            let data = await getAllWarrantyStatus();
            return res.status(200).json(
                {
                    status: 200,
                    data: data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getAllCategoryParent: async (req, res, next) => {
        try {
            let data = await getAllCategoryParent();
            console.log('data:::', data);
            return res.status(200).json(
                {
                    status: 200,
                    data: data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getAllCategoryChild: async (req, res, next) => {
        try {
            let categoryChildId = req.params.id
            let data = await getAllCategoryChild(categoryChildId)
            return res.status(200).json(
                {
                    status: 200,
                    data: data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getAllStatusCurrentProduct: async (req, res, next) => {
        try {
            let data = await getAllStatusCurrentProduct();
            return res.status(200).json(
                {
                    status: 200,
                    data: data,
                }
            )
        } catch (error) {
            next(error)
        }
    },

    getAllPost: async (req, res, next) => {
        try {
            const data = await getAllPost();
            console.log('dataaaaa:::::::', data);
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

    getPostByCateId: async (req, res, next) => {
        try {
            const id = req.params.id
            const data = await getPostByCateId(id)

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

    getPostByCityName: async (req, res, next) => {
        try {
            const name = req.params.name;
            const data = await getPostByCityName(name);
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

    getPostByPostId: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const data = await getPostByPostId(postId);
            console.log('data:::::')
            console.log(data)
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

    getImagesProduct: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const data = await getImagesProduct(postId);
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

    getFirstImageProductByPostId: async (req, res, next) => {
        try {
            const postId = req.params.id;
            const data = await getFirstImageForProduct(postId);
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