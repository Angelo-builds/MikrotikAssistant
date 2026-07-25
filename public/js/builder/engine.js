const BuilderEngine = {
  // Default variables
  defaultVariables: {
    PUBLIC_NETWORK: '212.124.179.56/29',
    LAN_NETWORK: '192.168.88.0/24',
    HOSTNAME: 'MikroTik-Router',
    WAN_INTERFACE: 'ether1',
    LAN_BRIDGE: 'bridge-lan'
  },

  state: {
    variables: {},
    derivedVariables: {},
    blocks: []
  },

  init() {
    this.state.variables = { ...this.defaultVariables };
    this.computeAllDerived();
    this.loadDefaultBlocks();
  },

  // --- IP Math Helpers ---
  ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0;
  },

  intToIp(int) {
    return [
      (int >>> 24) & 255,
      (int >>> 16) & 255,
      (int >>> 8) & 255,
      int & 255
    ].join('.');
  },

  prefixToMask(prefix) {
    const mask = (0xFFFFFFFF << (32 - parseInt(prefix))) & 0xFFFFFFFF;
    return this.intToIp(mask);
  },

  maskToWildcard(mask) {
    const maskInt = this.ipToInt(mask);
    return this.intToIp(~maskInt & 0xFFFFFFFF);
  },

  calculateNetwork(ip, prefix) {
    const ipInt = this.ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - parseInt(prefix))) & 0xFFFFFFFF;
    return this.intToIp(ipInt & mask);
  },

  calculateBroadcast(ip, prefix) {
    const ipInt = this.ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - parseInt(prefix))) & 0xFFFFFFFF;
    const broadcastInt = (ipInt & mask) | (~mask & 0xFFFFFFFF);
    return this.intToIp(broadcastInt);
  },

  incrementIP(ip, n) {
    const int = this.ipToInt(ip) + n;
    return this.intToIp(int);
  },

  // --- Core Logic ---
  computeAllDerived() {
    this.state.derivedVariables = {};
    for (const [name, value] of Object.entries(this.state.variables)) {
      if (name.includes('NETWORK') && value.includes('/')) {
        const [ip, prefix] = value.split('/');
        const network = this.calculateNetwork(ip, prefix);
        const gateway = this.incrementIP(network, 1);
        const firstHost = this.incrementIP(network, 1); // Usually same as gateway in MikroTik context, or network+2
        const lastHost = this.incrementIP(this.calculateBroadcast(ip, prefix), -1);
        const broadcast = this.calculateBroadcast(ip, prefix);
        const subnetMask = this.prefixToMask(prefix);
        const wildcard = this.maskToWildcard(subnetMask);

        const baseName = name.replace('NETWORK', '');
        this.state.derivedVariables[`${baseName}GATEWAY`] = gateway;
        this.state.derivedVariables[`${baseName}FIRST_HOST`] = firstHost;
        this.state.derivedVariables[`${baseName}LAST_HOST`] = lastHost;
        this.state.derivedVariables[`${baseName}BROADCAST`] = broadcast;
        this.state.derivedVariables[`${baseName}SUBNET_MASK`] = subnetMask;
        this.state.derivedVariables[`${baseName}WILDCARD`] = wildcard;
      }
    }
  },

  setVariable(name, value) {
    this.state.variables[name] = value;
    this.computeAllDerived();
  },

  getAllVariables() {
    return { ...this.state.variables, ...this.state.derivedVariables };
  },

  renderTemplate(template) {
    const allVars = this.getAllVariables();
    return template.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return allVars[varName] !== undefined ? allVars[varName] : match;
    });
  },

  renderFullConfig() {
    return this.state.blocks
      .filter(block => block.enabled)
      .map(block => `# --- ${block.name} ---\n${this.renderTemplate(block.content)}`)
      .join('\n\n');
  },

  loadDefaultBlocks() {
    this.state.blocks = [
      {
        id: 'system',
        name: 'System Identity',
        enabled: true,
        content: '/system identity\nset name="{{HOSTNAME}}"'
      },
      {
        id: 'interfaces',
        name: 'Interfaces & Bridge',
        enabled: true,
        content: '/interface bridge\nadd name="{{LAN_BRIDGE}}" comment="LAN Bridge"\n\n/interface ethernet\nset [ find default-name={{WAN_INTERFACE}} ] comment="WAN"'
      },
      {
        id: 'ip-addresses',
        name: 'IP Addresses',
        enabled: true,
        content: '/ip address\nadd address={{PUBLIC_NETWORK}} interface={{WAN_INTERFACE}} comment="WAN"\nadd address={{LAN_GATEWAY}}/24 interface={{LAN_BRIDGE}} comment="LAN Gateway"'
      },
      {
        id: 'dhcp',
        name: 'DHCP Server',
        enabled: true,
        content: '/ip pool\nadd name=dhcp_pool ranges={{LAN_FIRST_HOST}}-{{LAN_LAST_HOST}}\n\n/ip dhcp-server\nadd address-pool=dhcp_pool interface={{LAN_BRIDGE}} name=dhcp_lan\n\n/ip dhcp-server network\nadd address={{LAN_NETWORK}} gateway={{LAN_GATEWAY}} dns-server=8.8.8.8,1.1.1.1'
      },
      {
        id: 'nat',
        name: 'NAT Masquerade',
        enabled: true,
        content: '/ip firewall nat\nadd action=masquerade chain=srcnat out-interface={{WAN_INTERFACE}} comment="Masquerade WAN"'
      },
      {
        id: 'firewall',
        name: 'Basic Firewall',
        enabled: true,
        content: '/ip firewall filter\nadd action=accept chain=input comment="Accept Established" connection-state=established,related\nadd action=drop chain=input comment="Drop Invalid" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment="Drop WAN Input" in-interface={{WAN_INTERFACE}}'
      }
    ];
  }
};

BuilderEngine.init();
