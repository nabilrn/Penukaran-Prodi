"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PermohonanBp extends Model {
    static associate(models) {
      PermohonanBp.belongsTo(models.Mahasiswa, {
        foreignKey: "mahasiswaId",
        onDelete: "CASCADE",
      });
    }
  }
  PermohonanBp.init(
    {
      mahasiswaId: DataTypes.INTEGER,
      bpBaru: DataTypes.STRING,
      status: DataTypes.ENUM("diajukan", "selesai"),
    },
    {
      sequelize,
      modelName: "PermohonanBp",
    }
  );
  return PermohonanBp;
};
