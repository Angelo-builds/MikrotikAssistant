const ConfigValidator = {
  validate(variables, blocks) {
    const errors = [];
    const warnings = [];

    // Check for empty variables
    Object.entries(variables).forEach(([name, value]) => {
      if (!value || value.trim() === '') {
        errors.push(`Variable {{${name}}} is empty`);
      }
    });

    // Check for duplicate IP addresses
    const ips = Object.values(variables).filter(v => this.isValidIP(v));
    const uniqueIps = new Set(ips);
    if (ips.length !== uniqueIps.size) {
      errors.push('Duplicate IP addresses detected');
    }

    // Check for overlapping subnets
    const networks = Object.values(variables).filter(v => v.includes('/'));
    for (let i = 0; i < networks.length; i++) {
      for (let j = i + 1; j < networks.length; j++) {
        if (this.networksOverlap(networks[i], networks[j])) {
          errors.push(`Overlapping networks: ${networks[i]} and ${networks[j]}`);
        }
      }
    }

    // Check for missing gateway
    const hasGateway = Object.keys(variables).some(k => k.includes('GATEWAY'));
    const hasNetwork = Object.keys(variables).some(k => k.includes('NETWORK'));
    if (hasNetwork && !hasGateway) {
      warnings.push('Network defined but no gateway variable found');
    }

    // Check block dependencies
    const enabledBlocks = blocks.filter(b => b.enabled);
    const blockIds = enabledBlocks.map(b => b.id);

    if (blockIds.includes('dhcp-server') && !blockIds.includes('bridge-lan')) {
      warnings.push('DHCP Server enabled but no Bridge LAN block');
    }

    if (blockIds.includes('pppoe-client') && !blockIds.includes('firewall-base')) {
      warnings.push('PPPoE Client enabled but no Firewall block - security risk!');
    }

    return { errors, warnings, isValid: errors.length === 0 };
  },

  isValidIP(ip) {
    return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip);
  },

  networksOverlap(network1, network2) {
    try {
      const [ip1, prefix1] = network1.split('/');
      const [ip2, prefix2] = network2.split('/');

      const int1 = this.ipToInt(ip1);
      const int2 = this.ipToInt(ip2);

      const mask1 = (0xFFFFFFFF << (32 - parseInt(prefix1))) & 0xFFFFFFFF;
      const mask2 = (0xFFFFFFFF << (32 - parseInt(prefix2))) & 0xFFFFFFFF;

      const net1 = int1 & mask1;
      const net2 = int2 & mask2;

      // Check if one network contains the other
      const largerPrefix = Math.min(parseInt(prefix1), parseInt(prefix2));
      const largerMask = (0xFFFFFFFF << (32 - largerPrefix)) & 0xFFFFFFFF;

      return (net1 & largerMask) === (net2 & largerMask);
    } catch (e) {
      return false;
    }
  },

  ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet)) >>> 0, 0);
  }
};

module.exports = ConfigValidator;