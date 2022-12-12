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
      BidOrder.hasOne(models.User,
        {
          sourceKey: 'userId',
          foreignKey: 'userId'
        })
      BidOrder.hasOne(models.PostAuction,
        {
          sourceKey: 'postAuctionId',
          foreignKey: 'id'
        })
      BidOrder.hasOne(models.Post,
        {
          sourceKey: 'postId',
          foreignKey: 'id'
        })
    }
  }
  BidOrder.init({
    postId: DataTypes.INTEGER,
    userId: DataTypes.STRING,
    postAuctionId: DataTypes.INTEGER,
    priceBid: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'BidOrder',
  });
  return BidOrder;
};