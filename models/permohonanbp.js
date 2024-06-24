"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PermohonanBp extends Model {
    static associate(models) {
      PermohonanBp.belongsTo(models.Mahasiswa, {
        foreignKey: "mahasiswaId",
        onDelete: "CASCADE",
      });
      PermohonanBp.belongsTo(models.Permohonan, {
        foreignKey: "permohonan_id",
        onDelete: "CASCADE",
      });
    }
  }
  PermohonanBp.init(
    {
      mahasiswaId: DataTypes.INTEGER,
      permohonan_id: DataTypes.INTEGER,
      bpBaru: DataTypes.STRING,
      status: {
        type: ENUM("diajukan", "selesai"),
      },
    },
    {
      sequelize,
      modelName: "PermohonanBp",
    }
  );
  return PermohonanBp;
};
