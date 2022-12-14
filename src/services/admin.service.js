const { Op } = require("sequelize");
const db = require("../db/models")
const fs = require('fs');
const { threadId } = require("worker_threads");
const { sequelize } = require("../db/models");

module.exports = {
  getUserInfo: async () => {
    try {
      return await db.User.findAll(
        {
          attributes: ['userId', 'firstName', 'lastName', 'phone', 'email', 'address', 'starRating', 'createdAt'],
          raw: true,
          nest: true,
          order: [['id', 'DESC']],
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
  },

  searchUserByLastname: async (lastName) => {
    try {
      return await db.User.findAll(
        {
          where: {
            lastName: {
              [Op.substring]: lastName
            },
          },
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
      )
    } catch (error) {
      throw error;
    }
  },


  getAllPost: async () => {
    try {
      return await db.Post.findAll(
        {
          raw: false,
          nest: true,
          include: [
            {
              model: db.User,
              attributes: ['userId']
            },
            {
              model: db.Warranty,
              attributes: ['status']
            },
            {
              model: db.PostCondition,
              attributes: ['status']
            },
            {
              model: db.Origin,
              attributes: ['countryName']
            },
            {
              model: db.PostActive,
              attributes: ['status']
            },
            {
              model: db.Category,
              attributes: ['cateName']
            },
            {
              model: db.PostImage,
              attributes: ['imagePath']
            },




          ],
          order: [['id', 'DESC']],

        }
      )
    } catch (error) {
      return error
    }
  },

  removePostByPostId: async (id) => {
    console.log('postId:::', id);
    try {
      const isSuccess = await db.Post.destroy(
        {
          where: {
            id
          }
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
      });


      listFiles.forEach(item => {
        fs.unlink(`${__dirBaseRoot}/src/public/${item}`, (err) => {
          console.log(err);
        })
      })


      await db.PostImage.destroy(
        {
          where: {
            postId: id,
          }
        }
      );

      // xoa hang trong bang PostAutions
      await db.PostAuction.destroy(
        {
          where: {
            postId: id,
          }
        }
      )

      // xoa hang trong bang Cart
      await db.Cart.destroy(
        {
          where: {
            postId: id
          }
        }
      )

      // xoa hang trong bang Likes
      await db.Like.destroy(
        {
          where: {
            postId: id
          }
        }
      );

      return isSuccess;


    } catch (error) {
      throw error
    }
  },


  removePostsByUserId: async (userId) => {
    try {
      const posts = await db.Post.findAll(
        {
          where: {
            userId
          },
          attributes: ['id']
        }
      );
      await module.exports.removeUser(userId)

      for (const item of posts) {
        console.log('item::;', item.id);
        await module.exports.removePostByPostId(item.id);
      }
      return !!posts;
    } catch (error) {
      throw error;
    }
  },


  searchPostByTitle: async (title) => {
    try {
      return await db.Post.findAll(
        {
          where: {
            title: {
              [Op.substring]: title
            },
          },

          raw: false,
          nest: true,
          include: [
            {
              model: db.User,
              attributes: ['userId']
            },
            {
              model: db.Warranty,
              attributes: ['status']
            },
            {
              model: db.PostCondition,
              attributes: ['status']
            },
            {
              model: db.Origin,
              attributes: ['countryName']
            },
            {
              model: db.PostActive,
              attributes: ['status']
            },
            {
              model: db.Category,
              attributes: ['cateName']
            },
            {
              model: db.PostImage,
              attributes: ['imagePath']
            },
          ],
          order: [['id', 'DESC']],
        }
      )
    } catch (error) {
      throw error;
    }
  },


  getParentCategories: async (cateParent) => {
    try {
      return db.Category.findAll(
        {
          where: {
            cateParent
          },
          attributes: ['id', 'cateName', 'cateLogoImg', 'cateParent']
        }
      )
    } catch (error) {
      throw error;
    }
  },

  addCategory: async (cateName, cateLogoImg, cateParent) => {
    try {
      return await db.Category.create(
        {
          cateName,
          cateLogoImg,
          cateParent
        }
      )
    } catch (error) {
      throw error;
    }
  },

  removeCategoryById: async (id) => {
    try {
      return !! await db.Category.destroy(
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

  updateCategory: async (id, cateName, cateLogoImg) => {
    try {
      return !! await db.Category.update(
        {
          cateName,
          cateLogoImg
        },
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

  getCategoryById: async (id) => {
    try {
      return await db.Category.findOne(
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

  getUsersByMonth: async (month) => {
    try {
      return await db.User.count(
        {
          where: {
            createdAt: sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month)
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  getPostingsByMonth: async (month) => {
    try {
      return await db.Post.count(
        {
          where: {
            createdAt: sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month)
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  getPostingSoldByMonth: async (month, status) => {
    try {
      return await db.Order.count(
        {
          where: {
            status,
            createdAt: sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month)
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },

  getBidPostingsByMonth: async (month) => {
    try {
      return await db.Post.count(
        {
          where: {
            price: -1,
            createdAt: sequelize.where(sequelize.fn("month", sequelize.col("createdAt")), month)
          },
        }
      );
    } catch (error) {
      throw error;
    }
  },


}
