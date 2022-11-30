'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.UserStatus,
        {
          sourceKey: 'statusId',
          foreignKey: 'id',
        }
      );

    }
  }
  User.init({
    userId: DataTypes.STRING,
    emailType: DataTypes.ENUM('google', 'facebook', 'local'),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    avatarImg: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    starRating: DataTypes.INTEGER,
    revenue: DataTypes.INTEGER,
    role: DataTypes.ENUM('ROLE_USER', 'ROLE_ADMIN'),
    statusId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};