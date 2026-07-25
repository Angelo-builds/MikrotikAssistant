/**
 * Mik the Winbox Wizard — Frontend Pure Utilities
 * Designed to be dual-compatible (runs in modern browser as global/module, and in Node.js via require)
 */

/**
 * Lightweight diff engine comparing two multi-line configurations.
 * Compares original versus corrected lines and aligns matches.
 *
 * @param {string} originalText
 * @param {string} correctedText
 * @returns {Array<{type: string, left: string, right: string}>} aligned lines
 */
function computeLineDiff(originalText, correctedText) {
  const leftLines = (originalText || '').split('\n');
  const rightLines = (correctedText || '').split('\n');

  const alignedLines = [];
  let i = 0, j = 0;

  while (i < leftLines.length || j < rightLines.length) {
    const leftLine = leftLines[i] !== undefined ? leftLines[i] : null;
    const rightLine = rightLines[j] !== undefined ? rightLines[j] : null;

    if (leftLine === rightLine) {
      if (leftLine !== null) {
        alignedLines.push({ type: 'equal', left: leftLine, right: rightLine });
      }
      i++; j++;
    } else {
      const leftLookahead = leftLines[i + 1] !== undefined ? leftLines[i + 1] : null;
      const rightLookahead = rightLines[j + 1] !== undefined ? rightLines[j + 1] : null;

      if (leftLine !== null && rightLine !== null && leftLine.trim() !== '' && rightLine.trim() !== '' &&
          (leftLine.substring(0, 8) === rightLine.substring(0, 8) || (leftLine.includes('interface') && rightLine.includes('interface')))) {
        alignedLines.push({ type: 'modify', left: leftLine, right: rightLine });
        i++; j++;
      } else if (leftLine !== null && rightLookahead === leftLine) {
        alignedLines.push({ type: 'insert', left: '', right: rightLine });
        j++;
      } else if (rightLine !== null && leftLookahead === rightLine) {
        alignedLines.push({ type: 'delete', left: leftLine, right: '' });
        i++;
      } else {
        if (leftLine !== null && rightLine !== null) {
          alignedLines.push({ type: 'modify', left: leftLine, right: rightLine });
          i++; j++;
        } else if (leftLine !== null) {
          alignedLines.push({ type: 'delete', left: leftLine, right: '' });
          i++;
        } else if (rightLine !== null) {
          alignedLines.push({ type: 'insert', left: '', right: rightLine });
          j++;
        }
      }
    }
  }

  return alignedLines;
}

/**
 * Standard markdown parser tailored specifically for RouterOS styles.
 * Renders bold statements, bullet lists, headers, code, and copy-paste interactive snippets.
 *
 * @param {string} text
 * @returns {string} parsed HTML
 */
