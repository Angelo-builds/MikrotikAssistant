/**
 * Backward compatibility wrapper for Privacy Shield.
 * Delegates functions to the modularized service in src/services/privacyService.js.
 */

const {
  mask,
  unmask,
  detectCustomInterfaces,
  isPrivateIPv4,
  isPrivateIPv6
} = require('./src/services/privacyService');

module.exports = {
  mask,
  unmask,
  detectCustomInterfaces,
  isPrivateIPv4,
  isPrivateIPv6
};
