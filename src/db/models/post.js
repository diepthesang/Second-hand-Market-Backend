'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.hasMany(models.PostImage,
        {
          sourceKey: 'id',
          foreignKey: 'postId',
        });

      // Post.hasOne(models.PostImage,
      //   {
      //     sourceKey: 'id',
      //     foreignKey: 'postId',
      //   });

      Post.hasOne(models.User,
        {
          sourceKey: 'userId',
          foreignKey: 'userId'
        })

      Post.hasOne(models.Warranty,
        {
          sourceKey: 'warrantyId',
          foreignKey: 'id'
        })

      Post.hasOne(models.PostCondition,
        {
          sourceKey: 'statusId',
          foreignKey: 'id'
        })

      Post.hasOne(models.Origin,
        {
          sourceKey: 'originId',
          foreignKey: 'id'
        })

      Post.hasOne(models.PostActive,
        {
          sourceKey: 'activeId',
          foreignKey: 'id'
        })

      Post.hasOne(models.PostAuction,
        {
          sourceKey: 'id',
          foreignKey: 'postId',
        }
      );

      Post.hasOne(models.Category, {
        sourceKey: 'cateId',
        foreignKey: 'id'
      });

      Post.hasOne(models.Cart, {
        sourceKey: 'id',
        foreignKey: 'postId'
      });

      Post.hasMany(models.Like, {
        sourceKey: 'id',
        foreignKey: 'postId',
      })



      // sourcekey = khoa chinh cua Post
      // foreignKey = khoa ngoai cua ListImageProduct
    }
  }
  Post.init({
    cateId: DataTypes.STRING,
    title: DataTypes.STRING,
    statusId: DataTypes.ENUM('1', '2', '3'),
    warrantyId: DataTypes.INTEGER,
    originId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    price: DataTypes.BIGINT,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    ward: DataTypes.STRING,
    street: DataTypes.STRING,
    activeId: DataTypes.ENUM('1', '2', '3', '4', '5'),
    typePost: DataTypes.ENUM('SELL', 'FREE', 'BID', 'BIDDING'),
    userId: DataTypes.STRING,
    likeCount: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};

