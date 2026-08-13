const express = require('express');
const deathController = require('../controllers/deathController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(deathController.getAllDeaths)
  .post(deathController.createDeath);

router
  .route('/:id')
  .get(deathController.getDeath)
  .patch(deathController.updateDeath)
  .delete(deathController.deleteDeath);

module.exports = router;
