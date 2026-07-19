const logger = require('../utils/logger');

/**
 * Centralized production-ready error handler.
 * Provides consistent JSON schemas for error responses and keeps system-level stack traces secure.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'An unexpected error occurred during processing';

  // Log detailed error internally
  logger.error(`Error processing path ${req.path} [Status: ${status}]:`, err);

  const responseBody = {
    error: err.name || 'Internal Server Error',
    message: message
  };

  // Stack trace only exposed in local / development environment
  if (process.env.NODE_ENV !== 'production') {
    responseBody.stack = err.stack;
  }

  res.status(status).json(responseBody);
}

module.exports = errorHandler;
