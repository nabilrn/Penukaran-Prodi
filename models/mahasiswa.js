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
      Mahasiswa.hasMany(models.PermohonanBp, {
        foreignKey: 'mahasiswaId',
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

    },
    {
      sequelize,
      modelName: "Mahasiswa",
    }
  );
  return Mahasiswa;
};
