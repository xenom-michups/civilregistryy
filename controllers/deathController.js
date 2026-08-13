const { Death } = require('../models');

exports.createDeath = async (req, res) => {
  try {
    console.log('Received body:', req.body);
    
    const year = new Date().getFullYear();
    const count = await Death.count();
    const certificateNumber = `DC-${year}-${String(count + 1).padStart(6, '0')}`;

    // Map snake_case form fields to camelCase model fields
    const deathData = {
      certificateNumber,
      drawnUpOn: new Date(),
      deceasedSurname: req.body.deceased_surname,
      deceasedGivenname: req.body.deceased_givenname,
      deceasedSex: req.body.deceased_sex,
      deceasedBornOn: req.body.deceased_born_on,
      deceasedBornAt: req.body.deceased_born_at,
      deceasedNationality: req.body.deceased_nationality || 'Cameroon',
      deceasedOccupation: req.body.deceased_occupation,
      deceasedResidence: req.body.deceased_residence,
      deceasedIdNum: req.body.deceased_id_num,
      deathDate: req.body.death_date,
      deathTime: req.body.death_time || null,
      deathPlace: req.body.death_place,
      causeOfDeath: req.body.cause_of_death,
      fatherName: req.body.father_name,
      motherName: req.body.mother_name,
      spouseName: req.body.spouse_name,
      declarantName: req.body.declarant_name,
      declarantRelationship: req.body.declarant_relationship,
      declarantIdNum: req.body.declarant_id_num,
      declarantAddress: req.body.declarant_address,
    };

    const death = await Death.create(deathData);

    res.status(201).json({
      status: 'success',
      data: { death },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.getAllDeaths = async (req, res) => {
  try {
    const deaths = await Death.findAll({
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
};

exports.getDeath = async (req, res) => {
  try {
    const death = await Death.findByPk(req.params.id);

    if (!death) {
      return res.status(404).json({
        status: 'failed',
        message: 'Death certificate not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { death },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.updateDeath = async (req, res) => {
  try {
    const death = await Death.findByPk(req.params.id);

    if (!death) {
      return res.status(404).json({
        status: 'failed',
        message: 'Death certificate not found',
      });
    }

    await death.update(req.body);

    res.status(200).json({
      status: 'success',
      data: { death },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.deleteDeath = async (req, res) => {
  try {
    const death = await Death.findByPk(req.params.id);

    if (!death) {
      return res.status(404).json({
        status: 'failed',
        message: 'Death certificate not found',
      });
    }

    await death.destroy();

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
