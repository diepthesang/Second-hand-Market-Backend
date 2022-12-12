'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.hasOne(models.User, {
        sourceKey: 'userId',
        foreignKey: 'userId'
      });

      // Transaction.hasOne(models.Order, {
      //   sourceKey: 'id',
      //   foreignKey: 'transactionId'
      // });

      Transaction.hasMany(models.Order, {
        sourceKey: 'id',
        foreignKey: 'transactionId'
      });


    }
  }
  Transaction.init({
    status: DataTypes.BOOLEAN,
    userId: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    payment: DataTypes.STRING,
    paymentInfo: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};