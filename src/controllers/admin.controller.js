const { isAdmin } = require("../Helps/common")
const { getUserInfo, removeUser, searchUserByLastname, getAllPost, removePostByPostId, searchPostByTitle, removePostsByUserId } = require("../services/admin.service")

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
  }
}