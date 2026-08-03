const DefaultBlocks = [
  {
    id: 'bridge-lan',
    name: 'Bridge & LAN Setup',
    category: 'network',
    enabled: true,
    content: `/interface bridge\nadd name="{{LAN_BRIDGE}}" comment="LAN Bridge" vlan-filtering=no`
  },
  {
    id: 'firewall-base',
    name: 'Base Firewall Rules',
    category: 'security',
    enabled: true,
    content: `/ip firewall filter\nadd action=accept chain=input comment="defconf: accept established,related" connection-state=established,related\nadd action=drop chain=input comment="defconf: drop invalid" connection-state=invalid\nadd action=accept chain=input protocol=icmp comment="defconf: accept ICMP"\nadd action=drop chain=input comment="defconf: drop all not coming from LAN" in-interface-list=!LAN`
  },
  {
    id: 'nat',
    name: 'NAT Masquerade',
    category: 'wan',
    enabled: true,
    content: `/ip firewall nat\nadd action=masquerade chain=srcnat out-interface={{WAN_INTERFACE}} comment="masquerade WAN"`
  },
  {
    id: 'dhcp',
    name: 'DHCP Server Pool',
    category: 'services',
    enabled: true,
    content: `/ip pool\nadd name=dhcp_pool ranges={{LAN_FIRST_HOST}}-{{LAN_LAST_HOST}}\n/ip dhcp-server\nadd address-pool=dhcp_pool interface={{LAN_BRIDGE}} name=dhcp_lan disabled=no\n/ip dhcp-server network\nadd address={{LAN_NETWORK}} gateway={{LAN_GATEWAY}} dns-server=8.8.8.8,1.1.1.1`
  },
  {
    id: 'system-identity',
    name: 'System Identity',
    category: 'services',
    enabled: true,
    content: `/system identity\nset name="{{HOSTNAME}}"`
  },
  {
    id: 'queues',
    name: 'Queue Simple Bandwidth Limit',
    category: 'qos',
    enabled: true,
    content: `/queue simple\nadd name="Limit-LAN" target="{{LAN_NETWORK}}" max-limit="10M/10M" priority=8/8`
  }
];
