'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Emmanuel', 'Grace', 'Faith', 'Hope', 'David', 'Samuel', 'Joseph', 'Daniel', 'Michael', 'Gabriel', 'Raphael', 'Sarah', 'Rebecca', 'Rachel', 'Esther', 'Ruth'];
    const lastNames = ['Nguyen', 'Mbeki', 'Okonkwo', 'Kamara', 'Diallo', 'Toure', 'Mensah', 'Asante', 'Owusu', 'Boateng', 'Adjei', 'Agyeman', 'Appiah', 'Baffour', 'Danso', 'Frimpong', 'Gyamfi', 'Kusi', 'Manu', 'Nkrumah'];
    const municipalities = ['Yaounde I', 'Yaounde II', 'Yaounde III', 'Douala I', 'Douala II', 'Douala III', 'Bamenda I', 'Bamenda II', 'Buea', 'Limbe'];
    const quarters = ['Bastos', 'Nlongkak', 'Mvan', 'Essos', 'Biyem-Assi', 'Akwa', 'Bonanjo', 'Deido', 'Bonaberi', 'New Town'];
    const purposes = ['Employment', 'School Enrollment', 'Bank Account', 'Legal Proceedings', 'Travel/Visa', 'Other'];
    const occupations = ['Teacher', 'Engineer', 'Doctor', 'Nurse', 'Farmer', 'Trader', 'Civil Servant', 'Businessman', 'Student', 'Unemployed'];

    const residencies = [];
    const startDate = new Date('2023-01-01');
    const endDate = new Date('2024-12-01');

    for (let i = 1; i <= 100; i++) {
      const issuedDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const birthDate = new Date(issuedDate.getTime() - (20 + Math.random() * 40) * 365 * 24 * 60 * 60 * 1000);
      const residenceSince = new Date(issuedDate.getTime() - (1 + Math.random() * 10) * 365 * 24 * 60 * 60 * 1000);
      const validUntil = new Date(issuedDate.getTime() + 90 * 24 * 60 * 60 * 1000);

      residencies.push({
        applicant_surname: lastNames[Math.floor(Math.random() * lastNames.length)],
        applicant_givenname: firstNames[Math.floor(Math.random() * firstNames.length)],
        applicant_born_on: birthDate.toISOString().split('T')[0],
        applicant_born_at: municipalities[Math.floor(Math.random() * municipalities.length)],
        applicant_nationality: 'Cameroon',
        applicant_occupation: occupations[Math.floor(Math.random() * occupations.length)],
        applicant_id_num: `ID${700000000 + i}${Math.floor(Math.random() * 1000)}`,
        residence_address: `${Math.floor(Math.random() * 500) + 1} ${quarters[Math.floor(Math.random() * quarters.length)]} Street`,
        residence_quarter: quarters[Math.floor(Math.random() * quarters.length)],
        residence_municipality: municipalities[Math.floor(Math.random() * municipalities.length)],
        residence_since: residenceSince.toISOString().split('T')[0],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        certificate_number: `RC-${issuedDate.getFullYear()}-${String(i).padStart(6, '0')}`,
        issued_on: issuedDate.toISOString().split('T')[0],
        valid_until: validUntil.toISOString().split('T')[0],
        created_at: issuedDate,
        updated_at: issuedDate,
      });
    }

    await queryInterface.bulkInsert('residency_certificates', residencies);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('residency_certificates', null, {});
  },
};
