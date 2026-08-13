const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CertificateRequest = sequelize.define(
    'CertificateRequest',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      requestNumber: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        field: 'request_number',
      },
      certificateType: {
        type: DataTypes.ENUM('birth', 'death', 'marriage', 'residency'),
        allowNull: false,
        field: 'certificate_type',
      },
      requesterName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'requester_name',
      },
      requesterEmail: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'requester_email',
      },
      requesterPhone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'requester_phone',
      },
      requesterIdNum: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'requester_id_num',
      },
      requesterAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'requester_address',
      },
      subjectName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'subject_name',
      },
      subjectBornOn: {
        type: DataTypes.DATEONLY,
        field: 'subject_born_on',
      },
      relationship: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      additionalInfo: {
        type: DataTypes.TEXT,
        field: 'additional_info',
      },
      status: {
        type: DataTypes.ENUM('pending', 'processing', 'approved', 'rejected', 'ready', 'collected'),
        defaultValue: 'pending',
      },
      rejectionReason: {
        type: DataTypes.TEXT,
        field: 'rejection_reason',
      },
      processedBy: {
        type: DataTypes.INTEGER,
        field: 'processed_by',
      },
      processedAt: {
        type: DataTypes.DATE,
        field: 'processed_at',
      },
      requesterSignature: {
        type: DataTypes.TEXT,
        field: 'requester_signature',
      },
    },
    {
      tableName: 'certificate_requests',
      underscored: true,
    }
  );

  return CertificateRequest;
};
