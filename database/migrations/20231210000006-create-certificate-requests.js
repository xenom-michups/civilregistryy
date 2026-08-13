'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('certificate_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      request_number: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false,
      },
      certificate_type: {
        type: Sequelize.ENUM('birth', 'death', 'marriage', 'residency'),
        allowNull: false,
      },
      requester_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      requester_email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      requester_phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      requester_id_num: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      requester_address: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subject_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      subject_born_on: {
        type: Sequelize.DATEONLY,
      },
      relationship: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      purpose: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      additional_info: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'approved', 'rejected', 'ready', 'collected'),
        defaultValue: 'pending',
      },
      rejection_reason: {
        type: Sequelize.TEXT,
      },
      processed_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      processed_at: {
        type: Sequelize.DATE,
      },
      requester_signature: {
        type: Sequelize.TEXT,
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

    await queryInterface.addIndex('certificate_requests', ['request_number']);
    await queryInterface.addIndex('certificate_requests', ['status']);
    await queryInterface.addIndex('certificate_requests', ['requester_email']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('certificate_requests');
  },
};
