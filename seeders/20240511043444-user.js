"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          nama: "nabil",
          username: "2211522018",
          password: await bcrypt.hash("1234", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "palse",
          username: "2211522020",
          password: await bcrypt.hash("garlock", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "triana",
          username: "2211522008",
          password: await bcrypt.hash("triana", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "tiara",
          username: "231152003",
          password: await bcrypt.hash("tiara", 10),
          role: "mahasiswa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "nurul",
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
          nama: "Husnil Kamil",
          username: "198201182008121002",
          password: await bcrypt.hash("husnilk", 10),
          role: "kajur",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "Ahmad Syafruddin Indrapriyatna",
          username: "196307071991031000",
          password: await bcrypt.hash("ahmad", 10),
          role: "dekan",
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
