'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Emmanuel', 'Grace', 'Faith', 'Hope', 'David', 'Samuel', 'Joseph', 'Daniel', 'Michael', 'Gabriel', 'Raphael', 'Sarah', 'Rebecca', 'Rachel', 'Esther', 'Ruth', 'Naomi', 'Miriam', 'Hannah', 'Deborah', 'Judith', 'Blessing', 'Favour', 'Precious', 'Gift', 'Joy', 'Peace', 'Love', 'Patience', 'Mercy', 'Glory', 'Victor', 'Success', 'Triumph', 'Champion', 'Winner', 'Prince', 'Princess', 'King', 'Queen', 'Royal', 'Noble', 'Bright', 'Brilliant', 'Smart', 'Wise'];
    const lastNames = ['Nguyen', 'Mbeki', 'Okonkwo', 'Kamara', 'Diallo', 'Toure', 'Mensah', 'Asante', 'Owusu', 'Boateng', 'Adjei', 'Agyeman', 'Appiah', 'Baffour', 'Danso', 'Frimpong', 'Gyamfi', 'Kusi', 'Manu', 'Nkrumah', 'Ofori', 'Poku', 'Sarpong', 'Tetteh', 'Yeboah', 'Fon', 'Ndi', 'Tabi', 'Che', 'Ngwa', 'Ayuk', 'Enow', 'Agbor', 'Oben', 'Eta', 'Besong', 'Arrey', 'Egbe', 'Mbi', 'Njock'];
    const places = ['Yaounde', 'Douala', 'Bamenda', 'Buea', 'Limbe', 'Kribi', 'Garoua', 'Maroua', 'Bafoussam', 'Bertoua', 'Ebolowa', 'Ngaoundere', 'Kumba', 'Nkongsamba', 'Edea', 'Dschang', 'Foumban', 'Tiko', 'Mutengene', 'Mamfe'];
    const professions = ['Teacher', 'Engineer', 'Doctor', 'Nurse', 'Farmer', 'Trader', 'Civil Servant', 'Businessman', 'Accountant', 'Lawyer', 'Mechanic', 'Driver', 'Carpenter', 'Electrician', 'Plumber', 'Tailor', 'Hairdresser', 'Chef', 'Security Guard', 'Banker', 'Pharmacist', 'Architect', 'Journalist', 'Pilot', 'Entrepreneur'];

    const marriages = [];
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2024-12-01');

    for (let i = 1; i <= 250; i++) {
      const marriageDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const groomBirthDate = new Date(marriageDate.getTime() - (25 + Math.random() * 20) * 365 * 24 * 60 * 60 * 1000);
      const brideBirthDate = new Date(marriageDate.getTime() - (22 + Math.random() * 18) * 365 * 24 * 60 * 60 * 1000);

      marriages.push({
        groom_given_name: firstNames[Math.floor(Math.random() * firstNames.length)],
        groom_surname: lastNames[Math.floor(Math.random() * lastNames.length)],
        groom_profession: professions[Math.floor(Math.random() * professions.length)],
        groom_nationality: 'Cameroon',
        groom_born_on: groomBirthDate.toISOString().split('T')[0],
        groom_place_birth: places[Math.floor(Math.random() * places.length)],
        groom_resident_at: places[Math.floor(Math.random() * places.length)],
        groom_id_num: `ID${300000000 + i}${Math.floor(Math.random() * 1000)}`,
        groom_father_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        groom_mother_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        groom_family_head: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        groom_witness_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        bride_given_name: firstNames[Math.floor(Math.random() * firstNames.length)],
        bride_surname: lastNames[Math.floor(Math.random() * lastNames.length)],
        bride_profession: professions[Math.floor(Math.random() * professions.length)],
        bride_nationality: 'Cameroon',
        bride_born_on: brideBirthDate.toISOString().split('T')[0],
        bride_place_birth: places[Math.floor(Math.random() * places.length)],
        bride_resident_at: places[Math.floor(Math.random() * places.length)],
        bride_id_num: `ID${400000000 + i}${Math.floor(Math.random() * 1000)}`,
        bride_father_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        bride_mother_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        bride_family_head: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        bride_witness_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        matrimonial_regime: Math.random() > 0.5 ? 'Joint' : 'Separate',
        marriage_type: Math.random() > 0.85 ? 'Polygamy' : 'Monogamy',
        objections: 'No',
        certificate_number: `MC-${marriageDate.getFullYear()}-${String(i).padStart(6, '0')}`,
        drawn_up_on: marriageDate.toISOString().split('T')[0],
        created_at: marriageDate,
        updated_at: marriageDate,
      });
    }

    await queryInterface.bulkInsert('marriages', marriages);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('marriages', null, {});
  },
};
