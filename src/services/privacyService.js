// List of built-in interface names that do not need masking to preserve network context for LLM
const BUILTIN_INTERFACES = new Set([
  'ether1', 'ether2', 'ether3', 'ether4', 'ether5', 'ether6', 'ether7', 'ether8', 'ether9', 'ether10',
  'ether11', 'ether12', 'ether13', 'ether14', 'ether15', 'ether16', 'ether17', 'ether18', 'ether19', 'ether20',
  'ether21', 'ether22', 'ether23', 'ether24',
  'sfp1', 'sfp2', 'sfpplus1', 'sfpplus2', 'combo1', 'combo2', 'wlan1', 'wlan2',
  'bridge', 'all', 'none', 'default'
]);

/**
 * Checks if an IPv4 address is in a private subnet.
 */
function isPrivateIPv4(ip) {
  if (typeof ip !== 'string') return false;
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;

  // 10.0.0.0/8
  if (parts[0] === 10) return true;
  // 172.16.0.0/12
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  // 192.168.0.0/16
  if (parts[0] === 192 && parts[1] === 168) return true;
  // 127.0.0.0/8
  if (parts[0] === 127) return true;
  // 169.254.0.0/16
  if (parts[0] === 169 && parts[1] === 254) return true;

  return false;
}

/**
 * Checks if an IPv6 address is local/private.
 */
function isPrivateIPv6(ip) {
  if (typeof ip !== 'string') return false;
  const cleanIp = ip.toLowerCase();
  if (
    cleanIp.startsWith('fc') ||
    cleanIp.startsWith('fd') ||
    cleanIp.startsWith('fe8') ||
    cleanIp.startsWith('fe9') ||
    cleanIp.startsWith('fea') ||
    cleanIp.startsWith('feb') ||
    cleanIp === '::1' ||
    cleanIp.startsWith('fe80')
  ) {
    return true;
  }
  return false;
}

/**
 * Detects custom interfaces defined or used in a RouterOS config.
 */
function detectCustomInterfaces(text) {
  if (typeof text !== 'string') return [];
  const customIfaces = new Set();

  // Split the config into lines to process contextually
  const lines = text.split('\n');
  let inInterfaceSection = false;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('#') || !line) continue;

    // Check if line switches section
    if (line.startsWith('/')) {
      if (line.toLowerCase().startsWith('/interface')) {
        inInterfaceSection = true;
      } else {
        inInterfaceSection = false;
      }
    }

    // If we are in the interface section, we can extract names from `name=...`
    if (inInterfaceSection) {
      const nameMatch = /\bname="?([a-zA-Z0-9_\-\.\/]+)"?/i.exec(line);
      if (nameMatch) {
        const candidate = nameMatch[1];
        if (candidate && !BUILTIN_INTERFACES.has(candidate.toLowerCase()) && isNaN(candidate)) {
          customIfaces.add(candidate);
        }
      }
    }

    // Also, look for references to interfaces anywhere, e.g. `interface=ether1-wan` or `parent=bridge-lan`
    const refMatch = /\b(?:interface|parent|master-port)="?([a-zA-Z0-9_\-\.\/]+)"?/gi;
    let match;
    while ((match = refMatch.exec(line)) !== null) {
      const candidate = match[1];
      if (candidate && !BUILTIN_INTERFACES.has(candidate.toLowerCase()) && isNaN(candidate)) {
        // Only add if it doesn't match common non-interface keywords
        if (!['yes', 'no', 'true', 'false', 'none', 'disabled', 'enabled', 'auto', 'dynamic', 'static'].includes(candidate.toLowerCase())) {
          customIfaces.add(candidate);
        }
      }
    }
  }

  return Array.from(customIfaces);
}

/**
 * Detects domains and DDNS patterns.
 */
