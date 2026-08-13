const { Birth } = require('../models');
const { Op } = require('sequelize');

exports.getAllBirthCert = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { surname: { [Op.like]: `%${search}%` } },
        { givenname: { [Op.like]: `%${search}%` } },
        { certificateNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: births } = await Birth.findAndCountAll({
      where: whereClause,
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      status: 'success',
      results: births.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: { births },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getBirthCert = async (req, res) => {
  try {
    const birth = await Birth.findByPk(req.params.id);

    if (!birth) {
      return res.status(404).json({
        status: 'failed',
        message: 'Birth certificate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { birth },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.createBirthCert = async (req, res) => {
  try {
    // Map snake_case form fields to camelCase model fields
    const birthData = {
      surname: req.body.surname,
      givenname: req.body.givenname,
      bornAt: req.body.born_at,
      bornOn: req.body.born_on,
      sex: req.body.sex,
      fatherName: req.body.father_name,
      fatherBornAt: req.body.father_born_at,
      fatherBornOn: req.body.father_born_on,
      fatherResidentAt: req.body.father_resident_at,
      fatherOccupation: req.body.father_occupation,
      fatherNationality: req.body.father_nationality || 'Cameroon',
      fatherRefDoc: req.body.father_ref_doc,
      motherName: req.body.mother_name,
      motherBornAt: req.body.mother_born_at,
      motherBornOn: req.body.mother_born_on,
      motherResidentAt: req.body.mother_resident_at,
      motherOccupation: req.body.mother_occupation,
      motherNationality: req.body.mother_nationality || 'Cameroon',
      motherRefDoc: req.body.mother_ref_doc,
    };

    const birth = await Birth.create(birthData);

    res.status(201).json({
      status: 'success',
      data: { birth },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateBirthCert = async (req, res) => {
  try {
    const birth = await Birth.findByPk(req.params.id);

    if (!birth) {
      return res.status(404).json({
        status: 'failed',
        message: 'Birth certificate not found',
      });
    }

    await birth.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { birth },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteBirthCert = async (req, res) => {
  try {
    const birth = await Birth.findByPk(req.params.id);

    if (!birth) {
      return res.status(404).json({
        status: 'failed',
        message: 'Birth certificate not found',
      });
    }

    await birth.destroy();

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

exports.getStats = async (req, res) => {
  try {
    const totalBirths = await Birth.count();
    const maleCount = await Birth.count({ where: { sex: 'male' } });
    const femaleCount = await Birth.count({ where: { sex: 'female' } });

    const currentYear = new Date().getFullYear();
    const thisYearBirths = await Birth.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: totalBirths,
        male: maleCount,
        female: femaleCount,
        thisYear: thisYearBirths,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
