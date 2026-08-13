module.exports = (sequelize, DataTypes) => {
  const Marriage = sequelize.define(
    'Marriage',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      groomGivenName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'groom_given_name',
      },
      groomSurname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'groom_surname',
      },
      groomProfession: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'groom_profession',
      },
      groomNationality: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'groom_nationality',
      },
      groomBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'groom_born_on',
      },
      groomPlaceBirth: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_place_birth',
      },
      groomResidentAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_resident_at',
      },
      groomIdNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'groom_id_num',
      },
      groomFatherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_father_name',
      },
      groomMotherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_mother_name',
      },
      groomFamilyHead: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_family_head',
      },
      groomWitnessName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'groom_witness_name',
      },
      brideGivenName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'bride_given_name',
      },
      brideSurname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'bride_surname',
      },
      brideProfession: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'bride_profession',
      },
      brideNationality: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'bride_nationality',
      },
      brideBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'bride_born_on',
      },
      bridePlaceBirth: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_place_birth',
      },
      brideResidentAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_resident_at',
      },
      brideIdNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'bride_id_num',
      },
      brideFatherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_father_name',
      },
      brideMotherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_mother_name',
      },
      brideFamilyHead: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_family_head',
      },
      brideWitnessName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'bride_witness_name',
      },
      matrimonialRegime: {
        type: DataTypes.ENUM('Separate', 'Joint'),
        allowNull: false,
        field: 'matrimonial_regime',
      },
      marriageType: {
        type: DataTypes.ENUM('Polygamy', 'Monogamy'),
        allowNull: false,
        field: 'marriage_type',
      },
      objections: {
        type: DataTypes.ENUM('Yes', 'No'),
        allowNull: false,
        defaultValue: 'No',
      },
      drawnUpOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'drawn_up_on',
      },
      certificateNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        field: 'certificate_number',
      },
    },
    {
      tableName: 'marriages',
      timestamps: true,
      hooks: {
        beforeCreate: async (marriage) => {
          const year = new Date().getFullYear();
          const count = await Marriage.count({
            where: sequelize.where(
              sequelize.fn('YEAR', sequelize.col('created_at')),
              year
            ),
          });
          marriage.certificateNumber = `MC-${year}-${String(count + 1).padStart(6, '0')}`;
        },
      },
    }
  );

  Marriage.prototype.getGroomFullName = function () {
    return `${this.groomGivenName} ${this.groomSurname}`;
  };

  Marriage.prototype.getBrideFullName = function () {
    return `${this.brideGivenName} ${this.brideSurname}`;
  };

  return Marriage;
};
