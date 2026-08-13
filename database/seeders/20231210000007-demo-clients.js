'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash('client123', 12);

    const clients = [];
    const firstNames = [
      'Maria',
      'Jose',
      'Juan',
      'Ana',
      'Pedro',
      'Rosa',
      'Carlos',
      'Elena',
      'Miguel',
      'Carmen',
      'Antonio',
      'Lucia',
      'Francisco',
      'Isabel',
      'Manuel',
      'Teresa',
      'Luis',
      'Pilar',
      'Rafael',
      'Dolores',
      'Fernando',
      'Josefa',
      'Alberto',
      'Francisca',
      'Ricardo',
      'Antonia',
      'Eduardo',
      'Manuela',
      'Andres',
      'Concepcion',
      'Pablo',
      'Rosario',
      'Javier',
      'Mercedes',
      'Diego',
      'Amparo',
      'Sergio',
      'Encarnacion',
      'Ramon',
      'Esperanza',
      'Enrique',
      'Soledad',
      'Vicente',
      'Remedios',
      'Joaquin',
      'Asuncion',
      'Angel',
      'Purificacion',
      'Alejandro',
      'Inmaculada',
    ];

    const lastNames = [
      'Garcia',
      'Rodriguez',
      'Martinez',
      'Lopez',
      'Gonzalez',
      'Hernandez',
      'Perez',
      'Sanchez',
      'Ramirez',
      'Torres',
      'Flores',
      'Rivera',
      'Gomez',
      'Diaz',
      'Reyes',
      'Cruz',
      'Morales',
      'Ortiz',
      'Gutierrez',
      'Chavez',
      'Ramos',
      'Romero',
      'Castillo',
      'Mendoza',
      'Ruiz',
      'Alvarez',
      'Vargas',
      'Jimenez',
      'Moreno',
      'Munoz',
    ];

    const barangays = [
      'Poblacion',
      'San Jose',
      'San Miguel',
      'Santo Nino',
      'San Isidro',
      'San Antonio',
      'Santa Cruz',
      'San Pedro',
      'San Juan',
      'San Roque',
      'Bagong Silang',
      'Maligaya',
      'Mabuhay',
      'Masagana',
      'Mapayapa',
    ];

    for (let i = 1; i <= 500; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const barangay = barangays[Math.floor(Math.random() * barangays.length)];

      clients.push({
        name: `${firstName} ${lastName}`,
        email: `client${i}@example.com`,
        role: 'client',
        phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
        address: `${Math.floor(1 + Math.random() * 999)} ${barangay}, Municipality`,
        id_number: `ID-${String(i).padStart(6, '0')}`,
        photo: 'profile.jpeg',
        password: hashedPassword,
        password_changed_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', clients);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { role: 'client' });
  },
};
