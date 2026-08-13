'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deaths', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      deceased_surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deceased_givenname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deceased_sex: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
      },
      deceased_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      deceased_born_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      deceased_nationality: {
        type: Sequelize.STRING(100),
        defaultValue: 'Cameroon',
      },
      deceased_occupation: {
        type: Sequelize.STRING(100),
      },
      deceased_residence: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      deceased_id_num: {
        type: Sequelize.STRING(50),
      },
      death_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      death_time: {
        type: Sequelize.TIME,
      },
      death_place: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      cause_of_death: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      father_name: {
        type: Sequelize.STRING(255),
      },
      mother_name: {
        type: Sequelize.STRING(255),
      },
      spouse_name: {
        type: Sequelize.STRING(255),
      },
      declarant_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      declarant_relationship: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      declarant_id_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      declarant_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      certificate_number: {
        type: Sequelize.STRING(50),
        unique: true,
      },
      drawn_up_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.NOW,
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

    await queryInterface.addIndex('deaths', ['certificate_number']);
    await queryInterface.addIndex('deaths', ['deceased_surname', 'deceased_givenname']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('deaths');
  },
};
