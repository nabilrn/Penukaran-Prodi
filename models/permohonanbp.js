"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PermohonanBp extends Model {
    static associate(models) {
      PermohonanBp.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  PermohonanBp.init(
    {
      userId: DataTypes.INTEGER,
      status: DataTypes.ENUM("diajukan", "selesai"),
    },
    {
      sequelize,
      modelName: "PermohonanBp",
    }
  );
  return PermohonanBp;
};
