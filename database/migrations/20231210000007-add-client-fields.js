'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new columns for client users
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'id_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
    });

    // Update role ENUM to include 'client'
    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'registrar', 'client'),
      defaultValue: 'client',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'address');
    await queryInterface.removeColumn('users', 'id_number');

    await queryInterface.changeColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'registrar'),
      defaultValue: 'registrar',
    });
  },
};
