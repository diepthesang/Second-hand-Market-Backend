const db = require("../db/models")
const { getHighestBidder } = require("../services/user.service")


// module.exports = {
//   getHighestBidder: async (postId, postAutionId) => {
//     const data = await getHighestBidder(postId, postAutionId);
//     if (!data) {
//       return;
//     } else {
//       return data;
//     }
//   }
// }


module.exports = {
  isAdmin: async (userId) => {
    try {
      const user = await db.User.findOne(
        {
          where: {
            userId,
            role: 'ROLE_ADMIN'
          }
        }
      );
      return !!user
    } catch (error) {
      throw error
    }
  },

}