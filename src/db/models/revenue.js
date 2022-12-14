'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Revenue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Revenue.hasOne(models.User, {
        sourceKey: 'userId',
        foreignKey: 'userId'
      });
    }
  }
  Revenue.init({
    userId: DataTypes.STRING,
    revenue: DataTypes.INTEGER,
    isWithdrew: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Revenue',
  });
  return Revenue;
};