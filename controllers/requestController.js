const { CertificateRequest, User } = require('../models');
const { Op } = require('sequelize');

exports.createRequest = async (req, res) => {
  try {
    console.log('Request body keys:', Object.keys(req.body));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const year = new Date().getFullYear();
    const count = await CertificateRequest.count();
    const requestNumber = `REQ-${year}-${String(count + 1).padStart(6, '0')}`;

    // Map snake_case form fields to camelCase model fields
    const requestData = {
      requestNumber,
      certificateType: req.body.certificate_type,
      requesterName: req.body.requester_name,
      requesterEmail: req.body.requester_email,
      requesterPhone: req.body.requester_phone,
      requesterIdNum: req.body.requester_id_num,
      requesterAddress: req.body.requester_address,
      subjectName: req.body.subject_name,
      subjectBornOn: req.body.subject_born_on || null,
      relationship: req.body.relationship,
      purpose: req.body.purpose,
      additionalInfo: req.body.additional_info,
      requesterSignature: req.body.requester_signature,
      status: 'pending',
    };

    const request = await CertificateRequest.create(requestData);

    res.status(201).json({
      status: 'success',
      data: { request },
    });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getAllRequests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (type) whereClause.certificateType = type;

    const requests = await CertificateRequest.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: { requests },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getRequest = async (req, res) => {
  try {
    const request = await CertificateRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'failed',
        message: 'Request not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { request },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.trackRequest = async (req, res) => {
  try {
    const { requestNumber, email } = req.query;
    
    if (!requestNumber && !email) {
      return res.status(400).json({
        status: 'failed',
        message: 'Please provide request number or email',
      });
    }

    const whereClause = {};
    if (requestNumber) whereClause.requestNumber = requestNumber;
    if (email) whereClause.requesterEmail = email;

    const requests = await CertificateRequest.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: requests.length,
      data: { requests },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const request = await CertificateRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'failed',
        message: 'Request not found',
      });
    }

    const { status, rejectionReason } = req.body;
    
    await request.update({
      status,
      rejectionReason: status === 'rejected' ? rejectionReason : null,
      processedBy: req.user?.id,
      processedAt: new Date(),
    });

    res.status(200).json({
      status: 'success',
      data: { request },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await CertificateRequest.findByPk(req.params.id);

    if (!request) {
      return res.status(404).json({
        status: 'failed',
        message: 'Request not found',
      });
    }

    await request.destroy();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getRequestStats = async (req, res) => {
  try {
    const pending = await CertificateRequest.count({ where: { status: 'pending' } });
    const processing = await CertificateRequest.count({ where: { status: 'processing' } });
    const approved = await CertificateRequest.count({ where: { status: 'approved' } });
    const ready = await CertificateRequest.count({ where: { status: 'ready' } });
    const rejected = await CertificateRequest.count({ where: { status: 'rejected' } });
    const collected = await CertificateRequest.count({ where: { status: 'collected' } });

    res.status(200).json({
      status: 'success',
      data: { pending, processing, approved, ready, rejected, collected },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
