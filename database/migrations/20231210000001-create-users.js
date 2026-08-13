'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'registrar'),
        defaultValue: 'registrar',
      },
      photo: {
        type: Sequelize.STRING(255),
        defaultValue: 'profile.jpeg',
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      password_changed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      password_reset_token: {
        type: Sequelize.STRING(255),
      },
      password_reset_expires: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('users', ['email']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
