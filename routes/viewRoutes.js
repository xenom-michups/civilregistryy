const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.isLoggedIn);

// Public routes
router.get('/', viewController.home);
router.get('/login', viewController.login);
router.get('/client', viewController.client);
router.get('/lookup', viewController.client);
router.get('/request-certificate', viewController.requestCertificate);
router.get('/track-request', viewController.trackRequest);

// Protected routes (require login)
router.get('/dashboard', authController.protect, viewController.dashboard);
router.get('/client-dashboard', authController.protect, viewController.clientDashboard);
router.get('/admin', authController.protect, authController.restrictTo('admin'), viewController.admin);
router.get('/birth', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.birth);
router.get('/marriage', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.marriage);
router.get('/death', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.death);
router.get('/residency', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.residency);
router.get('/requests', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.requests);
router.get('/upload', authController.protect, authController.restrictTo('admin', 'registrar'), viewController.upload);

// Certificate generation
router.get('/generate-birth-certificate', viewController.generateBirth);
router.get('/generate-marriage-certificate', viewController.generateMarriage);
router.get('/generate-death-certificate', viewController.generateDeath);
router.get('/generate-residency-certificate', viewController.generateResidency);
router.get('/print-ready', viewController.generateBirthPrint);
router.get('/print-ready-marriage', viewController.generateMarriagePrint);
router.get('/print-ready-death', viewController.generateDeathPrint);
router.get('/print-ready-residency', viewController.generateResidencyPrint);

// PDF generation
router.get('/create-birth-pdf', viewController.puppetBirth);
router.get('/create-marriage-pdf', viewController.puppetMarriage);
router.get('/birth-pdf', viewController.sendBirthPdf);
router.get('/marriage-pdf', viewController.sendMarriagePdf);

router.get('/test', viewController.test);

module.exports = router;
