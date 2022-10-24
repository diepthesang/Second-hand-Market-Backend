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
      Post.hasMany(models.ListImageProduct,
        {
          sourceKey: 'id',
          foreignKey: 'proId',
        });

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

      Post.hasOne(models.StatusCurrentProduct,
        {
          sourceKey: 'statusId',
          foreignKey: 'id'
        })

      Post.hasOne(models.MadeIn,
        {
          sourceKey: 'madeInId',
          foreignKey: 'id'
        })

      Post.hasOne(models.StatusActivePost,
        {
          sourceKey: 'activeId',
          foreignKey: 'id'
        })



      // sourcekey = khoa chinh cua Post
      // foreignKey = khoa ngoai cua ListImageProduct
    }
  }
  Post.init({
    cateId: DataTypes.STRING,
    // proId: DataTypes.STRING,
    name: DataTypes.STRING,
    statusId: DataTypes.ENUM('1', '2', '3'),
    warrantyId: DataTypes.INTEGER,
    madeInId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    free: DataTypes.BOOLEAN,
    price: DataTypes.BIGINT,
    province: DataTypes.STRING,
    district: DataTypes.STRING,
    ward: DataTypes.STRING,
    address: DataTypes.STRING,
    activeId: DataTypes.ENUM('1', '2', '3', '4', '5'),
    userId: DataTypes.STRING,
    liked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};

