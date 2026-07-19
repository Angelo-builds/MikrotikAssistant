const logger = require('../utils/logger');

/**
 * Lightweight, production-ready, secure in-memory rate limiter middleware.
 * Focuses on security and performance without adding heavy external dependencies.
 */
function createRateLimiter({ windowMs, maxRequests }) {
  const ipRequests = new Map();

  // Periodically clean up expired rate limit buckets to optimize memory usage (prevent leaks/OOM)
  // Calling .unref() ensures the interval does not keep the process alive in testing environments
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of ipRequests.entries()) {
      if (now - data.startTime > windowMs) {
        ipRequests.delete(ip);
      }
    }
  }, windowMs);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimiter(req, res, next) {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, {
        startTime: now,
        count: 1
      });
      return next();
    }

    const data = ipRequests.get(ip);

    if (now - data.startTime > windowMs) {
      // Window expired, reset bucket
      data.startTime = now;
      data.count = 1;
      return next();
    }

    data.count++;

    if (data.count > maxRequests) {
      logger.warn(`Rate limit exceeded for IP: ${ip} (${data.count} requests)`);
      return res.status(429).json({
        error: 'Too many requests',
        message: 'The wizard is currently recharging his mana. Please slow down and try again later!'
      });
    }

    next();
  };
}

module.exports = createRateLimiter;
