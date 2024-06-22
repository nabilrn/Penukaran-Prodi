"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE role = "mahasiswa";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const dataMahasiswa = users.map((user) => {
      let fakultas, departemen, alamat;

      switch (user.username) {
        case "2211522018":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Kandang Padati";
          break;
        case "2211522020":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Semen Padang Hospital";
          break;
        case "2211522008":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Melati No. 2";
          break;
        case "231152003":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Kenanga No. 3";
          break;
        case "231152002":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Cempaka No. 4";
          break;
        default:
          fakultas = "Unknown";
          departemen = "Unknown";
          alamat = "Unknown";
      }

      return {
        userId: user.id,
        fakultas,
        departemen,
        alamat,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("mahasiswas", dataMahasiswa, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("mahasiswas", null, {});
  },
};
