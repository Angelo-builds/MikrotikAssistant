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

  // Getters/setters for dual compatibility
  get variables() {
    return this.state.variables;
  },
  set variables(val) {
    this.state.variables = val;
  },
  get derivedVariables() {
    return this.state.derivedVariables;
  },
  set derivedVariables(val) {
    this.state.derivedVariables = val;
  },
  get blocks() {
    return this.state.blocks;
  },
  set blocks(val) {
    this.state.blocks = val;
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

  save() {
    if (typeof AppState !== 'undefined' && AppState.save) {
      AppState.save();
    }
  },

  removeVariable(name) {
    if (!this.variables[name]) return;

    // Determine base name for derived variables
    let baseName = name;
    if (name.endsWith('NETWORK')) {
      baseName = name.replace('NETWORK', '');
    } else if (name.endsWith('IP')) {
      baseName = name.replace('IP', '');
    }

    delete this.variables[name];

    // Remove all derived variables that start with this base
    Object.keys(this.derivedVariables).forEach(key => {
      if (baseName && key.startsWith(baseName)) {
        delete this.derivedVariables[key];
      }
    });

    this.save();
  },

  // Evaluate a condition string against current variables
  evaluateCondition(condition) {
    if (!condition || typeof condition !== 'string') return true;

    // Support formats: "RouterOS == 7", "PPPoE == true", "BGP != false"
    const operators = ['==', '!=', '>=', '<=', '>', '<'];
    let operator = null;
    let left = null;
    let right = null;

    for (const op of operators) {
      if (condition.includes(op)) {
        const parts = condition.split(op).map(s => s.trim());
        if (parts.length === 2) {
          operator = op;
          left = parts[0];
          right = parts[1];
          break;
        }
      }
    }

    if (!operator) return true;

    // Resolve left side (could be a variable name or literal)
    const leftValue = this.resolveValue(left);
    const rightValue = this.resolveValue(right);

    // Compare
    switch (operator) {
      case '==': return String(leftValue) === String(rightValue);
      case '!=': return String(leftValue) !== String(rightValue);
      case '>': return Number(leftValue) > Number(rightValue);
      case '<': return Number(leftValue) < Number(rightValue);
      case '>=': return Number(leftValue) >= Number(rightValue);
      case '<=': return Number(leftValue) <= Number(rightValue);
      default: return true;
    }
  },

  // Resolve a value: if it matches a variable name, return that; otherwise return as-is
  resolveValue(val) {
    const allVars = this.getAllVariables();
    if (allVars[val] !== undefined) return allVars[val];
    // Handle boolean literals
    if (val.toLowerCase() === 'true') return 'true';
    if (val.toLowerCase() === 'false') return 'false';
    return val;
  },

  // Render a single block, respecting conditionals
  renderBlockContent(block) {
    const allVars = this.getAllVariables();
    let content = block.content;

    // Handle IF/ENDIF blocks within the content
    const ifRegex = /# IF (.+)\n([\s\S]*?)# ENDIF/g;
    content = content.replace(ifRegex, (match, condition, innerContent) => {
      if (this.evaluateCondition(condition)) {
        return innerContent;
      }
      return '';
    });

    // Replace {{VARIABLE}} placeholders
    content = content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return allVars[varName] !== undefined ? allVars[varName] : match;
    });

    return content;
  },

  // Check if a block-level conditional is satisfied
  isBlockEnabled(block) {
    if (!block.isConditional || !block.condition) return true;
    return this.evaluateCondition(block.condition);
  },

  renderTemplate(template) {
    const allVars = this.getAllVariables();
    let result = template;

    // Handle inline IF/ENDIF
    const ifRegex = /# IF (.+)\n([\s\S]*?)# ENDIF/g;
    result = result.replace(ifRegex, (match, condition, innerContent) => {
      if (this.evaluateCondition(condition)) {
        return innerContent;
      }
      return '';
    });

    // Replace variables
    result = result.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return allVars[varName] !== undefined ? allVars[varName] : match;
    });

    return result;
  },

  renderBlocks(blocks) {
    return blocks
      .filter(block => block.enabled)
      .filter(block => this.isBlockEnabled(block))
      .map(block => ({
        ...block,
        renderedContent: this.renderBlockContent(block)
      }));
  },

  generateRsc(blocks) {
    const rendered = this.renderBlocks(blocks);
    const header = `# Generated by MikrotikAssistant\n# ${new Date().toISOString()}\n\n`;
    const body = rendered.map(block => {
      const conditionalNote = block.isConditional ? `# Conditional: IF ${block.condition}\n` : '';
      return `${conditionalNote}# === ${block.name} ===\n${block.renderedContent}`;
    }).join('\n\n');
    return header + body;
  },

  renderFullConfig() {
    return this.generateRsc(this.state.blocks.filter(b => b.enabled));
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