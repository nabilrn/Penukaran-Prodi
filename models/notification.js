"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Notification.init(
    {
      userId: DataTypes.INTEGER,
      judul: DataTypes.STRING,
      detail: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Notification",
    }
  );
  return Notification;
};