function detectDomains(text) {
  if (typeof text !== 'string') return [];
  const domains = new Set();
  const domainRegex = /\b([a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+\.(?:[a-zA-Z]{2,12}|mynetname\.net))\b/g;
  let match;
  while ((match = domainRegex.exec(text)) !== null) {
    domains.add(match[1]);
  }
  return Array.from(domains);
}

/**
 * Main Masking function
 */
function mask(text, options = {}) {
  if (typeof text !== 'string') {
    return { maskedText: '', mapping: {} };
  }

  const opts = {
    maskIPs: true,
    maskMACs: true,
    maskSecrets: true,
    maskInterfaces: true,
    maskDomains: true,
    maskIdentity: true,
    ...options
  };

  let maskedText = text;

  const mapping = {
    privIP: {},
    pubIP: {},
    mac: {},
    secret: {},
    iface: {},
    domain: {},
    identity: {}
  };

  let privIpCounter = 1;
  let pubIpCounter = 1;
  let macCounter = 1;
  let secretCounter = 1;
  let ifaceCounter = 1;
  let domainCounter = 1;
  let identityCounter = 1;

  // 1. SECRETS
  if (opts.maskSecrets) {
    const secretRegex = /\b(password|secret|wpa-pre-shared-key|wpa2-pre-shared-key|passphrase|shared-secret|auth-key|pin|active-code|pass)=(?:"([^"]+)"|([^\s,;]+))/gi;

    maskedText = maskedText.replace(secretRegex, (match, key, quotedVal, unquotedVal) => {
      const rawVal = quotedVal !== undefined ? quotedVal : unquotedVal;

      if (!rawVal || rawVal.length <= 1 || ['yes', 'no', 'true', 'false', 'none', 'disabled', 'enabled', 'auto', 'dynamic'].includes(rawVal.toLowerCase())) {
        return match;
      }

      let placeholder = Object.keys(mapping.secret).find(k => mapping.secret[k] === rawVal);
      if (!placeholder) {
        placeholder = `[SECRET_${secretCounter++}]`;
        mapping.secret[placeholder] = rawVal;
      }

      if (quotedVal !== undefined) {
        return `${key}="${placeholder}"`;
      }
      return `${key}=${placeholder}`;
    });
  }

  // 2. MAC ADDRESSES
  if (opts.maskMACs) {
    const MAC_REGEX = /\b(?:[0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}\b/g;
    maskedText = maskedText.replace(MAC_REGEX, (match) => {
      let placeholder = Object.keys(mapping.mac).find(k => mapping.mac[k] === match);
      if (!placeholder) {
        placeholder = `[MAC_${macCounter++}]`;
        mapping.mac[placeholder] = match;
      }
      return placeholder;
    });
  }

  // 3. IP ADDRESSES
  if (opts.maskIPs) {
    const IPV6_CANDIDATE_REGEX = /\b(?:[0-9a-fA-F]{1,4}:){1,7}:[0-9a-fA-F]{0,4}(?:\/\d{1,3})?\b|\b(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}(?:\/\d{1,3})?\b|\b:(?::[0-9a-fA-F]{1,4}){1,7}(?:\/\d{1,3})?\b|\b[0-9a-fA-F]{1,4}::(?:\/\d{1,3})?\b/g;

    maskedText = maskedText.replace(IPV6_CANDIDATE_REGEX, (match) => {
      let ipPart = match;
      let cidrSuffix = '';
      if (match.includes('/')) {
        const parts = match.split('/');
        ipPart = parts[0];
        cidrSuffix = '/' + parts[1];
      }

      const isPrivate = isPrivateIPv6(ipPart);
      let placeholder;
      if (isPrivate) {
        placeholder = Object.keys(mapping.privIP).find(k => mapping.privIP[k] === ipPart);
        if (!placeholder) {
          placeholder = `[PRIV_IP_${privIpCounter++}]`;
          mapping.privIP[placeholder] = ipPart;
        }
      } else {
        placeholder = Object.keys(mapping.pubIP).find(k => mapping.pubIP[k] === ipPart);
        if (!placeholder) {
          placeholder = `[PUB_IP_${pubIpCounter++}]`;
          mapping.pubIP[placeholder] = ipPart;
        }
      }
      return placeholder + cidrSuffix;
    });

    const IPV4_CANDIDATE_REGEX = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(?:\/\d{1,2})?\b/g;

    maskedText = maskedText.replace(IPV4_CANDIDATE_REGEX, (match) => {
      let ipPart = match;
      let cidrSuffix = '';
      if (match.includes('/')) {
        const parts = match.split('/');
        ipPart = parts[0];
        cidrSuffix = '/' + parts[1];
      }

      const isPrivate = isPrivateIPv4(ipPart);
      let placeholder;
      if (isPrivate) {
        placeholder = Object.keys(mapping.privIP).find(k => mapping.privIP[k] === ipPart);
        if (!placeholder) {
          placeholder = `[PRIV_IP_${privIpCounter++}]`;
          mapping.privIP[placeholder] = ipPart;
        }
      } else {
        placeholder = Object.keys(mapping.pubIP).find(k => mapping.pubIP[k] === ipPart);
        if (!placeholder) {
          placeholder = `[PUB_IP_${pubIpCounter++}]`;
          mapping.pubIP[placeholder] = ipPart;
        }
      }
      return placeholder + cidrSuffix;
    });
  }

  // 4. SYSTEM IDENTITY
  if (opts.maskIdentity) {
    const identityRegex = /(\/system\s+identity\s+set\s+name=)(?:"([^"]+)"|([^\s;]+))/gi;
    maskedText = maskedText.replace(identityRegex, (match, prefix, quotedVal, unquotedVal) => {
      const rawVal = quotedVal !== undefined ? quotedVal : unquotedVal;
      let placeholder = Object.keys(mapping.identity).find(k => mapping.identity[k] === rawVal);
      if (!placeholder) {
        placeholder = `[IDENTITY_${identityCounter++}]`;
        mapping.identity[placeholder] = rawVal;
      }
      if (quotedVal !== undefined) {
        return `${prefix}"${placeholder}"`;
      }
      return `${prefix}${placeholder}`;
    });
  }

  // 5. DOMAINS / DDNS
  if (opts.maskDomains) {
    const domainsList = detectDomains(maskedText);
    domainsList.sort((a, b) => b.length - a.length);
    for (const dom of domainsList) {
      let placeholder = Object.keys(mapping.domain).find(k => mapping.domain[k] === dom);
      if (!placeholder) {
        placeholder = `[DOMAIN_${domainCounter++}]`;
        mapping.domain[placeholder] = dom;
      }
      const domEscaped = dom.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const domRegex = new RegExp(`\\b${domEscaped}\\b`, 'g');
      maskedText = maskedText.replace(domRegex, placeholder);
    }
  }

  // 6. CUSTOM INTERFACES
  if (opts.maskInterfaces) {
    const customIfaces = detectCustomInterfaces(maskedText);
    customIfaces.sort((a, b) => b.length - a.length);

    for (const iface of customIfaces) {
      let placeholder = Object.keys(mapping.iface).find(k => mapping.iface[k] === iface);
      if (!placeholder) {
        placeholder = `[IFACE_${ifaceCounter++}]`;
        mapping.iface[placeholder] = iface;
      }

      const ifaceEscaped = iface.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const ifaceRegex = new RegExp(`\\b${ifaceEscaped}\\b`, 'g');
      maskedText = maskedText.replace(ifaceRegex, placeholder);
    }
  }

  return { maskedText, mapping };
}

/**
 * Main Restoration function
 */
function unmask(text, mapping) {
  if (!text || !mapping) return text;
  let restoredText = text;

  const allReplacements = [];

  const categories = ['privIP', 'pubIP', 'mac', 'secret', 'iface', 'domain', 'identity'];
  for (const cat of categories) {
    if (mapping[cat]) {
      for (const [placeholder, original] of Object.entries(mapping[cat])) {
        allReplacements.push({ placeholder, original });
      }
    }
  }

  allReplacements.sort((a, b) => b.placeholder.length - a.placeholder.length);

  for (const item of allReplacements) {
    restoredText = restoredText.split(item.placeholder).join(item.original);
  }

  return restoredText;
}

module.exports = {
  mask,
  unmask,
  detectCustomInterfaces,
  isPrivateIPv4,
  isPrivateIPv6
};
