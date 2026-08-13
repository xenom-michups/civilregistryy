const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Death = sequelize.define(
    'Death',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      deceasedSurname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'deceased_surname',
      },
      deceasedGivenname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'deceased_givenname',
      },
      deceasedSex: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
        field: 'deceased_sex',
      },
      deceasedBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'deceased_born_on',
      },
      deceasedBornAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'deceased_born_at',
      },
      deceasedNationality: {
        type: DataTypes.STRING(100),
        defaultValue: 'Cameroon',
        field: 'deceased_nationality',
      },
      deceasedOccupation: {
        type: DataTypes.STRING(100),
        field: 'deceased_occupation',
      },
      deceasedResidence: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'deceased_residence',
      },
      deceasedIdNum: {
        type: DataTypes.STRING(50),
        field: 'deceased_id_num',
      },
      deathDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'death_date',
      },
      deathTime: {
        type: DataTypes.TIME,
        field: 'death_time',
      },
      deathPlace: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'death_place',
      },
      causeOfDeath: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'cause_of_death',
      },
      fatherName: {
        type: DataTypes.STRING(255),
        field: 'father_name',
      },
      motherName: {
        type: DataTypes.STRING(255),
        field: 'mother_name',
      },
      spouseName: {
        type: DataTypes.STRING(255),
        field: 'spouse_name',
      },
      declarantName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'declarant_name',
      },
      declarantRelationship: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'declarant_relationship',
      },
      declarantIdNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'declarant_id_num',
      },
      declarantAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'declarant_address',
      },
      certificateNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        field: 'certificate_number',
      },
      drawnUpOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'drawn_up_on',
      },
    },
    {
      tableName: 'deaths',
      underscored: true,
    }
  );

  return Death;
};
