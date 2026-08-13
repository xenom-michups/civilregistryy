const express = require('express');
const birthController = require('../controllers/birthController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/birth/stats', birthController.getStats);

router
  .route('/birth')
  .get(birthController.getAllBirthCert)
  .post(birthController.createBirthCert);

router
  .route('/birth/:id')
  .get(birthController.getBirthCert)
  .patch(birthController.updateBirthCert)
  .delete(authController.restrictTo('admin'), birthController.deleteBirthCert);

module.exports = router;
