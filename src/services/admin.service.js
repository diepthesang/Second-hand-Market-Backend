const db = require("../db/models")

module.exports = {
  getUserInfo: async () => {
    try {
      return await db.User.findAll(
        {
          attributes: ['userId', 'firstName', 'lastName', 'phone', 'address', 'starRating', 'createdAt'],
          raw: true,
          nest: true,
          include: [
            {
              model: db.UserStatus,
              attributes: ['status'],
            },

          ]
        }
      );
    } catch (error) {
      throw error;
    }
  },

  removeUser: async (userId) => {
    try {
      return await db.User.destroy(
        {
          where: {
            userId
          }
        }
      )
    } catch (error) {
      throw error;
    }
  }
}
