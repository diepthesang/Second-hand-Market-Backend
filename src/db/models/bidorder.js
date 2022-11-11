'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BidOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BidOrder.init({
    postId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    bidEndTime: DataTypes.INTEGER,
    priceStart: DataTypes.INTEGER,
    priceCurerrent: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'BidOrder',
  });
  return BidOrder;
};