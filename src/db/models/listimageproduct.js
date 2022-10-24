'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListImageProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ListImageProduct.belongsTo(models.Post, { foreignKey: 'proId', as: 'post' })
    }
  }
  ListImageProduct.init({
    proImg: DataTypes.STRING,
    proId: DataTypes.STRING,
    userId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ListImageProduct',
  });
  return ListImageProduct;
};