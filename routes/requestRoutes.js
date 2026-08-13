const express = require('express');
const requestController = require('../controllers/requestController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes for clients
router.post('/submit', requestController.createRequest);
router.get('/track', requestController.trackRequest);

// Protected routes for staff
router.use(authController.protect);

router.get('/stats', requestController.getRequestStats);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequest);
router.patch('/:id/status', requestController.updateRequestStatus);
router.delete('/:id', requestController.deleteRequest);

module.exports = router;
