const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');

// Load environment variables
dotenv.config({ path: './config.env' });

// Database
const db = require('./models');

// Routers
const viewRouter = require('./routes/viewRoutes');
const usersRouter = require('./routes/usersRoutes');
const marriageRouter = require('./routes/marriageRoutes');
const birthRouter = require('./routes/birthRoutes');
const deathRouter = require('./routes/deathRoutes');
const residencyRouter = require('./routes/residencyRoutes');
const requestRouter = require('./routes/requestRoutes');
const publicRouter = require('./routes/publicRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

// Global middleware

// Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/', limiter);

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['born_on', 'surname', 'givenname'],
  })
);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', viewRouter);
app.use('/api/users', usersRouter);
app.use('/api/certificates', marriageRouter, birthRouter);
app.use('/api/deaths', deathRouter);
app.use('/api/residency', residencyRouter);
app.use('/api/requests', requestRouter);
app.use('/api/public', publicRouter);
app.use('/api/admin', adminRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Database connection and sync
if (
  process.env.DB_HOST &&
  process.env.DB_NAME &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD !== undefined
) {
  db.sequelize
    .authenticate()
    .then(() => {
      console.log('✅ Database connected successfully');
    })
    .catch((err) => {
      console.error('❌ Unable to connect to the database:', err.message || err);
    });
} else {
  console.warn('⚠️ Database config is not set. Skipping DB connection for this serverless environment.');
}

module.exports = app;
