const MikroTikParser = {
  // Parse a RouterOS export into structured blocks
  parseExport(exportText) {
    const blocks = [];
    const variables = {};

    // Split by section headers (lines starting with /)
    const sections = exportText.split(/(?=^\/)/m).filter(s => s.trim());

    sections.forEach(section => {
      const lines = section.trim().split('\n');
      const header = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();

      // Extract section type
      const sectionType = this.extractSectionType(header);

      // Extract variables from the section
      const extractedVars = this.extractVariables(section);
      Object.assign(variables, extractedVars);

      blocks.push({
        id: `parsed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: this.getSectionName(sectionType),
        category: this.getSectionCategory(sectionType),
        enabled: true,
        content: section.trim()
      });
    });

    return { blocks, variables };
  },

  extractSectionType(header) {
    const match = header.match(/^\/(\w+(?:\s+\w+)*)/);
    return match ? match[1] : 'unknown';
  },

  getSectionName(sectionType) {
    const names = {
      'interface bridge': 'Bridge',
      'interface bridge port': 'Bridge Ports',
      'interface bridge vlan': 'Bridge VLAN',
      'interface vlan': 'VLAN Interfaces',
      'interface ethernet': 'Ethernet Interfaces',
      'interface pppoe-client': 'PPPoE Client',
      'interface list': 'Interface Lists',
      'interface list member': 'List Members',
      'ip address': 'IP Addresses',
      'ip dns': 'DNS',
      'ip dns static': 'DNS Static',
      'ip dhcp-server': 'DHCP Server',
      'ip dhcp-server network': 'DHCP Networks',
      'ip dhcp-server pool': 'DHCP Pools',
      'ip pool': 'IP Pools',
      'ip firewall filter': 'Firewall Filter',
      'ip firewall nat': 'Firewall NAT',
      'ip firewall address-list': 'Address Lists',
      'ip route': 'Routes',
      'ip neighbor discovery-settings': 'Neighbor Discovery',
      'ipv6 settings': 'IPv6 Settings',
      'system identity': 'System Identity',
      'system clock': 'System Clock',
      'system ntp client': 'NTP Client',
      'queue simple': 'Simple Queues',
      'routing bgp connection': 'BGP Connections',
      'tool mac-server': 'MAC Server'
    };
    return names[sectionType] || sectionType;
  },

  getSectionCategory(sectionType) {
    if (sectionType.includes('firewall') || sectionType.includes('nat')) return 'security';
    if (sectionType.includes('bridge') || sectionType.includes('vlan') || sectionType.includes('interface')) return 'network';
    if (sectionType.includes('dhcp') || sectionType.includes('dns') || sectionType.includes('ntp')) return 'services';
    if (sectionType.includes('route') || sectionType.includes('bgp')) return 'routing';
    if (sectionType.includes('queue')) return 'qos';
    return 'other';
  },

  extractVariables(section) {
    const vars = {};

    // Extract IP addresses with subnets
    const ipPattern = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2})/g;
    let match;
    while ((match = ipPattern.exec(section)) !== null) {
      const ip = match[1];
      if (!Object.values(vars).includes(ip)) {
        const varName = `IP_${Object.keys(vars).length + 1}`;
        vars[varName] = ip;
      }
    }

    // Extract PPPoE credentials
    const pppoeUser = section.match(/user=([^\s]+)/);
    if (pppoeUser) vars['PPPOE_USERNAME'] = pppoeUser[1];

    const pppoePass = section.match(/password=([^\s]+)/);
    if (pppoePass) vars['PPPOE_PASSWORD'] = pppoePass[1];

    // Extract system identity
    const identity = section.match(/set name=([^\s]+)/);
    if (identity) vars['HOSTNAME'] = identity[1];

    // Extract BGP ASN
    const asn = section.match(/asn=(\d+)/);
    if (asn) vars['ASN'] = asn[1];

    return vars;
  },

  // Compare two configurations
  compareConfigs(config1, config2) {
    const lines1 = config1.split('\n');
    const lines2 = config2.split('\n');

    const differences = {
      added: [],
      removed: [],
      modified: []
    };

    // Find added lines
    lines2.forEach(line => {
      if (!lines1.includes(line) && line.trim()) {
        differences.added.push(line);
      }
    });

    // Find removed lines
    lines1.forEach(line => {
      if (!lines2.includes(line) && line.trim()) {
        differences.removed.push(line);
      }
    });

    return differences;
  }
};

module.exports = MikroTikParser;