function renderMarkdown(text) {
  if (!text) return '';

  // Clean up empty backticks/space patterns (such as ` `bash ... ` `) which cause ugly grey squares,
  // using lookbehinds and lookaheads to avoid corrupting triple backticks (```).
  let html = text.replace(/(?<!\`)`[\s]*`(?!\`)/g, '');

  // Pre-process single backtick commands to block-level triple-backtick blocks for readability and copy-ability
  html = html.replace(/`([^`\r\n]+)`/gi, (match, contents) => {
    const trimmed = contents.trim();
    const isCommand = /^(?:bash|sh|cmd|cli|routeros)\s+/i.test(trimmed) ||
                      trimmed.startsWith('/') ||
                      /^(?:add|set|remove|enable|disable|print|tool|ip|ipv6|routing|interface|system|queue|firewall|dns)\s/i.test(trimmed) ||
                      trimmed.includes('add ') || trimmed.includes('set ');
    if (isCommand) {
      let lang = 'bash';
      let code = trimmed;
      const langMatch = /^(bash|sh|cmd|cli|routeros)\s+(.*)$/i.exec(trimmed);
      if (langMatch) {
        lang = langMatch[1].toLowerCase();
        code = langMatch[2];
      }
      return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
    }
    return match;
  });

  // Escape HTML tags to prevent XSS while allowing our generated tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // After escaping HTML, we also need to decode escaped backticks back to normal if they were part of code formatting
  html = html.replace(/&lt;code&gt;/g, '<code>').replace(/&lt;\/code&gt;/g, '</code>');

  // Restore proprietary LLM parser tags
  html = html
    .replace(/&lt;&lt;&lt;EXPLANATION&gt;&gt;&gt;/g, '')
    .replace(/&lt;&lt;&lt;END_EXPLANATION&gt;&gt;&gt;/g, '');

  // Bullet lists
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>');
  html = html.replace(/(<li.*<\/li>)/gs, '<ul class="my-2 space-y-1.5">$1</ul>');

  // Headers (###, ##, #)
  html = html.replace(/^### (.*$)/gim, '<h5 class="text-xs font-black text-slate-800 dark:text-white mt-4 mb-2 uppercase tracking-wide">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="text-sm font-bold text-slate-800 dark:text-white mt-5 mb-2 border-b border-cyber-border pb-1.5">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="text-base font-bold text-cyber-accent mt-6 mb-3">$1</h3>');

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-800 dark:text-white font-semibold">$1</strong>');

  // Code blocks (with custom styling and copy button) - processed BEFORE inline code to avoid overlap conflicts
  // Crucially, this runs after HTML escaping so that generated container divs, buttons, and SVGs are preserved!
  // Note: We MUST preserve the escaped HTML tags inside the <pre> tag to prevent security vulnerabilities (XSS)
  // and layout-breaking parsing when code blocks contain HTML/SVG text.
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    if (lang && lang.trim().toLowerCase() === 'mermaid') {
      return `
        <div class="mermaid bg-cyber-panel p-4 rounded-xl overflow-x-auto mt-4 select-none">
          ${code.trim()}
        </div>
      `;
    }

    const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);

    // Capitalize language name nicely
    let langName = lang ? lang.trim() : 'RouterOS';
    if (langName.toLowerCase() === 'bash') langName = 'Bash';
    else if (langName.toLowerCase() === 'routeros') langName = 'RouterOS';
    else if (langName.toLowerCase() === 'sh') langName = 'Shell';
    else langName = langName.charAt(0).toUpperCase() + langName.slice(1);

    // Get active language using a global state reference or localize fallback
    let isIt = false;
    if (typeof state !== 'undefined' && state.language === 'it') {
      isIt = true;
    } else if (typeof stateStore !== 'undefined' && stateStore.get && stateStore.get('language') === 'it') {
      isIt = true;
    }
    const copyTitle = isIt ? 'Copia codice' : 'Copy code';

    return `
      <div class="relative group/code my-4 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 dark:bg-[#0e1117] shadow-lg select-text">
        <div class="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 select-none">
          <div class="flex items-center space-x-1.5 text-slate-600 dark:text-slate-400 font-sans text-xs font-semibold">
            <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>${langName}</span>
          </div>
          <button onclick="copySnippetText('${uniqueId}', this)" class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition flex items-center focus:outline-none p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800" title="${copyTitle}">
            <!-- Copy Icon (two overlapping sheets) -->
            <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <!-- Check Icon (hidden initially) -->
            <svg class="w-4 h-4 check-icon hidden text-cyber-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        <pre id="${uniqueId}" class="p-4 text-slate-800 dark:text-slate-200 overflow-x-auto leading-relaxed select-all font-mono text-[12px] bg-white dark:bg-[#0e1117]">${code.trim()}</pre>
      </div>
    `;
  });

  // Inline code (`code`) - beautifully legible high contrast color scheme in both light/dark themes!
  html = html.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-[#0b0f19] text-brand-700 dark:text-cyber-accent font-mono text-[11px] px-1.5 py-0.5 rounded border border-cyber-border">$1</code>');

  // Newlines to paragraphs
  html = html.split('\n\n').map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<u') || trimmed.startsWith('<div') || trimmed.startsWith('<li')) {
      return p;
    }
    return `<p class="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">${p}</p>`;
  }).join('');

  return html;
}

/**
 * Extracts only the actionable RouterOS commands (lines starting with '/')
 * from markdown, stripping out conversational text and backticks.
 *
 * @param {string} text
 * @returns {string} extracted commands
 */
function extractRouterOsCommands(text) {
  if (!text) return '';
  const lines = text.split('\n');
  const commands = [];
  lines.forEach(line => {
    let clean = line.trim();
    // Strip leading/trailing backticks if present
    clean = clean.replace(/^`+|`+$/g, '').trim();
    if (clean.startsWith('/')) {
      commands.push(clean);
    }
  });
  return commands.join('\n');
}

