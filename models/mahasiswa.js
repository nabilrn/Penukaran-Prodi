"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    static associate(models) {
      Mahasiswa.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Mahasiswa.hasMany(models.Permohonan, {
        foreignKey: 'mahasiswa_id',
        onDelete: 'CASCADE',
      });
    }
  }
  Mahasiswa.init(
    {
      fakultas: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      departemen: DataTypes.STRING,
      alamat: DataTypes.STRING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      sequelize,
      modelName: "Mahasiswa",
    }
  );
  return Mahasiswa;
};
