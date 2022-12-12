'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Cart.hasOne(models.Post, {
        sourceKey: 'postId',
        foreignKey: 'id'
      });
      Cart.hasOne(models.PostAuction, {
        sourceKey: 'postId',
        foreignKey: 'postId'
      });
      Cart.hasOne(models.User, {
        sourceKey: 'userId',
        foreignKey: 'userId'
      });
    
    }
  }
  Cart.init({
    postId: DataTypes.INTEGER,
    status: DataTypes.STRING,
    userId: DataTypes.STRING,
    checked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};