/**
 * Standard debounce implementation to limit function invocation frequency.
 *
 * @param {Function} func
 * @param {number} delay
 * @returns {Function} debounced function
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

/**
 * VLAN Parser Utility for RouterOS Configuration logs.
 * Extracts bridges, VLAN IDs, and tagged/untagged port mappings.
 * Works progressively; if parsing fails, it fails gracefully.
 *
 * @param {string} configText
 * @returns {Array<{bridge: string, vlanId: number, ports: string[]}>} parsed mappings
 */
function parseVlanConfig(configText) {
  if (!configText) return [];
  const results = [];
  const lines = configText.split('\n');

  // Let's look for:
  // /interface bridge vlan
  // add bridge=bridge1 tagged=ether1,ether2 untagged=ether3 vlan-ids=10
  // Or:
  // /interface vlan
  // add interface=bridge1 name=vlan10 vlan-id=10
  // Or:
  // /interface bridge port
  // add bridge=bridge1 interface=ether1 pvid=10

  let currentSection = '';
  const portPvids = {}; // port -> pvid
  const vlanEntries = {}; // bridge_vlanid -> { bridge, vlanId, ports: Set }

  for (let line of lines) {
    let clean = line.trim();
    if (!clean || clean.startsWith('#')) continue;

    if (clean.startsWith('/')) {
      // Parse section headers
      if (clean.startsWith('/interface bridge vlan')) {
        currentSection = 'bridge-vlan';
      } else if (clean.startsWith('/interface bridge port')) {
        currentSection = 'bridge-port';
      } else if (clean.startsWith('/interface vlan')) {
        currentSection = 'vlan';
      } else {
        currentSection = '';
      }
      continue;
    }

    if (clean.startsWith('add ')) {
      if (currentSection === 'bridge-vlan') {
        // e.g. add bridge=bridge tagged=ether1,ether2 untagged=ether3 vlan-ids=10
        const bridgeMatch = /bridge=([^\s]+)/.exec(clean);
        const vlanMatch = /vlan-ids=([0-9\-,]+)/.exec(clean);
        const taggedMatch = /tagged=([^\s]+)/.exec(clean);
        const untaggedMatch = /untagged=([^\s]+)/.exec(clean);

        if (bridgeMatch && vlanMatch) {
          const bridge = bridgeMatch[1].replace(/["']/g, '');
          const vlanStr = vlanMatch[1].replace(/["']/g, '');

          // vlan-ids can be single, list or range (e.g. 10, 10-20)
          // We support list/single first
          const vlanIds = [];
          if (vlanStr.includes(',')) {
            vlanStr.split(',').forEach(v => {
              const parsedV = parseInt(v, 10);
              if (!isNaN(parsedV)) vlanIds.push(parsedV);
            });
          } else if (vlanStr.includes('-')) {
            const range = vlanStr.split('-');
            const start = parseInt(range[0], 10);
            const end = parseInt(range[1], 10);
            if (!isNaN(start) && !isNaN(end)) {
              for (let v = start; v <= end; v++) vlanIds.push(v);
            }
          } else {
            const parsedV = parseInt(vlanStr, 10);
            if (!isNaN(parsedV)) vlanIds.push(parsedV);
          }

          const portsList = [];
          if (taggedMatch) {
            taggedMatch[1].replace(/["']/g, '').split(',').forEach(p => {
              if (p.trim()) portsList.push(p.trim() + ' (tagged)');
            });
          }
          if (untaggedMatch) {
            untaggedMatch[1].replace(/["']/g, '').split(',').forEach(p => {
              if (p.trim()) portsList.push(p.trim() + ' (untagged)');
            });
          }

          vlanIds.forEach(vlanId => {
            const key = `${bridge}_${vlanId}`;
            if (!vlanEntries[key]) {
              vlanEntries[key] = { bridge, vlanId, ports: new Set() };
            }
            portsList.forEach(p => vlanEntries[key].ports.add(p));
          });
        }
      } else if (currentSection === 'bridge-port') {
        // e.g. add bridge=bridge1 interface=ether1 pvid=10
        const bridgeMatch = /bridge=([^\s]+)/.exec(clean);
        const ifaceMatch = /interface=([^\s]+)/.exec(clean);
        const pvidMatch = /pvid=([0-9]+)/.exec(clean);

        if (bridgeMatch && ifaceMatch) {
          const bridge = bridgeMatch[1].replace(/["']/g, '');
          const iface = ifaceMatch[1].replace(/["']/g, '');
          const pvid = pvidMatch ? parseInt(pvidMatch[1], 10) : 1; // Default PVID is 1 if not specified

          const key = `${bridge}_${pvid}`;
          if (!vlanEntries[key]) {
            vlanEntries[key] = { bridge, vlanId: pvid, ports: new Set() };
          }
          vlanEntries[key].ports.add(`${iface} (untagged/pvid)`);
        }
      } else if (currentSection === 'vlan') {
        // e.g. add interface=bridge1 name=vlan10 vlan-id=10
        const ifaceMatch = /interface=([^\s]+)/.exec(clean);
        const nameMatch = /name=([^\s]+)/.exec(clean);
        const vlanMatch = /vlan-id=([0-9]+)/.exec(clean);

        if (ifaceMatch && vlanMatch) {
          const parentIface = ifaceMatch[1].replace(/["']/g, '');
          const vlanId = parseInt(vlanMatch[1], 10);
          const name = nameMatch ? nameMatch[1].replace(/["']/g, '') : `vlan${vlanId}`;

          // If the parent interface is a bridge, represent this VLAN interface connection
          const key = `${parentIface}_${vlanId}`;
          if (!vlanEntries[key]) {
            vlanEntries[key] = { bridge: parentIface, vlanId, ports: new Set() };
          }
          vlanEntries[key].ports.add(`${name} (vlan-interface)`);
        }
      }
    }
  }

  // Convert map to array
  for (let key in vlanEntries) {
    results.push({
      bridge: vlanEntries[key].bridge,
      vlanId: vlanEntries[key].vlanId,
      ports: Array.from(vlanEntries[key].ports)
    });
  }

  // Sort by Bridge, then VLAN ID
  results.sort((a, b) => {
    if (a.bridge !== b.bridge) return a.bridge.localeCompare(b.bridge);
    return a.vlanId - b.vlanId;
  });

  return results;
}

/**
 * Mermaid TD diagram code generator.
 * Builds Mermaid code to represent the Bridge -> VLAN ID -> Port mappings.
 *
 * @param {Array<{bridge: string, vlanId: number, ports: string[]}>} parsed
 * @returns {string} Mermaid.js markup text
 */
function generateVlanMermaidGraph(parsed) {
  if (!parsed || parsed.length === 0) return '';

  let code = 'graph TD\n';
  code += '  %% Styles & Themes\n';
  code += '  classDef bridgeStyle fill:#1e1b4b,stroke:#a78bfa,stroke-width:2px,color:#f1f5f9;\n';
  code += '  classDef vlanStyle fill:#0f172a,stroke:#22d3ee,stroke-width:2px,color:#22d3ee;\n';
  code += '  classDef portStyle fill:#022c22,stroke:#10b981,stroke-width:1px,color:#34d399;\n';

  const nodesDefined = new Set();

  parsed.forEach((item, index) => {
    const bridgeId = `bridge_${item.bridge.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const vlanNodeId = `vlan_${bridgeId}_${item.vlanId}`;

    // Define Bridge Node
    if (!nodesDefined.has(bridgeId)) {
      code += `  ${bridgeId}["🌉 Bridge: ${item.bridge}"]\n`;
      code += `  class ${bridgeId} bridgeStyle;\n`;
      nodesDefined.add(bridgeId);
    }

    // Define VLAN Node
    code += `  ${vlanNodeId}["🏷️ VLAN ${item.vlanId}"]\n`;
    code += `  class ${vlanNodeId} vlanStyle;\n`;

    // Connect Bridge to VLAN
    code += `  ${bridgeId} --> ${vlanNodeId}\n`;

    // Define and Connect Port Nodes
    item.ports.forEach((portStr, portIndex) => {
      const portClean = portStr.replace(/[^a-zA-Z0-9\s()\-]/g, '');
      const portNodeId = `port_${vlanNodeId}_${portIndex}`;
      code += `  ${portNodeId}["🔌 ${portClean}"]\n`;
      code += `  class ${portNodeId} portStyle;\n`;
      code += `  ${vlanNodeId} --> ${portNodeId}\n`;
    });
  });

  return code;
}

/**
 * Detects if a given text is a valid RouterOS configuration export.
 *
 * @param {string} text
 * @returns {boolean}
 */
function isValidRouterOsConfig(text) {
  if (!text || typeof text !== 'string') return false;
  const trimmed = text.trim();
  if (trimmed.startsWith('#')) return true;

  const patterns = [
    /\/interface/,
    /\/ip/,
    /\/system/,
    /\/routing/,
    /\/queue/,
    /\/tool/,
    /\/user/,
    /\/ipv6/
  ];
  return patterns.some(pattern => pattern.test(trimmed));
}

/**
 * Scans RouterOS config text and detects various active components/features.
 *
 * @param {string} text
 * @returns {string} summary description
 */
function detectConfigSummary(text) {
  if (!text || typeof text !== 'string') return '';
  const components = [];

  // 1. VLANs detection
  const vlanIds = new Set();
  const vlanIdRegex = /vlan-id[s]?=([0-9\-,]+)/g;
  let match;
  while ((match = vlanIdRegex.exec(text)) !== null) {
    const val = match[1];
    if (val.includes(',')) {
      val.split(',').forEach(v => {
        const parsed = parseInt(v.trim(), 10);
        if (!isNaN(parsed)) vlanIds.add(parsed);
      });
    } else if (val.includes('-')) {
      const range = val.split('-');
      const start = parseInt(range[0], 10);
      const end = parseInt(range[1], 10);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) vlanIds.add(i);
      }
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed)) vlanIds.add(parsed);
    }
  }
  if (vlanIds.size > 0) {
    components.push(`${vlanIds.size} VLAN${vlanIds.size > 1 ? 's' : ''}`);
  } else if (text.includes('/interface vlan') || text.includes('/interface bridge vlan')) {
    components.push('VLANs');
  }

  // 2. Firewall Rules
  if (text.includes('/ip firewall filter')) {
    const lines = text.split('\n');
    let filterCount = 0;
    let inFilter = false;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('/ip firewall filter')) {
        inFilter = true;
      } else if (trimmed.startsWith('/')) {
        inFilter = false;
      } else if (inFilter && trimmed.startsWith('add')) {
        filterCount++;
      }
    }
    if (filterCount > 0) {
      components.push(`${filterCount} Firewall Rule${filterCount > 1 ? 's' : ''}`);
    } else {
      components.push('Firewall Rules');
    }
  } else if (text.includes('/ip firewall')) {
    components.push('Firewall Rules');
  }

  // 3. PPPoE Client
  if (text.includes('/interface pppoe-client')) {
    components.push('PPPoE Client');
  }

  // 4. DHCP Server
  if (text.includes('/ip dhcp-server')) {
    components.push('DHCP Server');
  }

  // 5. NAT Rules
  if (text.includes('/ip firewall nat')) {
    components.push('NAT Rules');
  }

  // 6. OSPF Routing
  if (text.includes('/routing ospf')) {
    components.push('OSPF Routing');
  }

  // 7. WireGuard VPN
  if (text.includes('/interface wireguard')) {
    components.push('WireGuard VPN');
  }

  // 8. Simple Queues
  if (text.includes('/queue simple') || text.includes('/queue tree')) {
    components.push('Queues');
  }

  if (components.length === 0) {
    return 'Detected: RouterOS Config';
  }

  return `Detected: ${components.join(', ')}`;
}

/**
 * Neatly formats and indents RouterOS configuration code.
 *
 * @param {string} code
 * @returns {string}
 */
function formatRouterOsConfig(code) {
  if (!code || typeof code !== 'string') return '';
  const lines = code.split('\n');
  const formatted = [];
  let isContinuation = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === '') {
      if (formatted.length > 0 && formatted[formatted.length - 1] !== '') {
        formatted.push('');
      }
      continue;
    }

    let indent = 0;
    if (line.startsWith('/') || line.startsWith('#') || line.startsWith(':')) {
      indent = 0;
    } else {
      indent = isContinuation ? 8 : 4;
    }

    formatted.push(' '.repeat(indent) + line);
    isContinuation = line.endsWith('\\');
  }
  return formatted.join('\n');
}

// Node.js Dual Compatibility Exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeLineDiff,
    renderMarkdown,
    extractRouterOsCommands,
    debounce,
    parseVlanConfig,
    generateVlanMermaidGraph,
    isValidRouterOsConfig,
    detectConfigSummary,
    formatRouterOsConfig
  };
}
