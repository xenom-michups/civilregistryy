const express = require('express');
const marriageController = require('../controllers/marriageController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get('/marriage/stats', marriageController.getStats);

router
  .route('/marriage')
  .get(marriageController.getAllCert)
  .post(marriageController.createCert);

router
  .route('/marriage/:id')
  .get(marriageController.getCert)
  .patch(marriageController.updateCert)
  .delete(authController.restrictTo('admin'), marriageController.deleteCert);

module.exports = router;
