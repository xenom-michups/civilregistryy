'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('Admin@2024!', 12);
    
    await queryInterface.bulkInsert('users', [
      {
        name: 'System Administrator',
        email: 'admin@civilregistry.gov',
        password: hashedPassword,
        role: 'admin',
        photo: 'profile.jpeg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Registry Officer',
        email: 'officer@civilregistry.gov',
        password: hashedPassword,
        role: 'registrar',
        photo: 'profile.jpeg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
