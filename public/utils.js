// Forwarding file to support node.js require() inside test.js while maintaining dual compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = require('./utils.js.bak');
}
