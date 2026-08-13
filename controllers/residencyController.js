const { ResidencyCertificate } = require('../models');

exports.createResidency = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const count = await ResidencyCertificate.count();
    const certificateNumber = `RC-${year}-${String(count + 1).padStart(6, '0')}`;
    
    const validUntil = new Date();
    validUntil.setMonth(validUntil.getMonth() + 3);

    // Map snake_case form fields to camelCase model fields
    const residencyData = {
      certificateNumber,
      issuedOn: new Date(),
      validUntil,
      applicantSurname: req.body.applicant_surname,
      applicantGivenname: req.body.applicant_givenname,
      applicantBornOn: req.body.applicant_born_on,
      applicantBornAt: req.body.applicant_born_at,
      applicantNationality: req.body.applicant_nationality || 'Cameroon',
      applicantOccupation: req.body.applicant_occupation,
      applicantIdNum: req.body.applicant_id_num,
      residenceAddress: req.body.residence_address,
      residenceQuarter: req.body.residence_quarter,
      residenceMunicipality: req.body.residence_municipality,
      residenceSince: req.body.residence_since,
      purpose: req.body.purpose,
    };

    const residency = await ResidencyCertificate.create(residencyData);

    res.status(201).json({
      status: 'success',
      data: { residency },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getAllResidencies = async (req, res) => {
  try {
    const residencies = await ResidencyCertificate.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: residencies.length,
      data: { residencies },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getResidency = async (req, res) => {
  try {
    const residency = await ResidencyCertificate.findByPk(req.params.id);

    if (!residency) {
      return res.status(404).json({
        status: 'failed',
        message: 'Residency certificate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { residency },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateResidency = async (req, res) => {
  try {
    const residency = await ResidencyCertificate.findByPk(req.params.id);

    if (!residency) {
      return res.status(404).json({
        status: 'failed',
        message: 'Residency certificate not found',
      });
    }

    await residency.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { residency },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteResidency = async (req, res) => {
  try {
    const residency = await ResidencyCertificate.findByPk(req.params.id);

    if (!residency) {
      return res.status(404).json({
        status: 'failed',
        message: 'Residency certificate not found',
      });
    }

    await residency.destroy();

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
