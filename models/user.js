"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Mahasiswa, { foreignKey: 'userId', onDelete: 'CASCADE' });
      User.hasMany(models.Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  User.init(
    {
      nama: DataTypes.STRING,
      username: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.STRING
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
