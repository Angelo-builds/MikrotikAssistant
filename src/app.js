const express = require('express');
const cors = require('cors');
const path = require('path');
const securityHeaders = require('./middleware/security');
const createRateLimiter = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');

const app = express();

// 1. Production-ready Security headers
app.use(securityHeaders);

// 2. Enable CORS with configurable origin verification
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [];
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Rate limiting protection - prevent DDoS / Abuse
const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // limit each IP to 100 requests per window
});
app.use('/api', apiLimiter);

// 4. Request JSON Parsing with size control (prevent large payload attacks)
app.use(express.json({ limit: '10mb' }));

// 5. Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// 6. API Route Handlers
app.use('/api', apiRoutes);

// 7. Route Fallbacks
app.use((req, res, next) => {
  const err = new Error(`Resource not found: ${req.method} ${req.path}`);
  err.status = 404;
  err.name = 'Not Found';
  next(err);
});

// 8. Centralized error tracking and response formatter
app.use(errorHandler);

module.exports = app;
