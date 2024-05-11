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
          role: 'mahasiswa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "palse",
          username: "2211522020",
          password: await bcrypt.hash("garlock", 10),
          role: 'mahasiswa',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "admin",
          username: "admin",
          password: await bcrypt.hash("admin", 10),
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    
      await queryInterface.bulkDelete('users', null, {});
     
  },
};
