const { isAdmin } = require("../Helps/common")
const { getUserInfo, removeUser } = require("../services/admin.service")

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
      const data = await removeUser(userId);
      res.status(200).json(
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