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
    }
  }
  Cart.init({
    postId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    checked: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};