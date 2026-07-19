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

  // Clean up empty backticks/space patterns (such as ` `bash ... ` `) which cause ugly grey squares
  let html = text.replace(/`[\s]*`/g, '');

  // Escape HTML tags to prevent XSS while allowing our generated tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

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

  // Inline code (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-slate-200 dark:bg-[#0b0f19] text-brand-700 dark:text-cyber-accent font-mono text-[11px] px-1.5 py-0.5 rounded border border-cyber-border">$1</code>');

  // Code blocks (with custom styling and copy button)
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, (match, code) => {
    const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);
    const escapedCode = code.trim();
    return `
      <div class="relative group/code my-3.5 border border-cyber-border rounded-xl overflow-hidden bg-slate-950 font-mono text-xs select-text">
        <div class="flex items-center justify-between px-4 py-2 bg-cyber-panel/80 border-b border-cyber-border select-none">
          <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">RouterOS Spell</span>
          <button onclick="copySnippetText('${uniqueId}', this)" class="text-[10px] bg-[#1e1b4b] border border-cyber-border hover:bg-indigo-900 text-slate-300 px-2.5 py-1 rounded-md font-bold transition">Copy Code</button>
        </div>
        <pre id="${uniqueId}" class="p-3.5 text-slate-300 overflow-x-auto leading-relaxed select-all">${escapedCode}</pre>
      </div>
    `;
  });

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
