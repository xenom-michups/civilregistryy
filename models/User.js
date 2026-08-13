const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Name is required' },
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: 'Please enter a valid email' },
          notEmpty: { msg: 'Email is required' },
        },
      },
      role: {
        type: DataTypes.ENUM('admin', 'registrar', 'client'),
        defaultValue: 'client',
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      address: {
        type: DataTypes.STRING(255),
      },
      idNumber: {
        type: DataTypes.STRING(50),
        field: 'id_number',
      },
      photo: {
        type: DataTypes.STRING(255),
        defaultValue: 'profile.jpeg',
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: { args: [8, 255], msg: 'Password must be at least 8 characters' },
        },
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      passwordResetToken: {
        type: DataTypes.STRING(255),
      },
      passwordResetExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 12);
            user.passwordChangedAt = new Date();
          }
        },
      },
    }
  );

  // Instance methods
  User.prototype.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      return JWTTimestamp < changedTimestamp;
    }
    return false;
  };

  User.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    return resetToken;
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    delete values.passwordResetToken;
    delete values.passwordResetExpires;
    return values;
  };

  return User;
};
