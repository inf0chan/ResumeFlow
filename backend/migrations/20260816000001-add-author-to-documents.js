'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('documents', 'authorName', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('documents', 'authorEmail', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('documents', 'authorName');
    await queryInterface.removeColumn('documents', 'authorEmail');
  }
};
