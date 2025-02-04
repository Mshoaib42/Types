"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("users", "certificate", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("users", "qualificationVideo", {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn("users", "isApproved", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("users", "certificate");
    await queryInterface.removeColumn("users", "qualificationVideo");
    await queryInterface.removeColumn("users", "isApproved");
  },
};
