const express = require('express');
const { Op } = require('sequelize');
const { Birth, Death, Marriage, ResidencyCertificate, CertificateRequest, User } = require('../models');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all admin routes
router.use(authController.protect);

// Client search endpoint - available to admin and registrar
router.get('/search-clients', authController.restrictTo('admin', 'registrar'), async (req, res) => {
  try {
    const search = req.query.q || '';
    if (search.length < 2) {
      return res.json({ status: 'success', data: [] });
    }

    const clients = await User.findAll({
      where: {
        role: 'client',
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      },
      attributes: ['id', 'name', 'email', 'phone', 'address', 'idNumber'],
      limit: 10,
    });

    res.json({ status: 'success', data: clients });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Admin only routes below
router.use(authController.restrictTo('admin'));

// Helper function for pagination and sorting
const getPaginatedData = async (Model, req, searchFields = []) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const sort = req.query.sort || 'newest';

  let whereClause = {};
  if (search && searchFields.length > 0) {
    whereClause[Op.or] = searchFields.map(field => ({
      [field]: { [Op.like]: `%${search}%` }
    }));
  }

  let order = [['createdAt', 'DESC']];
  if (sort === 'oldest') order = [['createdAt', 'ASC']];
  if (sort === 'name' && searchFields.includes('surname')) order = [['surname', 'ASC']];
  if (sort === 'name' && searchFields.includes('name')) order = [['name', 'ASC']];

  const { count, rows } = await Model.findAndCountAll({
    where: whereClause,
    order,
    limit,
    offset,
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};

// Births
router.get('/births', async (req, res) => {
  try {
    const result = await getPaginatedData(Birth, req, ['surname', 'givenname', 'certificateNumber']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});


router.get('/birth/:id', async (req, res) => {
  try {
    const birth = await Birth.findByPk(req.params.id);
    if (!birth) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: birth });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Deaths
router.get('/deaths', async (req, res) => {
  try {
    const result = await getPaginatedData(Death, req, ['deceasedSurname', 'deceasedGivenname', 'certificateNumber']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

router.get('/death/:id', async (req, res) => {
  try {
    const death = await Death.findByPk(req.params.id);
    if (!death) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: death });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Marriages
router.get('/marriages', async (req, res) => {
  try {
    const result = await getPaginatedData(Marriage, req, ['groomSurname', 'brideSurname', 'certificateNumber']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

router.get('/marriage/:id', async (req, res) => {
  try {
    const marriage = await Marriage.findByPk(req.params.id);
    if (!marriage) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: marriage });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Residencies
router.get('/residencies', async (req, res) => {
  try {
    const result = await getPaginatedData(ResidencyCertificate, req, ['surname', 'givenName', 'certificateNumber']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

router.get('/residency/:id', async (req, res) => {
  try {
    const residency = await ResidencyCertificate.findByPk(req.params.id);
    if (!residency) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: residency });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Requests
router.get('/requests', async (req, res) => {
  try {
    const result = await getPaginatedData(CertificateRequest, req, ['fullName', 'email', 'requestNumber']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

router.get('/request/:id', async (req, res) => {
  try {
    const request = await CertificateRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: request });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

// Users
router.get('/users', async (req, res) => {
  try {
    const result = await getPaginatedData(User, req, ['name', 'email']);
    res.json({ status: 'success', ...result });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'passwordResetToken', 'passwordResetExpires'] }
    });
    if (!user) return res.status(404).json({ status: 'failed', message: 'Not found' });
    res.json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ status: 'failed', message: err.message });
  }
});

module.exports = router;
