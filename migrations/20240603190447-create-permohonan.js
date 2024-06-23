'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Permohonans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      mahasiswa_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Mahasiswas',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      departemen_tujuan: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tahunAjaran: {
        type: Sequelize.STRING,
        allowNull: false
      },
      semester: {
        type: Sequelize.STRING,
        allowNull: false
      },
      alasan: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('diajukan', 'diterima', 'ditolak', 'selesai'),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Permohonans');
  }
};
