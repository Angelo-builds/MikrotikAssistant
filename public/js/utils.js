const Utils = {
  // Standard markdown parser tailored specifically for RouterOS styles.
  renderMarkdown(text) {
    if (!text) return '';

    // Clean up empty backticks/space patterns (such as ` `bash ... ` `) which cause ugly grey squares
    let html = text.replace(/(?<!\`)`[\s]*`(?!\`)/g, '');

    // 1. Handle fenced code blocks (```language ... ```) FIRST - before any other processing
    // This prevents inline code from interfering with block code. Supports optional spaces/language.
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      if (lang && lang.trim().toLowerCase() === 'mermaid') {
        const placeholder = `__MERMAID_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push({ isMermaid: true, code: code.trim() });
        return placeholder;
      }
      const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
      codeBlocks.push({ isMermaid: false, lang: lang || 'text', code: code.trim() });
      return placeholder;
    });

    // 2. Handle inline code (single backticks) - but NOT if it's part of a placeholder
    html = html.replace(/`([^`\r\n]+)`/g, (match, code) => {
      return `<code class="inline-code font-mono text-[11px]">${Utils.escapeHtml(code)}</code>`;
    });

    // 3. Handle headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="text-sm font-semibold mt-3 mb-1">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="text-base font-semibold mt-4 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="text-lg font-bold mt-4 mb-2">$1</h1>');

    // 4. Handle bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 5. Handle lists
    html = html.replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>');

    // 6. Handle line breaks (but not inside code blocks)
    html = html.replace(/\n/g, '<br>');

    // 7. Restore code blocks with proper structure
    codeBlocks.forEach((block, index) => {
      if (block.isMermaid) {
        const placeholder = `__MERMAID_BLOCK_${index}__`;
        const mermaidHtml = `
          <div class="mermaid bg-cyber-panel p-4 rounded-xl overflow-x-auto mt-4 select-none">
            ${block.code}
          </div>
        `;
        html = html.replace(placeholder, mermaidHtml);
      } else {
        const placeholder = `__CODE_BLOCK_${index}__`;
        const code = block.code.trim();

        // Check if language is explicitly RouterOS/routeros
        const hasExplicitRouterOSLang = block.lang && block.lang.trim().toLowerCase() === 'routeros';

        // Check if this "code block" actually contains a RouterOS command / statement
        const isRouterOSCommand = /^\/[a-z]|^(add|set|remove|move)\s|^#|^\:|^\[(find|get|print)|^\d+\/[a-z]/i.test(code);
        const isLikelyDescription = !hasExplicitRouterOSLang && !isRouterOSCommand && code.length < 200;

        if (isLikelyDescription) {
          // Render as normal text, not a code block
          const textHtml = `<p class="text-xs text-zinc-400 my-2">${Utils.escapeHtml(code)}</p>`;
          html = html.replace(placeholder, textHtml);
        } else {
          const escapedCode = Utils.escapeHtml(block.code);

          // Capitalize language name nicely
          let langName = block.lang ? block.lang.trim() : 'RouterOS';
          if (langName.toLowerCase() === 'bash') langName = 'Bash';
          else if (langName.toLowerCase() === 'routeros') langName = 'RouterOS';
          else if (langName.toLowerCase() === 'sh') langName = 'Shell';
          else langName = langName.charAt(0).toUpperCase() + langName.slice(1);

          const codeBlockHtml = `
            <div class="code-block-container">
              <div class="code-block-header">
                <span class="code-block-lang">${langName}</span>
                <button class="code-block-copy" data-code="${encodeURIComponent(block.code)}">
                  <i data-lucide="copy" class="w-3 h-3"></i>
                </button>
              </div>
              <pre class="code-block-content"><code>${escapedCode}</code></pre>
            </div>
          `;
          html = html.replace(placeholder, codeBlockHtml);
        }
      }
    });

    return html;
  },

  escapeHtml(text) {
    if (typeof document !== 'undefined') {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    } else {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }
  },

  extractRouterOsCommands(text) {
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
  },

  downloadAsRsc(content, filename = 'config.rsc') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  computeLineDiff(originalText, correctedText) {
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
  },

  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },

  parseVlanConfig(configText) {
    if (!configText) return [];
    const results = [];
    const lines = configText.split('\n');

    let currentSection = '';
    const vlanEntries = {};

    for (let line of lines) {
      let clean = line.trim();
      if (!clean || clean.startsWith('#')) continue;

      if (clean.startsWith('/')) {
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
          const bridgeMatch = /bridge=([^\s]+)/.exec(clean);
          const vlanMatch = /vlan-ids=([0-9\-,]+)/.exec(clean);
          const taggedMatch = /tagged=([^\s]+)/.exec(clean);
          const untaggedMatch = /untagged=([^\s]+)/.exec(clean);

          if (bridgeMatch && vlanMatch) {
            const bridge = bridgeMatch[1].replace(/["']/g, '');
            const vlanStr = vlanMatch[1].replace(/["']/g, '');

            const vlanIds = [];
            if (vlanStr.includes(',')) {
              vlanStr.split(',').forEach(v => {
                const parsedV = parseInt(v.trim(), 10);
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
          const bridgeMatch = /bridge=([^\s]+)/.exec(clean);
          const ifaceMatch = /interface=([^\s]+)/.exec(clean);
          const pvidMatch = /pvid=([0-9]+)/.exec(clean);

          if (bridgeMatch && ifaceMatch) {
            const bridge = bridgeMatch[1].replace(/["']/g, '');
            const iface = ifaceMatch[1].replace(/["']/g, '');
            const pvid = pvidMatch ? parseInt(pvidMatch[1], 10) : 1;

            const key = `${bridge}_${pvid}`;
            if (!vlanEntries[key]) {
              vlanEntries[key] = { bridge, vlanId: pvid, ports: new Set() };
            }
            vlanEntries[key].ports.add(`${iface} (untagged/pvid)`);
          }
        } else if (currentSection === 'vlan') {
          const ifaceMatch = /interface=([^\s]+)/.exec(clean);
          const nameMatch = /name=([^\s]+)/.exec(clean);
          const vlanMatch = /vlan-id=([0-9]+)/.exec(clean);

          if (ifaceMatch && vlanMatch) {
            const parentIface = ifaceMatch[1].replace(/["']/g, '');
            const vlanId = parseInt(vlanMatch[1], 10);
            const name = nameMatch ? nameMatch[1].replace(/["']/g, '') : `vlan${vlanId}`;

            const key = `${parentIface}_${vlanId}`;
            if (!vlanEntries[key]) {
              vlanEntries[key] = { bridge: parentIface, vlanId, ports: new Set() };
            }
            vlanEntries[key].ports.add(`${name} (vlan-interface)`);
          }
        }
      }
    }

    for (let key in vlanEntries) {
      results.push({
        bridge: vlanEntries[key].bridge,
        vlanId: vlanEntries[key].vlanId,
        ports: Array.from(vlanEntries[key].ports)
      });
    }

    results.sort((a, b) => {
      if (a.bridge !== b.bridge) return a.bridge.localeCompare(b.bridge);
      return a.vlanId - b.vlanId;
    });

    return results;
  },

  generateVlanMermaidGraph(parsed) {
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

      if (!nodesDefined.has(bridgeId)) {
        code += `  ${bridgeId}["🌉 Bridge: ${item.bridge}"]\n`;
        code += `  class ${bridgeId} bridgeStyle;\n`;
        nodesDefined.add(bridgeId);
      }

      code += `  ${vlanNodeId}["🏷️ VLAN ${item.vlanId}"]\n`;
      code += `  class ${vlanNodeId} vlanStyle;\n`;

      code += `  ${bridgeId} --> ${vlanNodeId}\n`;

      item.ports.forEach((portStr, portIndex) => {
        const portClean = portStr.replace(/[^a-zA-Z0-9\s()\-]/g, '');
        const portNodeId = `port_${vlanNodeId}_${portIndex}`;
        code += `  ${portNodeId}["🔌 ${portClean}"]\n`;
        code += `  class ${portNodeId} portStyle;\n`;
        code += `  ${vlanNodeId} --> ${portNodeId}\n`;
      });
    });

    return code;
  },

  isValidRouterOsConfig(text) {
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
  },

  detectConfigSummary(text) {
    if (!text || typeof text !== 'string') return '';
    const components = [];

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

    if (text.includes('/interface pppoe-client')) {
      components.push('PPPoE Client');
    }

    if (text.includes('/ip dhcp-server')) {
      components.push('DHCP Server');
    }

    if (text.includes('/ip firewall nat')) {
      components.push('NAT Rules');
    }

    if (text.includes('/routing ospf')) {
      components.push('OSPF Routing');
    }

    if (text.includes('/interface wireguard')) {
      components.push('WireGuard VPN');
    }

    if (text.includes('/queue simple') || text.includes('/queue tree')) {
      components.push('Queues');
    }

    if (components.length === 0) {
      return 'Detected: RouterOS Config';
    }

    return `Detected: ${components.join(', ')}`;
  },

  formatRouterOsConfig(code) {
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
};

// Global bindings for backward compatibility in browsers
if (typeof window !== 'undefined') {
  window.renderMarkdown = Utils.renderMarkdown.bind(Utils);
  window.extractRouterOsCommands = Utils.extractRouterOsCommands.bind(Utils);
  window.computeLineDiff = Utils.computeLineDiff.bind(Utils);
  window.debounce = Utils.debounce.bind(Utils);
  window.parseVlanConfig = Utils.parseVlanConfig.bind(Utils);
  window.generateVlanMermaidGraph = Utils.generateVlanMermaidGraph.bind(Utils);
  window.isValidRouterOsConfig = Utils.isValidRouterOsConfig.bind(Utils);
  window.detectConfigSummary = Utils.detectConfigSummary.bind(Utils);
  window.formatRouterOsConfig = Utils.formatRouterOsConfig.bind(Utils);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}
