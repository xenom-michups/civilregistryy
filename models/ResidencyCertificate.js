const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResidencyCertificate = sequelize.define(
    'ResidencyCertificate',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      applicantSurname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'applicant_surname',
      },
      applicantGivenname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'applicant_givenname',
      },
      applicantBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'applicant_born_on',
      },
      applicantBornAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'applicant_born_at',
      },
      applicantNationality: {
        type: DataTypes.STRING(100),
        defaultValue: 'Cameroon',
        field: 'applicant_nationality',
      },
      applicantOccupation: {
        type: DataTypes.STRING(100),
        field: 'applicant_occupation',
      },
      applicantIdNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'applicant_id_num',
      },
      residenceAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'residence_address',
      },
      residenceQuarter: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'residence_quarter',
      },
      residenceMunicipality: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'residence_municipality',
      },
      residenceSince: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'residence_since',
      },
      purpose: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      certificateNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        field: 'certificate_number',
      },
      issuedOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'issued_on',
      },
      validUntil: {
        type: DataTypes.DATEONLY,
        field: 'valid_until',
      },
    },
    {
      tableName: 'residency_certificates',
      underscored: true,
    }
  );

  return ResidencyCertificate;
};
