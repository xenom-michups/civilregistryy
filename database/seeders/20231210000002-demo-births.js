'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Emmanuel', 'Grace', 'Faith', 'Hope', 'David', 'Samuel', 'Joseph', 'Daniel', 'Michael', 'Gabriel', 'Raphael', 'Sarah', 'Rebecca', 'Rachel', 'Esther', 'Ruth', 'Naomi', 'Miriam', 'Hannah', 'Deborah', 'Judith', 'Blessing', 'Favour', 'Precious', 'Gift', 'Joy', 'Peace', 'Love', 'Patience', 'Mercy', 'Glory', 'Victor', 'Success', 'Triumph', 'Champion', 'Winner', 'Prince', 'Princess', 'King', 'Queen', 'Royal', 'Noble', 'Bright', 'Brilliant', 'Smart', 'Wise'];
    const lastNames = ['Nguyen', 'Mbeki', 'Okonkwo', 'Kamara', 'Diallo', 'Toure', 'Mensah', 'Asante', 'Owusu', 'Boateng', 'Adjei', 'Agyeman', 'Appiah', 'Baffour', 'Danso', 'Frimpong', 'Gyamfi', 'Kusi', 'Manu', 'Nkrumah', 'Ofori', 'Poku', 'Sarpong', 'Tetteh', 'Yeboah', 'Fon', 'Ndi', 'Tabi', 'Che', 'Ngwa', 'Ayuk', 'Enow', 'Agbor', 'Oben', 'Eta', 'Besong', 'Arrey', 'Egbe', 'Mbi', 'Njock'];
    const places = ['Yaounde Central Hospital', 'Douala General Hospital', 'Bamenda Regional Hospital', 'Buea District Hospital', 'Limbe Health Center', 'Kribi Medical Center', 'Garoua Hospital', 'Maroua Health Center', 'Bafoussam Hospital', 'Bertoua Medical Center', 'Ebolowa Hospital', 'Ngaoundere Health Center', 'Kumba District Hospital', 'Nkongsamba Hospital', 'Edea Health Center'];
    const occupations = ['Teacher', 'Engineer', 'Doctor', 'Nurse', 'Farmer', 'Trader', 'Civil Servant', 'Businessman', 'Accountant', 'Lawyer', 'Mechanic', 'Driver', 'Carpenter', 'Electrician', 'Plumber', 'Tailor', 'Hairdresser', 'Chef', 'Security Guard', 'Banker'];
    const residences = ['Yaounde', 'Douala', 'Bamenda', 'Buea', 'Limbe', 'Kribi', 'Garoua', 'Maroua', 'Bafoussam', 'Bertoua', 'Ebolowa', 'Ngaoundere', 'Kumba', 'Nkongsamba', 'Edea', 'Dschang', 'Foumban', 'Tiko', 'Mutengene', 'Mamfe'];

    const births = [];
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-12-01');

    for (let i = 1; i <= 300; i++) {
      const birthDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const fatherBirthDate = new Date(birthDate.getTime() - (25 + Math.random() * 20) * 365 * 24 * 60 * 60 * 1000);
      const motherBirthDate = new Date(birthDate.getTime() - (22 + Math.random() * 18) * 365 * 24 * 60 * 60 * 1000);
      const drawnUpDate = new Date(birthDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);

      births.push({
        surname: lastNames[Math.floor(Math.random() * lastNames.length)],
        givenname: firstNames[Math.floor(Math.random() * firstNames.length)],
        born_at: places[Math.floor(Math.random() * places.length)],
        born_on: birthDate.toISOString().split('T')[0],
        sex: Math.random() > 0.5 ? 'male' : 'female',
        father_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        father_born_at: places[Math.floor(Math.random() * places.length)],
        father_born_on: fatherBirthDate.toISOString().split('T')[0],
        father_resident_at: residences[Math.floor(Math.random() * residences.length)],
        father_occupation: occupations[Math.floor(Math.random() * occupations.length)],
        father_nationality: 'Cameroon',
        father_ref_doc: `ID${100000000 + i}${Math.floor(Math.random() * 1000)}`,
        mother_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        mother_born_at: places[Math.floor(Math.random() * places.length)],
        mother_born_on: motherBirthDate.toISOString().split('T')[0],
        mother_resident_at: residences[Math.floor(Math.random() * residences.length)],
        mother_occupation: occupations[Math.floor(Math.random() * occupations.length)],
        mother_nationality: 'Cameroon',
        mother_ref_doc: `ID${200000000 + i}${Math.floor(Math.random() * 1000)}`,
        certificate_number: `BC-${birthDate.getFullYear()}-${String(i).padStart(6, '0')}`,
        drawn_up_on: drawnUpDate.toISOString().split('T')[0],
        created_at: drawnUpDate,
        updated_at: drawnUpDate,
      });
    }

    await queryInterface.bulkInsert('births', births);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('births', null, {});
  },
};
