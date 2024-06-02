"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mahasiswa.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  Mahasiswa.init(
    {
      fakultas: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      departemen: DataTypes.STRING,
      ttd: DataTypes.STRING,
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
