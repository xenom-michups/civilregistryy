const express = require('express');
const { Birth, Marriage, Death, ResidencyCertificate } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Public birth certificate search
router.get('/birth', async (req, res) => {
  try {
    const { certificateNumber, search } = req.query;
    const whereClause = {};

    if (certificateNumber) {
      whereClause.certificateNumber = certificateNumber;
    }

    if (search) {
      whereClause[Op.or] = [
        { surname: { [Op.like]: `%${search}%` } },
        { givenname: { [Op.like]: `%${search}%` } },
      ];
    }

    const births = await Birth.findAll({
      where: whereClause,
      attributes: ['id', 'surname', 'givenname', 'bornAt', 'bornOn', 'sex', 'certificateNumber', 'drawnUpOn'],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: births.length,
      data: { births },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

// Public marriage certificate search
router.get('/marriage', async (req, res) => {
  try {
    const { certificateNumber, groom, bride } = req.query;
    const whereClause = {};

    if (certificateNumber) {
      whereClause.certificateNumber = certificateNumber;
    }

    if (groom) {
      whereClause[Op.or] = whereClause[Op.or] || [];
      whereClause[Op.or].push(
        { groomGivenName: { [Op.like]: `%${groom}%` } },
        { groomSurname: { [Op.like]: `%${groom}%` } }
      );
    }

    if (bride) {
      whereClause[Op.or] = whereClause[Op.or] || [];
      whereClause[Op.or].push(
        { brideGivenName: { [Op.like]: `%${bride}%` } },
        { brideSurname: { [Op.like]: `%${bride}%` } }
      );
    }

    const marriages = await Marriage.findAll({
      where: whereClause,
      attributes: [
        'id', 'groomGivenName', 'groomSurname', 'brideGivenName', 'brideSurname',
        'marriageType', 'matrimonialRegime', 'certificateNumber', 'drawnUpOn'
      ],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: marriages.length,
      data: { marriages },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

// Public stats
router.get('/stats/birth', async (req, res) => {
  try {
    const total = await Birth.count();
    res.status(200).json({
      status: 'success',
      data: { total },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

router.get('/stats/marriage', async (req, res) => {
  try {
    const total = await Marriage.count();
    res.status(200).json({
      status: 'success',
      data: { total },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

router.get('/stats/death', async (req, res) => {
  try {
    const total = await Death.count();
    res.status(200).json({
      status: 'success',
      data: { total },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

router.get('/stats/residency', async (req, res) => {
  try {
    const total = await ResidencyCertificate.count();
    res.status(200).json({
      status: 'success',
      data: { total },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

// Public death certificate search
router.get('/death', async (req, res) => {
  try {
    const { certificateNumber, search } = req.query;
    const whereClause = {};

    if (certificateNumber) {
      whereClause.certificateNumber = certificateNumber;
    }

    if (search) {
      whereClause[Op.or] = [
        { deceasedSurname: { [Op.like]: `%${search}%` } },
        { deceasedGivenname: { [Op.like]: `%${search}%` } },
      ];
    }

    const deaths = await Death.findAll({
      where: whereClause,
      attributes: ['id', 'deceasedSurname', 'deceasedGivenname', 'deathDate', 'deathPlace', 'causeOfDeath', 'certificateNumber', 'drawnUpOn'],
      limit: 10,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      status: 'success',
      results: deaths.length,
      data: { deaths },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
});

// Public residency certificate search
router.get('/residency', async (req, res) => {
  try {
    const { certificateNumber, search } = req.query;
    const whereClause = {};

    if (certificateNumber) {
      whereClause.certificateNumber = certificateNumber;
    }

    if (search) {
      whereClause[Op.or] = [
        { surname: { [Op.like]: `%${search}%` } },
        { givenName: { [Op.like]: `%${search}%` } },
      ];
    }

    const residencies = await ResidencyCertificate.findAll({
      where: whereClause,
      attributes: ['id', 'surname', 'givenName', 'address', 'purpose', 'certificateNumber', 'issuedOn'],
      limit: 10,
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
});

module.exports = router;
