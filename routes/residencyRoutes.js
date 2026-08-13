const express = require('express');
const residencyController = require('../controllers/residencyController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(residencyController.getAllResidencies)
  .post(residencyController.createResidency);

router
  .route('/:id')
  .get(residencyController.getResidency)
  .patch(residencyController.updateResidency)
  .delete(residencyController.deleteResidency);

module.exports = router;
