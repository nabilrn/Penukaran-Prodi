"use strict";
const { Model, ENUM } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permohonan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permohonan.belongsTo(models.Mahasiswa, {
        foreignKey: "mahasiswa_id",
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
      status: DataTypes.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
    },
    {
      sequelize,
      modelName: 'Permohonan',
    }
  );
  return Permohonan;
};
