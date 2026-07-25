const BuilderLibrary = {
  STORAGE_KEY: 'mikrotik-assistant-library',

  getAll() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  save(template) {
    const library = this.getAll();
    // Update if exists, else push
    const index = library.findIndex(t => t.id === template.id);
    if (index !== -1) {
      library[index] = { ...library[index], ...template, updatedAt: new Date().toISOString() };
    } else {
      library.push({ ...template, id: Date.now().toString(), createdAt: new Date().toISOString() });
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(library));
  },

  delete(id) {
    const library = this.getAll().filter(t => t.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(library));
  },

  // Predefined Presets
  getPresets() {
    return [
      {
        id: 'preset-eolo',
        name: 'EOLO / WISP Setup',
        description: 'Standard setup for EOLO with PPPoE, BGP, and public bridge.',
        variables: {
          'WAN_INTERFACE': 'ether1',
          'LAN_BRIDGE': 'bridge-LAN',
          'PPPOE_USERNAME': 'eolo_user',
          'PPPOE_PASSWORD': 'eolo_pass',
          'ASN': '12345',
          'BGP_PEER_IP': '172.16.0.1'
        },
        enabledBlocks: ['bridge-lan', 'firewall-base', 'nat', 'pppoe-client', 'bgp-ros7']
      },
      {
        id: 'preset-fibra',
        name: 'Fiber / DHCP WAN',
        description: 'Standard fiber connection using DHCP client on WAN.',
        variables: {
          'WAN_INTERFACE': 'ether1',
          'LAN_BRIDGE': 'bridge-LAN',
          'LAN_NETWORK': '192.168.88.0/24',
          'LAN_GATEWAY': '192.168.88.1'
        },
        enabledBlocks: ['bridge-lan', 'firewall-base', 'nat', 'dhcp-server', 'dns']
      },
      {
        id: 'preset-basic',
        name: 'Basic Home Router',
        description: 'Simple home router with DHCP and basic firewall.',
        variables: {
          'LAN_BRIDGE': 'bridge',
          'LAN_NETWORK': '192.168.1.0/24',
          'LAN_GATEWAY': '192.168.1.1'
        },
        enabledBlocks: ['bridge-lan', 'firewall-base', 'dhcp-server', 'dns']
      }
    ];
  }
};
