const db = require("../db/models")
const { getAllCountry, getAllWarrantyStatus, getAllCategoryParent, getAllCategoryChild, getAllStatusCurrentProduct, getAllPost, getPostByCateId, getPostByCityName, getPostByPostId, getImagesProduct, getFirstImageForProduct, getCateParentByCateChild, getCateById, getAllPostByUserId, getUserByUSerId, getPostByPlace, getPostByName, getPostIsShowingByUserId, getUserBidPost, getAllCityPost, getSomePost, getPostsByCateChildId, getPostsByType } = require("../services/common.service")

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
            const { id, desct, province } = req.params;
            console.log({ id, desct, province })
            const data = await getPostByCateId(id, desct, province)

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
            console.log('postId:::', postId);
            const data = await getPostByPostId(postId);
            console.log('PostByPostId:::;', data);
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
    },

    getCateById: async (req, res, next) => {
        try {
            console.log('pathhhhh:::::::::', __dirBaseRoot)

            const cateChildId = req.params.id;
            const data = await getCateById(cateChildId);
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
            const userId = req.params.id

            const data = await getAllPostByUserId(userId);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
                data[item].Likes = { id: null }
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

    getUserByUserId: async (req, res, next) => {
        try {
            const userId = req.params.id
            const data = await getUserByUSerId(userId);
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

    getPostByPlace: async (req, res, next) => {
        try {
            const { name, page } = req.query;
            console.log('page:::', page);
            const _data = await getPostByPlace(name, page);
            const totalPage = Math.ceil(_data.count / 12)
            const data = _data.rows;
            console.log('data::::', data);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }
            return res.status(200).json({
                status: 200,
                totalPage,
                data,
            })
        } catch (error) {
            next(error)
        }
    },

    getPostByName: async (req, res, next) => {
        try {
            const { search } = req.params;
            const _search = search.replace(/^\s+|\s+$/gm, '');
            console.log("search:::", _search);
            // console.log('search:::', search);
            const data = await getPostByName(_search);
            console.log('data:::', data)
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            }
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

    getPostIsShowingByUserId: async (req, res, next) => {
        try {
            const userId = req.params.id;
            const data = await getPostIsShowingByUserId(userId, req.user.userId);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            };
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

    getUserBidPost: async (req, res, next) => {
        try {
            const { postId, postAuctionId } = req.params;
            const data = await getUserBidPost(postId, postAuctionId);
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

    timeOutTest: (req, res, next) => {
        setTimeout(() => {
            console.log('day la ham set time out')
            _io.emit('test', 'this is test');
        }, 1000 * 20);

        return res.json(
            {
                message: 'test time out'
            }
        )
    },

    getAllCityPost: async (req, res, next) => {
        try {
            const data = await getAllCityPost();
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

    getSomePost: async (req, res, next) => {
        const { cateParentId } = req.params;
        try {
            const data = await getSomePost(cateParentId);
            for (let item in data) {
                data[item].image = await getFirstImageForProduct(data[item].id);
            };
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

    getPostsByCateChildId: async (req, res, next) => {
        try {
            const { cateId } = req.params;
            const data = await getPostsByCateChildId(cateId);
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

    uploadImages: async (req, res, next) => {
        try {
            const images = req.files;
            console.log('images::::::', images);
            return res.json({
                status: 200,
                images,
            })
        } catch (error) {
            next(error);
        }
    },

    getPostsByType: async (req, res, next) => {
        try {
            const { type, activeId } = req.params;
            const data = await getPostsByType(type, activeId);
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