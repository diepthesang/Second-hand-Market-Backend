'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.hasOne(models.Post, {
        sourceKey: 'postId',
        foreignKey: 'id'
      });

      // Order.hasMany(models.Post, {
      //   sourceKey: 'postId',
      //   foreignKey: 'id'
      // });

      Order.hasOne(models.Transaction, {
        sourceKey: 'transactionId',
        foreignKey: 'id'
      });
    }
  }
  Order.init({
    status: DataTypes.STRING,
    transactionId: DataTypes.INTEGER,
    buyderId: DataTypes.STRING,
    postId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    qty: DataTypes.INTEGER,
    msg: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};