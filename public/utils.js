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

// Node.js Dual Compatibility Exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    computeLineDiff,
    renderMarkdown,
    debounce
  };
}
