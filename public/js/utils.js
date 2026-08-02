const Utils = {
  // RouterOS command patterns
  ROUTEROS_COMMAND_PATTERNS: [
    /^\/[a-z][a-z0-9-]*(\s+[a-z][a-z0-9-]*)*$/i,  // /ip firewall filter
    /^(add|set|remove|move)\s+/i,                    // add action=drop
    /^\[(find|get|print)\s/i,                        // [find interface=ether1]
    /^:\s*(global|local|if|for|foreach|do|while|put|log|error|beep|delay|execute|pick|len|typeof|tonum|tostr|toarray|toip|toip6|toid)\b/i,
    /^#\s/,                                          // # comment
    /^\/ip\s/i,                                      // /ip address
    /^\/interface\s/i,                               // /interface bridge
    /^\/system\s/i,                                  // /system clock
    /^\/routing\s/i,                                 // /routing bgp
    /^\/queue\s/i,                                   // /queue simple
    /^\/tool\s/i,                                    // /tool mac-server
    /^\/ipv6\s/i,                                    // /ipv6 settings
  ],

  isRouterOSCommand(line) {
    const self = (typeof this !== 'undefined' && this && this.ROUTEROS_COMMAND_PATTERNS) ? this : Utils;
    const trimmed = line.trim();
    if (!trimmed) return false;
    return (trimmed.startsWith('/') && /^\/[a-z]/i.test(trimmed)) || self.ROUTEROS_COMMAND_PATTERNS.some(pattern => pattern.test(trimmed));
  },

  isLikelyDescription(text) {
    const self = (typeof this !== 'undefined' && this && this.isRouterOSCommand) ? this : Utils;
    const trimmed = text.trim();
    // If it's mostly Italian/English words (not commands), it's a description
    const wordCount = trimmed.split(/\s+/).length;
    const commandLikeLines = trimmed.split('\n').filter(l => self.isRouterOSCommand(l)).length;
    return commandLikeLines === 0 && wordCount > 2;
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

  createCodeBlockHtml(code, lang = 'RouterOS') {
    const self = (typeof this !== 'undefined' && this && this.escapeHtml) ? this : Utils;
    const lines = code.split('\n');
    let innerContent = '';
    if (lang.toUpperCase() === 'ROUTEROS') {
      innerContent = lines.map(l => `<span class="command-line">${self.escapeHtml(l)}</span>`).join('');
    } else {
      innerContent = self.escapeHtml(code);
    }
    return `
      <div class="code-block-container">
        <div class="code-block-header">
          <span class="code-block-lang">${lang.toUpperCase()}</span>
          <button class="code-block-copy" data-code="${encodeURIComponent(code)}" title="Copy">
            <i data-lucide="copy" class="w-3 h-3"></i>
          </button>
        </div>
        <pre class="code-block-content"><code>${innerContent}</code></pre>
      </div>
    `;
  },

  // Standard markdown parser tailored specifically for RouterOS styles.
  renderMarkdown(text) {
    if (!text) return '';

    // Clean up empty backticks/space patterns (such as ` `bash ... ` `) which cause ugly grey squares
    text = text.replace(/(?<!`)`\s*`(?!`)/g, '');

    let html = text;

    // PHASE 1: Extract fenced code blocks (``` ... ```)
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\s*\n([\s\S]*?)```/g, (match, lang, code) => {
      const lowerLang = (lang || '').toLowerCase().trim();
      const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
      if (lowerLang === 'mermaid') {
        codeBlocks.push({ isMermaid: true, lang: 'mermaid', code: code.trim() });
      } else {
        codeBlocks.push({ isMermaid: false, lang: lowerLang, code: code.trim() });
      }
      return placeholder;
    });

    // PHASE 2: Standard markdown processing
    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1 class="md-h1">$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code (single backticks) - MUST come before line processing
    html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code font-mono text-[11px]">$1</code>');

    // Lists
    html = html.replace(/^- (.*$)/gm, '<li class="md-li ml-4 list-disc">$1</li>');
    html = html.replace(/^\* (.*$)/gm, '<li class="md-li ml-4 list-disc">$1</li>');
    html = html.replace(/^\d+\. (.*$)/gm, '<li class="md-li-num ml-4 list-decimal">$1</li>');

    // Line breaks
    html = html.replace(/\n/g, '<br>');

    // PHASE 3: Post-process to wrap orphan RouterOS commands
    // Split by <br> and process each line
    const self = (typeof this !== 'undefined' && this && this.isRouterOSCommand) ? this : Utils;
    const lines = html.split('<br>');
    const processedLines = [];
    let inCodeBlock = false;
    let codeBlockBuffer = [];
    let codeBlockLang = 'RouterOS';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip if it's a placeholder for an existing code block
      if (line.match(/__CODEBLOCK_\d+__/) || line.match(/^<[a-z]/i)) {
        // Flush any accumulated code block before placeholders or tags
        if (inCodeBlock && codeBlockBuffer.length > 0) {
          const codeContent = codeBlockBuffer.join('\n');
          const blockHtml = self.createCodeBlockHtml(codeContent, codeBlockLang);
          processedLines.push(blockHtml);
          codeBlockBuffer = [];
          inCodeBlock = false;
        }
        processedLines.push(line);
        continue;
      }

      // Check if this line is a RouterOS command
      const cleanLine = line.replace(/<\/?[a-z][^>]*>/gi, '').trim();

      if (!cleanLine) {
        // Empty lines can be skipped or flushed depending on whether they separate blocks
        if (inCodeBlock && codeBlockBuffer.length > 0) {
          const codeContent = codeBlockBuffer.join('\n');
          const blockHtml = self.createCodeBlockHtml(codeContent, codeBlockLang);
          processedLines.push(blockHtml);
          codeBlockBuffer = [];
          inCodeBlock = false;
        }
        processedLines.push(line);
        continue;
      }

      const isCommand =
        self.isRouterOSCommand(cleanLine) ||
        cleanLine.startsWith('/') ||
        cleanLine.startsWith(':') ||
        cleanLine.startsWith('\\') ||  // continuation
        ['export', 'import', 'print', 'enable', 'disable', 'reset', 'reboot', 'shutdown', 'backup', 'restore'].some(cmd => cleanLine.toLowerCase() === cmd) ||
        (cleanLine.includes('=') && /^(add|set|remove|move)\s/i.test(cleanLine));

      if (isCommand) {
        if (cleanLine.startsWith('\\')) {
          // It's a RouterOS continuation line. Append to the previous line in the buffer if we are currently in a code block.
          if (inCodeBlock && codeBlockBuffer.length > 0) {
            codeBlockBuffer[codeBlockBuffer.length - 1] += ' ' + cleanLine;
          } else {
            // Fallback if no block is active
            inCodeBlock = true;
            codeBlockBuffer = [cleanLine];
          }
        } else {
          if (!inCodeBlock) {
            inCodeBlock = true;
            codeBlockBuffer = [cleanLine];
          } else {
            codeBlockBuffer.push(cleanLine);
          }
        }
      } else {
        // Flush any accumulated code block
        if (inCodeBlock && codeBlockBuffer.length > 0) {
          const codeContent = codeBlockBuffer.join('\n');
          const blockHtml = self.createCodeBlockHtml(codeContent, codeBlockLang);
          processedLines.push(blockHtml);
          codeBlockBuffer = [];
          inCodeBlock = false;
        }
        processedLines.push(line);
      }
    }

    // Flush remaining code block
    if (inCodeBlock && codeBlockBuffer.length > 0) {
      const codeContent = codeBlockBuffer.join('\n');
      const blockHtml = self.createCodeBlockHtml(codeContent, codeBlockLang);
      processedLines.push(blockHtml);
    }

    html = processedLines.join('<br>');

    // PHASE 4: Restore fenced code blocks with validation
    codeBlocks.forEach((block, index) => {
      const placeholder = `__CODEBLOCK_${index}__`;

      if (block.isMermaid) {
        const mermaidHtml = `
          <div class="mermaid bg-cyber-panel p-4 rounded-xl overflow-x-auto mt-4 select-none">
            ${block.code}
          </div>
        `;
        html = html.replace(placeholder, mermaidHtml);
      } else if (block.lang === 'text' || (!block.lang && Utils.isLikelyDescription(block.code))) {
        const textHtml = `<p class="md-description text-xs text-zinc-400 my-2">${Utils.escapeHtml(block.code)}</p>`;
        html = html.replace(placeholder, textHtml);
      } else {
        const escapedCode = Utils.escapeHtml(block.code);
        let lang = block.lang || 'RouterOS';
        if (lang.toLowerCase() === 'bash') lang = 'Bash';
        else if (lang.toLowerCase() === 'routeros') lang = 'RouterOS';
        else if (lang.toLowerCase() === 'sh') lang = 'Shell';
        else lang = lang.charAt(0).toUpperCase() + lang.slice(1);

        const blockHtml = `
          <div class="code-block-container">
            <div class="code-block-header">
              <span class="code-block-lang">${lang.toUpperCase()}</span>
              <button class="code-block-copy" data-code="${encodeURIComponent(block.code)}" title="Copy">
                <i data-lucide="copy" class="w-3 h-3"></i>
              </button>
            </div>
            <pre class="code-block-content"><code>${escapedCode}</code></pre>
          </div>
        `;
        html = html.replace(placeholder, blockHtml);
      }
    });

    return html;
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
