"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT id, username FROM users WHERE role = "mahasiswa";',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const dataMahasiswa = users.map((user) => {
      let fakultas, departemen, alamat, fp="default_path";

      switch (user.username) {
        case "2211522018":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Mawar No. 1";
          fp = "pic/Souta.jpg";
          break;
        case "2211522008":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Melati No. 2";
          fp = "pic/Suzume.webp";
          break;
        case "231152003":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Kenanga No. 3";
          fp = "pic/Suzume.webp";
          break;
        case "231152002":
          fakultas = "Fakultas Teknologi Informasi";
          departemen = "Sistem Informasi";
          alamat = "Jalan Cempaka No. 4";
          fp = "pic/Suzume.webp";
          break;
        default:
          fakultas = "Unknown";
          departemen = "Unknown";
          alamat = "Unknown";
          fp = "Unknown"
      }

      return {
        userId: user.id,
        fakultas,
        departemen,
        ttd: "null",
        fp,
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
