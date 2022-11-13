'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostAuction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PostAuction.init({
    postId: DataTypes.INTEGER,
    bidEndTime: DataTypes.STRING,
    priceStart: DataTypes.INTEGER,
    priceEnd: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostAuction',
  });
  return PostAuction;
};