const app = require('./src/app');
const { PORT } = require('./src/config');
const logger = require('./src/utils/logger');

// Catch uncaught exceptions securely to prevent abrupt process termination without logging
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception detected in the magic loop!', err);
  // Give the server/logs 1 second to flush cleanly before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Securely handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Promise Rejection detected!', reason);
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Mik the Winbox Wizard is running at http://localhost:${PORT}`);
});

module.exports = server;
