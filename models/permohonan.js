"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permohonan extends Model {
    static associate(models) {
      Permohonan.belongsTo(models.Mahasiswa, {
        foreignKey: "mahasiswa_id",
        onDelete: "CASCADE",
      });
      Permohonan.hasOne(models.PermohonanBp, {
        foreignKey: "permohonan_id",
        onDelete: "CASCADE",
      });
    }
  }
  Permohonan.init(
    {
      mahasiswa_id: DataTypes.INTEGER,
      departemen_tujuan: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tahunAjaran: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      semester: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      alasan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
      },
    },
    {
      sequelize,
      modelName: 'Permohonan',
    }
  );
  return Permohonan;
};
