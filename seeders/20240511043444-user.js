"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          nama: "Nabil Rizki Navisa",
          username: "2211522018",
          password: await bcrypt.hash("1234", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Naufal",
          username: "2211522020",
          password: await bcrypt.hash("palse", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Triana Zahara Nurhaliza",
          username: "2211522008",
          password: await bcrypt.hash("triana", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Tiara Putri Adhaini",
          username: "231152003",
          password: await bcrypt.hash("tiara", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Nurul Fauziyah",
          username: "231152002",
          password: await bcrypt.hash("nurul", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "admin",
          username: "admin",
          password: await bcrypt.hash("admin", 10),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "lptik",
          username: "lptik",
          password: await bcrypt.hash("lptik", 10),
          role: "lptik",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
