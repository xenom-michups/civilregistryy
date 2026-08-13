'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const firstNames = ['Jean', 'Marie', 'Pierre', 'Paul', 'Emmanuel', 'Grace', 'Faith', 'Hope', 'David', 'Samuel', 'Joseph', 'Daniel', 'Michael', 'Gabriel', 'Raphael', 'Sarah', 'Rebecca', 'Rachel', 'Esther', 'Ruth'];
    const lastNames = ['Nguyen', 'Mbeki', 'Okonkwo', 'Kamara', 'Diallo', 'Toure', 'Mensah', 'Asante', 'Owusu', 'Boateng', 'Adjei', 'Agyeman', 'Appiah', 'Baffour', 'Danso', 'Frimpong', 'Gyamfi', 'Kusi', 'Manu', 'Nkrumah'];
    const addresses = ['123 Main Street, Yaounde', '456 Central Ave, Douala', '789 Market Road, Bamenda', '321 Church Street, Buea', '654 School Lane, Limbe', '987 Hospital Road, Kribi'];
    const purposes = ['Personal Records', 'Legal Proceedings', 'Employment', 'School Enrollment', 'Travel/Visa', 'Insurance', 'Other'];
    const relationships = ['Self', 'Parent', 'Child', 'Spouse', 'Sibling', 'Legal Guardian', 'Authorized Representative'];
    const certTypes = ['birth', 'death', 'marriage', 'residency'];
    const statuses = ['pending', 'processing', 'approved', 'ready', 'rejected', 'collected'];

    const requests = [];
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-12-10');

    for (let i = 1; i <= 50; i++) {
      const createdDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
      const subjectBirthDate = new Date(createdDate.getTime() - (20 + Math.random() * 50) * 365 * 24 * 60 * 60 * 1000);
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      requests.push({
        request_number: `REQ-${createdDate.getFullYear()}-${String(i).padStart(6, '0')}`,
        certificate_type: certTypes[Math.floor(Math.random() * certTypes.length)],
        requester_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        requester_email: `requester${i}@email.com`,
        requester_phone: `+237 6${Math.floor(Math.random() * 90000000 + 10000000)}`,
        requester_id_num: `ID${800000000 + i}${Math.floor(Math.random() * 1000)}`,
        requester_address: addresses[Math.floor(Math.random() * addresses.length)],
        subject_name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        subject_born_on: subjectBirthDate.toISOString().split('T')[0],
        relationship: relationships[Math.floor(Math.random() * relationships.length)],
        purpose: purposes[Math.floor(Math.random() * purposes.length)],
        additional_info: Math.random() > 0.7 ? 'Please expedite this request if possible.' : null,
        status: status,
        rejection_reason: status === 'rejected' ? 'Insufficient documentation provided. Please resubmit with valid ID.' : null,
        processed_at: ['approved', 'ready', 'rejected', 'collected'].includes(status) ? new Date(createdDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
        created_at: createdDate,
        updated_at: createdDate,
      });
    }

    await queryInterface.bulkInsert('certificate_requests', requests);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('certificate_requests', null, {});
  },
};
