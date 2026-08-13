'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('residency_certificates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicant_surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      applicant_givenname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      applicant_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      applicant_born_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      applicant_nationality: {
        type: Sequelize.STRING(100),
        defaultValue: 'Cameroon',
      },
      applicant_occupation: {
        type: Sequelize.STRING(100),
      },
      applicant_id_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      residence_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      residence_quarter: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      residence_municipality: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      residence_since: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      purpose: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      certificate_number: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      issued_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      valid_until: {
        type: Sequelize.DATEONLY,
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

    await queryInterface.addIndex('residency_certificates', ['certificate_number']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('residency_certificates');
  },
};
