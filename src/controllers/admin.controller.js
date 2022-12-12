const db = require("../db/models");
const { isAdmin } = require("../Helps/common")
const { getUserInfo, removeUser, searchUserByLastname, getAllPost, removePostByPostId, searchPostByTitle, removePostsByUserId, getParentCategories, addCategory, removeCategoryById, updateCategory, getCategoryById, getUsersByMonth, getPostingsByMonth, getPostingSoldByMonth, getBidPostingsByMonth } = require("../services/admin.service")

module.exports = {
  getUserInfo: async (req, res, next) => {
    try {
      const data = await getUserInfo();
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

  removeUser: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await removePostsByUserId(userId);
      res.status(200).json(
        {
          status: 200,
          data,
        }
      )
    } catch (error) {
      next(error)
    }
  },

  searchUserByLastname: async (req, res, next) => {
    try {
      const { lastName } = req.params;
      console.log('lastName::::', lastName);
      const data = await searchUserByLastname(lastName);
      console.log(data);
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

  getAllPost: async (req, res, next) => {
    try {
      const data = await getAllPost();
      return res.status(200).json(
        {
          status: 200,
          data,
        }
      )
    } catch (error) {
      throw error;
    }
  },

  removePostByPostId: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log('id:::', id);
      const data = await removePostByPostId(id);
      console.log('isDelete:::', data)
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

  searchPostByTitle: async (req, res, next) => {
    try {
      const { title } = req.params;
      const data = await searchPostByTitle(title);
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

  removePostByUserId: async (req, res, next) => {
    try {
      const { userId } = req.params;
      const data = await removePostsByUserId(userId);
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

  getParentCategories: async (req, res, next) => {
    try {
      const { parentCate } = req.params;
      const data = await getParentCategories(parentCate);
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

  addCategory: async (req, res, next) => {
    try {
      const { cateName, cateParent } = req.body;
      console.log(
        {
          cateName,
          cateParent,
          image: req.file
        }
      );

      if (req.file === undefined) {
        return res.status(400).json(
          {
            status: 400,
            message: 'Không có hình ảnh'
          }
        )
      };

      const data = await addCategory(cateName, `/upload/${req.file.filename}`, cateParent);

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

  removeCategoryById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await removeCategoryById(id);
      console.log('is::', data);
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

  updateCategory: async (req, res, next) => {
    try {
      const { id, cateName } = req.body;
      let _cateLogoImg = ''
      console.log({ id, cateName })

      req.file === undefined ? _cateLogoImg = undefined : _cateLogoImg = `/upload/${req.file.filename}`

      const data = await updateCategory(id, cateName, _cateLogoImg);

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

  getCategoryById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await getCategoryById(id);
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

  getUsersByMonth: async (req, res, next) => {
    try {
      const listMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const listUsersByMonths = await Promise.all(listMonths.map(async (item) => {
        const qtyPost = await getUsersByMonth(item);
        return (
          {
            name: `T ${item}`,
            "Tài khoản": qtyPost
          }
        )
      }))
      return res.status(200).json(
        {
          status: 200,
          data: listUsersByMonths,
        }
      )

    } catch (error) {
      next(error);
    }

  },

  getPostingsByMonth: async (req, res, next) => {
    try {
      const listMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const listPosting = await Promise.all(listMonths.map(async (item) => {
        const qtyPost = await getPostingsByMonth(item);
        return (
          {
            name: `T ${item}`,
            "Bài viết": qtyPost
          }
        )
      }))
      return res.status(200).json(
        {
          status: 200,
          data: listPosting,
        }
      )
    } catch (error) {
      next(error);
    }
  },

  getPostAndPostingsSoldByMonth: async (req, res, next) => {
    try {
      const { status } = req.params;
      const listMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const listPosting = await Promise.all(listMonths.map(async (item) => {
        const qtyPostSold = await getPostingSoldByMonth(item, status);
        const qtyPost = await getPostingsByMonth(item);
        return (
          {
            name: `T ${item}`,
            "Bài đăng": qtyPost,
            "Đã bán": qtyPostSold
          }
        )
      }))
      return res.status(200).json(
        {
          status: 200,
          data: listPosting,
        }
      )
    } catch (error) {
      next(error);
    }
  },

  getBidPostingsByMonth: async (req, res, next) => {
    try {
      const listMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      const listBidPosting = await Promise.all(listMonths.map(async (item) => {
        const qtyPost = await getBidPostingsByMonth(item);
        return (
          {
            name: `T ${item}`,
            "Đấu giá": qtyPost
          }
        )
      }))
      return res.status(200).json(
        {
          status: 200,
          data: listBidPosting,
        }
      )
    } catch (error) {
      next(error);
    }
  },


}