const { promisify } = require('util');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: 'lax',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

// Admin only - can create staff (admin/registrar)
exports.signup = async (req, res) => {
  try {
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role || 'registrar',
      photo: req.body.photo,
    };

    if (req.body.phone) userData.phone = req.body.phone;
    if (req.body.address) userData.address = req.body.address;
    if (req.body.idNumber) userData.idNumber = req.body.idNumber;

    const newUser = await User.create(userData);

    res.status(201).json({
      status: 'success',
      data: { user: newUser },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

// Public - client registration only
exports.registerClient = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: 'client',
      phone: req.body.phone || null,
      address: req.body.address || null,
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'failed',
        message: 'Please provide email and password',
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({
        status: 'failed',
        message: 'Incorrect email or password',
      });
    }

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      // For view routes, redirect to login
      if (req.accepts('html')) {
        return res.redirect('/login');
      }
      return res.status(401).json({
        status: 'failed',
        message: 'You are not logged in. Please log in to get access.',
      });
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findByPk(decoded.id);
    if (!currentUser) {
      if (req.accepts('html')) {
        return res.redirect('/login');
      }
      return res.status(401).json({
        status: 'failed',
        message: 'The user belonging to this token no longer exists.',
      });
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      if (req.accepts('html')) {
        return res.redirect('/login');
      }
      return res.status(401).json({
        status: 'failed',
        message: 'User recently changed password. Please log in again.',
      });
    }

    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (err) {
    if (req.accepts('html')) {
      return res.redirect('/login');
    }
    res.status(401).json({
      status: 'failed',
      message: 'Invalid token. Please log in again.',
    });
  }
};

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      const currentUser = await User.findByPk(decoded.id);

      if (!currentUser) return next();
      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.accepts('html')) {
        return res.status(403).render('error', { message: 'You do not have permission to access this page' });
      }
      return res.status(403).json({
        status: 'failed',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(404).json({
        status: 'failed',
        message: 'There is no user with that email address.',
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await user.save();

      return res.status(500).json({
        status: 'failed',
        message: 'There was an error sending the email. Try again later!',
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
      },
    });

    if (!user || new Date(user.passwordResetExpires) < new Date()) {
      return res.status(400).json({
        status: 'failed',
        message: 'Token is invalid or has expired',
      });
    }

    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};
