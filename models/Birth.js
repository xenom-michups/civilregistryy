module.exports = (sequelize, DataTypes) => {
  const Birth = sequelize.define(
    'Birth',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      surname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Surname is required' },
          len: { args: [1, 100], msg: 'Surname must be less than 100 characters' },
        },
      },
      givenname: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Given name is required' },
          len: { args: [1, 100], msg: 'Given name must be less than 100 characters' },
        },
      },
      bornAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'born_at',
      },
      bornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'born_on',
      },
      sex: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false,
      },
      fatherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'father_name',
      },
      fatherBornAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'father_born_at',
      },
      fatherBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'father_born_on',
      },
      fatherResidentAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'father_resident_at',
      },
      fatherOccupation: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'father_occupation',
      },
      fatherNationality: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Cameroon',
        field: 'father_nationality',
      },
      fatherRefDoc: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'father_ref_doc',
      },
      motherName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'mother_name',
      },
      motherBornAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'mother_born_at',
      },
      motherBornOn: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'mother_born_on',
      },
      motherResidentAt: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'mother_resident_at',
      },
      motherOccupation: {
        type: DataTypes.STRING(255),
        field: 'mother_occupation',
      },
      motherNationality: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'Cameroon',
        field: 'mother_nationality',
      },
      motherRefDoc: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'mother_ref_doc',
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
      tableName: 'births',
      timestamps: true,
      hooks: {
        beforeCreate: async (birth) => {
          const year = new Date().getFullYear();
          const count = await Birth.count({
            where: sequelize.where(
              sequelize.fn('YEAR', sequelize.col('created_at')),
              year
            ),
          });
          birth.certificateNumber = `BC-${year}-${String(count + 1).padStart(6, '0')}`;
        },
      },
    }
  );

  // Virtual for full name
  Birth.prototype.getFullName = function () {
    return `${this.givenname} ${this.surname}`;
  };

  return Birth;
};
