const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/register-client', authController.registerClient);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// Protected routes
router.use(authController.protect);

router.get('/me', (req, res) => {
  res.status(200).json({ status: 'success', data: { user: req.user } });
});
router.patch('/updateMe', userController.updateMe);

// Admin only routes
router.use(authController.restrictTo('admin'));

router.post('/signup', authController.signup);
router.post('/create-staff', authController.signup);
router.get('/', userController.getAllUsers);
router.route('/:id').get(userController.getUser).delete(userController.deleteUser);

module.exports = router;
