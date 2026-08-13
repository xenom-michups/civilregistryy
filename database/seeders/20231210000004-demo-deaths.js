'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Emmanuel', 'Grace', 'Faith', 'Hope', 'David', 'Samuel', 'Joseph', 'Daniel', 'Michael', 'Gabriel', 'Raphael', 'Sarah', 'Rebecca', 'Rachel', 'Esther', 'Ruth'];
    const lastNames = ['Nguyen', 'Mbeki', 'Okonkwo', 'Kamara', 'Diallo', 'Toure', 'Mensah', 'Asante', 'Owusu', 'Boateng', 'Adjei', 'Agyeman', 'Appiah', 'Baffour', 'Danso', 'Frimpong', 'Gyamfi', 'Kusi', 'Manu', 'Nkrumah'];
    const places = ['Yaounde Central Hospital', 'Douala General Hospital', 'Bamenda Regional Hospital', 'Buea District Hospital', 'Limbe Health Center', 'Kribi Medical Center', 'Garoua Hospital', 'Maroua Health Center'];
    const residences = ['Yaounde', 'Douala', 'Bamenda', 'Buea', 'Limbe', 'Kribi', 'Garoua', 'Maroua', 'Bafoussam', 'Bertoua'];
    const causes = ['Natural causes', 'Heart disease', 'Respiratory illness', 'Accident', 'Old age', 'Cancer', 'Stroke', 'Diabetes complications'];
    const relationships = ['Son', 'Daughter', 'Spouse', 'Brother', 'Sister', 'Parent', 'Nephew', 'Niece'];

    const deaths = [];
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-12-01');

    for (let i = 1; i <= 100; i++) {
      const deathDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const birthDate = new Date(deathDate.getTime() - (40 + Math.random() * 50) * 365 * 24 * 60 * 60 * 1000);
      const drawnUpDate = new Date(deathDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);

      deaths.push({
        deceased_surname: lastNames[Math.floor(Math.random() * lastNames.length)],
        deceased_givenname: firstNames[Math.floor(Math.random() * firstNames.length)],
        deceased_sex: Math.random() > 0.5 ? 'male' : 'female',
        deceased_born_on: birthDate.toISOString().split('T')[0],
        deceased_born_at: places[Math.floor(Math.random() * places.length)],
        deceased_nationality: 'Cameroon',
        deceased_occupation: ['Farmer', 'Teacher', 'Trader', 'Civil Servant', 'Retired'][Math.floor(Math.random() * 5)],
        deceased_residence: residences[Math.floor(Math.random() * residences.length)],
        deceased_id_num: `ID${500000000 + i}${Math.floor(Math.random() * 1000)}`,
        death_date: deathDate.toISOString().split('T')[0],
        death_time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
        death_place: places[Math.floor(Math.random() * places.length)],
        cause_of_death: causes[Math.floor(Math.random() * causes.length)],
        father_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        mother_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        spouse_name: Math.random() > 0.3 ? `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}` : null,
        declarant_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        declarant_relationship: relationships[Math.floor(Math.random() * relationships.length)],
        declarant_id_num: `ID${600000000 + i}${Math.floor(Math.random() * 1000)}`,
        declarant_address: residences[Math.floor(Math.random() * residences.length)],
        certificate_number: `DC-${deathDate.getFullYear()}-${String(i).padStart(6, '0')}`,
        drawn_up_on: drawnUpDate.toISOString().split('T')[0],
        created_at: drawnUpDate,
        updated_at: drawnUpDate,
      });
    }

    await queryInterface.bulkInsert('deaths', deaths);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('deaths', null, {});
  },
};
