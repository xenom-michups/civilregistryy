const { Marriage } = require('../models');
const { Op } = require('sequelize');

exports.getAllCert = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, sort = 'createdAt', order = 'DESC' } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (search) {
      whereClause[Op.or] = [
        { groomSurname: { [Op.like]: `%${search}%` } },
        { groomGivenName: { [Op.like]: `%${search}%` } },
        { brideSurname: { [Op.like]: `%${search}%` } },
        { brideGivenName: { [Op.like]: `%${search}%` } },
        { certificateNumber: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: marriages } = await Marriage.findAndCountAll({
      where: whereClause,
      order: [[sort, order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.status(200).json({
      status: 'success',
      results: marriages.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: { marriages },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getCert = async (req, res) => {
  try {
    const marriage = await Marriage.findByPk(req.params.id);

    if (!marriage) {
      return res.status(404).json({
        status: 'failed',
        message: 'Marriage certificate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { marriage },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.createCert = async (req, res) => {
  try {
    // Map snake_case form fields to camelCase model fields
    const marriageData = {
      groomGivenName: req.body.groom_given_name,
      groomSurname: req.body.groom_surname,
      groomProfession: req.body.groom_profession,
      groomNationality: req.body.groom_nationality || 'Cameroon',
      groomBornOn: req.body.groom_born_on,
      groomPlaceBirth: req.body.groom_place_birth,
      groomResidentAt: req.body.groom_resident_at,
      groomIdNum: req.body.groom_id_num,
      groomFatherName: req.body.groom_father_name,
      groomMotherName: req.body.groom_mother_name,
      groomFamilyHead: req.body.groom_family_head,
      groomWitnessName: req.body.groom_witness_name,
      brideGivenName: req.body.bride_given_name,
      brideSurname: req.body.bride_surname,
      brideProfession: req.body.bride_profession,
      brideNationality: req.body.bride_nationality || 'Cameroon',
      brideBornOn: req.body.bride_born_on,
      bridePlaceBirth: req.body.bride_place_birth,
      brideResidentAt: req.body.bride_resident_at,
      brideIdNum: req.body.bride_id_num,
      brideFatherName: req.body.bride_father_name,
      brideMotherName: req.body.bride_mother_name,
      brideFamilyHead: req.body.bride_family_head,
      brideWitnessName: req.body.bride_witness_name,
      matrimonialRegime: req.body.matrimonial_regime,
      marriageType: req.body.marriage_type,
      objections: req.body.objections || 'No',
    };

    const marriage = await Marriage.create(marriageData);

    res.status(201).json({
      status: 'success',
      data: { marriage },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateCert = async (req, res) => {
  try {
    const marriage = await Marriage.findByPk(req.params.id);

    if (!marriage) {
      return res.status(404).json({
        status: 'failed',
        message: 'Marriage certificate not found',
      });
    }

    await marriage.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { marriage },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteCert = async (req, res) => {
  try {
    const marriage = await Marriage.findByPk(req.params.id);

    if (!marriage) {
      return res.status(404).json({
        status: 'failed',
        message: 'Marriage certificate not found',
      });
    }

    await marriage.destroy();

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
    const totalMarriages = await Marriage.count();
    const monogamyCount = await Marriage.count({ where: { marriageType: 'Monogamy' } });
    const polygamyCount = await Marriage.count({ where: { marriageType: 'Polygamy' } });

    const currentYear = new Date().getFullYear();
    const thisYearMarriages = await Marriage.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(`${currentYear}-01-01`),
        },
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: totalMarriages,
        monogamy: monogamyCount,
        polygamy: polygamyCount,
        thisYear: thisYearMarriages,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
