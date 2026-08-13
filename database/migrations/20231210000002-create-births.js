'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('births', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      givenname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      born_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      sex: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
      },
      father_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      father_born_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      father_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      father_resident_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      father_occupation: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      father_nationality: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Cameroon',
      },
      father_ref_doc: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      mother_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mother_born_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mother_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      mother_resident_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      mother_occupation: {
        type: Sequelize.STRING(255),
      },
      mother_nationality: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'Cameroon',
      },
      mother_ref_doc: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      drawn_up_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      certificate_number: {
        type: Sequelize.STRING(50),
        unique: true,
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

    await queryInterface.addIndex('births', ['certificate_number']);
    await queryInterface.addIndex('births', ['surname', 'givenname']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('births');
  },
};
