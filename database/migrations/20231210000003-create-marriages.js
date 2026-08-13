'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('marriages', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groom_given_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      groom_surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      groom_profession: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      groom_nationality: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      groom_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      groom_place_birth: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groom_resident_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groom_id_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      groom_father_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groom_mother_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groom_family_head: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      groom_witness_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_given_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bride_surname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bride_profession: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bride_nationality: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      bride_born_on: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      bride_place_birth: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_resident_at: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_id_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      bride_father_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_mother_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_family_head: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      bride_witness_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      matrimonial_regime: {
        type: Sequelize.ENUM('Separate', 'Joint'),
        allowNull: false,
      },
      marriage_type: {
        type: Sequelize.ENUM('Polygamy', 'Monogamy'),
        allowNull: false,
      },
      objections: {
        type: Sequelize.ENUM('Yes', 'No'),
        allowNull: false,
        defaultValue: 'No',
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

    await queryInterface.addIndex('marriages', ['certificate_number']);
    await queryInterface.addIndex('marriages', ['groom_surname', 'bride_surname']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('marriages');
  },
};
