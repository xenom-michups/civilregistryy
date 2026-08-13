const { Birth, Marriage, Death, ResidencyCertificate, CertificateRequest, User } = require('../models');
const puppeteer = require('puppeteer');
const path = require('path');

exports.home = (req, res) => {
  res.status(200).render('home', { title: 'Civil Registry System' });
};

exports.login = (req, res) => {
  res.status(200).render('login', { title: 'Login' });
};

exports.client = (req, res) => {
  res.status(200).render('client', { title: 'Certificate Lookup' });
};

exports.dashboard = async (req, res) => {
  try {
    const births = await Birth.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const marriages = await Marriage.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const deaths = await Death.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const residencies = await ResidencyCertificate.findAll({ order: [['createdAt', 'DESC']], limit: 10 });
    const requests = await CertificateRequest.findAll({ order: [['createdAt', 'DESC']], limit: 10 });

    const totalBirths = await Birth.count();
    const totalMarriages = await Marriage.count();
    const totalDeaths = await Death.count();
    const totalResidencies = await ResidencyCertificate.count();
    const totalRequests = await CertificateRequest.count();
    const pendingRequests = await CertificateRequest.count({ where: { status: 'pending' } });

    const total = totalBirths + totalMarriages + totalDeaths + totalResidencies;

    const birthPercentage = total > 0 ? ((totalBirths / total) * 100).toFixed(1) : 0;
    const marriagePercentage = total > 0 ? ((totalMarriages / total) * 100).toFixed(1) : 0;
    const deathPercentage = total > 0 ? ((totalDeaths / total) * 100).toFixed(1) : 0;
    const residencyPercentage = total > 0 ? ((totalResidencies / total) * 100).toFixed(1) : 0;

    res.status(200).render('dashboard', {
      title: 'Dashboard',
      birth: births,
      marriage: marriages,
      death: deaths,
      residency: residencies,
      requests,
      totalBirths,
      totalMarriages,
      totalDeaths,
      totalResidencies,
      totalRequests,
      pendingRequests,
      birthPercentage,
      marriagePercentage,
      deathPercentage,
      residencyPercentage,
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

exports.birth = (req, res) => {
  res.status(200).render('birth', { title: 'Register Birth' });
};

exports.marriage = (req, res) => {
  res.status(200).render('marriage', { title: 'Register Marriage' });
};

exports.death = (req, res) => {
  res.status(200).render('death', { title: 'Register Death' });
};

exports.residency = (req, res) => {
  res.status(200).render('residency', { title: 'Residency Certificate' });
};

exports.requests = async (req, res) => {
  try {
    const { status, type } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (type) whereClause.certificateType = type;

    const requests = await CertificateRequest.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: 50,
    });
    res.status(200).render('requests', { 
      title: 'Certificate Requests', 
      requests,
      selectedStatus: status || '',
      selectedType: type || '',
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

exports.requestCertificate = (req, res) => {
  res.status(200).render('request_certificate', { 
    title: 'Request Certificate',
    user: res.locals.user || null,
  });
};

exports.trackRequest = (req, res) => {
  res.status(200).render('track_request', { title: 'Track Request' });
};

exports.upload = (req, res) => {
  res.status(200).render('upload', { title: 'Upload CSV' });
};

exports.generateBirth = async (req, res) => {
  try {
    const birth = await Birth.findOne({ order: [['createdAt', 'DESC']] });

    if (!birth) {
      return res.status(404).render('error', { message: 'No birth certificate found' });
    }

    res.status(200).render('certificate_birth', {
      title: 'Birth Certificate',
      birth,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateBirthPrint = async (req, res) => {
  try {
    let birth;
    if (req.query.id) {
      birth = await Birth.findByPk(req.query.id);
    } else {
      birth = await Birth.findOne({ order: [['createdAt', 'DESC']] });
    }

    if (!birth) {
      return res.status(404).render('error', { message: 'No birth certificate found' });
    }

    res.status(200).render('print_ready', {
      title: 'Birth Certificate - Print',
      birth,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateMarriage = async (req, res) => {
  try {
    const marriage = await Marriage.findOne({ order: [['createdAt', 'DESC']] });

    if (!marriage) {
      return res.status(404).render('error', { message: 'No marriage certificate found' });
    }

    res.status(200).render('certificate_marriage', {
      title: 'Marriage Certificate',
      marriage,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateMarriagePrint = async (req, res) => {
  try {
    let marriage;
    if (req.query.id) {
      marriage = await Marriage.findByPk(req.query.id);
    } else {
      marriage = await Marriage.findOne({ order: [['createdAt', 'DESC']] });
    }

    if (!marriage) {
      return res.status(404).render('error', { message: 'No marriage certificate found' });
    }

    res.status(200).render('print_marriage', {
      title: 'Marriage Certificate - Print',
      marriage,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.puppetBirth = async (req, res) => {
  try {
    const url = `http://localhost:${process.env.PORT || 3000}/print-ready`;
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'birth-certificate.pdf', format: 'A3' });
    await browser.close();

    res.status(200).json({
      status: 'success',
      message: 'PDF generated successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.puppetMarriage = async (req, res) => {
  try {
    const url = `http://localhost:${process.env.PORT || 3000}/print-ready-marriage`;
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.pdf({ path: 'marriage-certificate.pdf', format: 'A2' });
    await browser.close();

    res.status(200).json({
      status: 'success',
      message: 'PDF generated successfully',
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.sendBirthPdf = (req, res) => {
  const options = { root: path.join(__dirname, '..') };
  const fileName = 'birth-certificate.pdf';

  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.status(404).json({ status: 'failed', message: 'PDF not found' });
    }
  });
};

exports.sendMarriagePdf = (req, res) => {
  const options = { root: path.join(__dirname, '..') };
  const fileName = 'marriage-certificate.pdf';

  res.sendFile(fileName, options, (err) => {
    if (err) {
      res.status(404).json({ status: 'failed', message: 'PDF not found' });
    }
  });
};

exports.test = async (req, res) => {
  try {
    const marriage = await Marriage.findOne({ order: [['createdAt', 'DESC']] });
    res.status(200).render('print_marriage', {
      title: 'Marriage Certificate',
      marriage,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateDeath = async (req, res) => {
  try {
    const death = await Death.findOne({ order: [['createdAt', 'DESC']] });

    if (!death) {
      return res.status(404).render('error', { message: 'No death certificate found' });
    }

    res.status(200).render('certificate_death', {
      title: 'Death Certificate',
      death,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateDeathPrint = async (req, res) => {
  try {
    let death;
    if (req.query.id) {
      death = await Death.findByPk(req.query.id);
    } else {
      death = await Death.findOne({ order: [['createdAt', 'DESC']] });
    }

    if (!death) {
      return res.status(404).render('error', { message: 'No death certificate found' });
    }

    res.status(200).render('print_death', {
      title: 'Death Certificate - Print',
      death,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateResidency = async (req, res) => {
  try {
    const residency = await ResidencyCertificate.findOne({ order: [['createdAt', 'DESC']] });

    if (!residency) {
      return res.status(404).render('error', { message: 'No residency certificate found' });
    }

    res.status(200).render('certificate_residency', {
      title: 'Residency Certificate',
      residency,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.generateResidencyPrint = async (req, res) => {
  try {
    let residency;
    if (req.query.id) {
      residency = await ResidencyCertificate.findByPk(req.query.id);
    } else {
      residency = await ResidencyCertificate.findOne({ order: [['createdAt', 'DESC']] });
    }

    if (!residency) {
      return res.status(404).render('error', { message: 'No residency certificate found' });
    }

    res.status(200).render('print_residency', {
      title: 'Residency Certificate - Print',
      residency,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message });
  }
};

exports.clientDashboard = async (req, res) => {
  try {
    const userId = res.locals.user ? res.locals.user.id : null;
    const userEmail = res.locals.user ? res.locals.user.email : null;

    let requests = [];
    let pendingCount = 0;
    let processingCount = 0;
    let completedCount = 0;
    let rejectedCount = 0;

    if (userEmail) {
      requests = await CertificateRequest.findAll({
        where: { requesterEmail: userEmail },
        order: [['createdAt', 'DESC']],
      });

      pendingCount = requests.filter((r) => r.status === 'pending').length;
      processingCount = requests.filter((r) => r.status === 'processing').length;
      completedCount = requests.filter((r) => r.status === 'completed' || r.status === 'approved').length;
      rejectedCount = requests.filter((r) => r.status === 'rejected').length;
    }

    res.status(200).render('client_dashboard', {
      title: 'Client Dashboard',
      requests,
      pendingCount,
      processingCount,
      completedCount,
      rejectedCount,
    });
  } catch (err) {
    res.status(500).render('error', { message: err.message });
  }
};

exports.admin = async (req, res) => {
  try {
    const totalBirths = await Birth.count();
    const totalDeaths = await Death.count();
    const totalMarriages = await Marriage.count();
    const totalResidencies = await ResidencyCertificate.count();
    const totalRequests = await CertificateRequest.count();
    const totalUsers = await User.count();

    res.status(200).render('admin', {
      title: 'Admin Dashboard',
      user: req.user,
      totalBirths,
      totalDeaths,
      totalMarriages,
      totalResidencies,
      totalRequests,
      totalUsers,
    });
  } catch (err) {
    console.error('Admin error:', err);
    res.status(500).render('error', { message: err.message });
  }
};
