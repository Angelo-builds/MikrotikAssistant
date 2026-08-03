function createBuildTabModal(title, contentHtml, footerHtml = '') {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-apple-reveal';
  modal.innerHTML = `
    <div class="bg-surface border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
        <h3 class="text-sm font-semibold text-zinc-100">${title}</h3>
        <button class="btn-close text-secondary hover:text-zinc-100 text-2xl transition-all duration-150 active:scale-95">✕</button>
      </div>
      <div class="p-6 overflow-y-auto flex-1 text-secondary">
        ${contentHtml}
      </div>
      ${footerHtml ? `
      <div class="p-4 border-t border-border bg-surface-elevated/30 flex justify-end space-x-2">
        ${footerHtml}
      </div>` : ''}
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
    document.removeEventListener('keydown', handleEscape);
  };

  const handleEscape = (e) => {
    if (e.key === 'Escape') closeModal();
  };

  modal.querySelector('.btn-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', handleEscape);

  return { modal, closeModal };
}

const BuildTab = {
  get blocks() {
    return BuilderEngine.state.blocks;
  },
  set blocks(val) {
    BuilderEngine.state.blocks = val;
  },

  render(container) {
    if (!this.blocks || this.blocks.length === 0) {
      // Load sensible defaults from DefaultBlocks array
      if (typeof DefaultBlocks !== 'undefined') {
        this.blocks = [
          DefaultBlocks.find(b => b.id === 'bridge-lan'),
          DefaultBlocks.find(b => b.id === 'firewall-base'),
          DefaultBlocks.find(b => b.id === 'nat')
        ].filter(Boolean);
      } else {
        BuilderEngine.loadDefaultBlocks();
      }
    }

    container.innerHTML = `
      <div class="build-container flex flex-col h-full">
        <!-- Compact Toolbar -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-border-subtle">
          <div class="flex items-center space-x-2">
            <h2 class="text-sm font-semibold text-zinc-100">Configuration Builder</h2>
            <span class="text-[10px] text-zinc-500 bg-elevated px-2 py-0.5 rounded">${this.blocks.filter(b => b.enabled).length} active</span>
          </div>

          <div class="flex items-center space-x-1">
            <!-- Primary Actions (Always Visible) -->
            <button id="btn-generate-ai" class="btn-secondary text-xs" title="AI Generate Block">
              <i data-lucide="sparkles" class="w-3 h-3 mr-1"></i> AI
            </button>
            <button id="btn-save-library" class="btn-secondary text-xs" title="Save to Library">
              <i data-lucide="save" class="w-3 h-3 mr-1"></i> Save
            </button>
            <button id="btn-export-rsc" class="btn-primary text-xs" title="Export .rsc">
              <i data-lucide="download" class="w-3 h-3 mr-1"></i> Export
            </button>

            <div class="w-px h-4 bg-border-subtle mx-1"></div>

            <!-- Secondary Actions (Dropdown) -->
            <div class="relative">
              <button id="btn-more-actions" class="icon-btn animate-none" title="More Actions">
                <i data-lucide="more-vertical" class="w-4 h-4"></i>
              </button>

              <!-- Dropdown Menu (Hidden by default) -->
              <div id="more-actions-dropdown" class="hidden absolute right-0 top-full mt-1 w-48 bg-surface border border-border-subtle rounded-md shadow-lg z-50 py-1">
                <button id="btn-import-export" class="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-elevated flex items-center">
                  <i data-lucide="upload" class="w-3 h-3 mr-2"></i> Import .rsc
                </button>
                <button id="btn-validate" class="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-elevated flex items-center">
                  <i data-lucide="check-circle" class="w-3 h-3 mr-2"></i> Validate Config
                </button>
                <button id="btn-compare" class="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-elevated flex items-center">
                  <i data-lucide="git-compare" class="w-3 h-3 mr-2"></i> Compare Configs
                </button>
                <div class="border-t border-border-subtle my-1"></div>
                <button id="btn-clear-project" class="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-950/20 flex items-center">
                  <i data-lucide="trash-2" class="w-3 h-3 mr-2"></i> Clear Project
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Three-Column Layout -->
        <div class="flex flex-1 gap-3 overflow-hidden min-h-0">

          <!-- VARIABLES PANEL (220px) -->
          <aside class="w-[220px] flex flex-col bg-surface border border-border-subtle rounded-lg overflow-hidden">
            <div class="p-3 border-b border-border-subtle flex items-center justify-between">
              <h3 class="text-xs font-semibold text-zinc-200 flex items-center">
                <i data-lucide="variable" class="w-3 h-3 mr-1.5 text-indigo-400"></i>
                Variables
              </h3>
              <button id="btn-add-variable" class="icon-btn-sm" title="Add variable">
                <i data-lucide="plus" class="w-3 h-3"></i>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1.5" id="variables-list"></div>
            <div class="border-t border-border-subtle p-2">
              <button id="btn-toggle-derived" class="w-full flex items-center justify-between text-[10px] text-zinc-400 hover:text-zinc-200 px-2 py-1">
                <span>Derived Variables</span>
                <i data-lucide="chevron-down" class="w-3 h-3"></i>
              </button>
              <div id="derived-variables-list" class="hidden mt-1 space-y-1 max-h-32 overflow-y-auto"></div>
            </div>
            <div class="px-2 py-1.5 border-t border-border-subtle select-none">
              <button id="btn-variable-help" class="w-full flex items-center justify-between text-[10px] text-zinc-500 hover:text-zinc-300 focus:outline-none">
                <span>How to use variables</span>
                <i data-lucide="help-circle" class="w-3 h-3"></i>
              </button>
            </div>
          </aside>

          <!-- BLOCKS PANEL (flex) -->
          <section class="flex-1 flex flex-col bg-surface border border-border-subtle rounded-lg overflow-hidden">
            <div class="p-3 border-b border-border-subtle flex items-center justify-between">
              <h3 class="text-xs font-semibold text-zinc-200 flex items-center">
                <i data-lucide="blocks" class="w-3 h-3 mr-1.5 text-emerald-400"></i>
                Blocks
              </h3>
              <div class="flex items-center space-x-1">
                <button id="btn-add-block" class="icon-btn-sm" title="Add block">
                  <i data-lucide="plus" class="w-3 h-3"></i>
                </button>
                <button id="btn-add-conditional" class="icon-btn-sm" title="Add conditional">
                  <i data-lucide="git-branch" class="w-3 h-3"></i>
                </button>
                <button id="btn-generate-ai" class="icon-btn-sm" title="AI Generate">
                  <i data-lucide="sparkles" class="w-3 h-3"></i>
                </button>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-2 space-y-1.5" id="blocks-list"></div>
          </section>

          <!-- PREVIEW PANEL (320px) -->
          <aside class="w-[320px] flex flex-col bg-elevated border border-border-subtle rounded-lg overflow-hidden">
            <div class="p-3 border-b border-border-subtle flex items-center justify-between">
              <h3 class="text-xs font-semibold text-zinc-200 flex items-center">
                <i data-lucide="eye" class="w-3 h-3 mr-1.5 text-purple-400"></i>
                Live Preview
              </h3>
              <button id="btn-copy-preview" class="icon-btn-sm" title="Copy">
                <i data-lucide="copy" class="w-3 h-3"></i>
              </button>
            </div>
            <div class="flex-1 overflow-auto p-3 bg-app">
              <pre id="preview-content" class="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed"></pre>
            </div>
          </aside>
        </div>
      </div>
    `;

    this.setupListeners();
    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  updatePreview() {
    const preview = document.getElementById('preview-content') || document.getElementById('preview-output');
    if (!preview) return;
    const enabledBlocks = this.blocks.filter(b => b.enabled);
    const rsc = BuilderEngine.generateRsc(enabledBlocks);
    preview.textContent = rsc || '# No blocks enabled';
  },

  loadMonaco() {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js';
      script.onload = () => {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
        require(['vs/editor/editor.main'], () => {
          resolve();
        });
      };
      document.head.appendChild(script);
    });
  },

  async editBlock(index) {
    const block = this.blocks[index];

    if (block.isConditional) {
      const condition = await PromptModal.show({
        title: 'Set Condition',
        message: 'Example: ROUTEROS_VERSION == 7',
        placeholder: 'VARIABLE == value',
        defaultValue: block.condition || '',
        confirmText: 'Apply',
        cancelText: 'Cancel'
      });
      if (condition !== null) {
        block.condition = condition;
        block.name = `IF ${condition}`;
        this.renderBlocks();
        this.updatePreview();
      }
      return;
    }

    const btn = document.querySelector(`.btn-edit-block[data-index="${index}"]`);
    let originalIcon = '';
    if (btn) {
      originalIcon = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i>`;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }

    try {
      // Lazy load Monaco only when the user clicks "Edit"
      if (typeof monaco === 'undefined') {
        await this.loadMonaco();
      }

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
      modal.innerHTML = `
        <div class="bg-surface border border-border rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl font-sans">
          <div class="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
            <h3 class="text-sm font-semibold text-zinc-100">Edit Block: ${block.name}</h3>
            <button class="btn-close text-secondary hover:text-zinc-100 text-xl">✕</button>
          </div>
          <div class="p-6 overflow-y-auto flex-1 flex flex-col">
            <div id="monaco-container" class="flex-1 min-h-[500px]"></div>
          </div>
          <div class="flex justify-end space-x-2 p-4 border-t border-border bg-surface-elevated/30">
            <button class="btn-cancel bg-transparent text-zinc-100 border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
            <button class="btn-save bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-medium">Save Changes</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const closeModal = () => {
        if (typeof MonacoIntegration !== 'undefined' && MonacoIntegration.dispose) MonacoIntegration.dispose();
        modal.remove();
      };
      modal.querySelector('.btn-close').addEventListener('click', closeModal);
      modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
      document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escHandler); }
      });

      const container = modal.querySelector('#monaco-container');
      if (typeof MonacoIntegration !== 'undefined' && MonacoIntegration.init) {
        await MonacoIntegration.init(container, block.content);
      }

      modal.querySelector('.btn-save').addEventListener('click', () => {
        const newContent = typeof MonacoIntegration !== 'undefined' && MonacoIntegration.getContent ? MonacoIntegration.getContent() : '';
        this.blocks[index].content = newContent;
        closeModal();
        this.renderBlocks();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });

    } catch (error) {
      console.error("Failed to load Monaco:", error);
      alert("Failed to load editor. Please check your connection.");
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalIcon;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      }
    }
  },

  async addConditionalBlock() {
    const condition = await PromptModal.show({
      title: 'Add Conditional Block',
      message: 'Example: ROUTEROS_VERSION == 7',
      placeholder: 'VARIABLE == value',
      defaultValue: '',
      confirmText: 'Create Block',
      cancelText: 'Cancel'
    });
    if (!condition) return;

    this.blocks.push({
      id: `conditional-${Date.now()}`,
      name: `IF ${condition}`,
      category: 'conditional',
      enabled: true,
      content: `# IF ${condition}\n# Add your conditional RouterOS commands here\n# ENDIF`,
      isConditional: true,
      condition: condition
    });
    this.renderBlocks();
    this.updatePreview();
    if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
  },

  renderBlocks() {
    const container = document.getElementById('blocks-panel') || document.getElementById('blocks-list');
    if (!container) return;

    container.innerHTML = this.blocks.map((block, index) => {
      const isExpanded = !!block.expanded;
      return `
      <div id="block-${block.id}" class="block-card transition-all ${block.enabled ? '' : 'opacity-50'} ${isExpanded ? 'expanded' : ''}" draggable="true" data-index="${index}" ${block.isConditional ? 'data-conditional="true"' : ''} data-category="${block.category || 'general'}">
        <div class="block-card-header">
          <div class="flex items-center space-x-2 flex-1 min-w-0 card-header-toggle" data-index="${index}">
            <div class="drag-handle text-zinc-500 hover:text-purple-400 cursor-grab active:cursor-grabbing select-none mr-1.5">⋮⋮</div>
            <input type="checkbox" ${block.enabled ? 'checked' : ''} class="block-toggle w-3.5 h-3.5 rounded border-border-subtle bg-elevated text-indigo-500 focus:ring-indigo-500/50" data-index="${index}">
            <span class="text-xs font-medium text-zinc-200 truncate">${block.name}</span>
            <span class="text-[9px] text-zinc-500 bg-surface px-1.5 py-0.5 rounded font-mono uppercase">${block.category || 'general'}</span>
            ${block.isConditional ? '<span class="text-[9px] text-yellow-500 bg-yellow-900/10 px-1.5 py-0.5 rounded font-mono">IF</span>' : ''}
          </div>
          <div class="block-card-actions flex items-center space-x-1">
            <button class="icon-btn-sm btn-edit-block" data-index="${index}" title="Edit">
              <i data-lucide="pencil" class="w-3 h-3"></i>
            </button>
            <button class="icon-btn-sm btn-duplicate-block" data-index="${index}" title="Duplicate">
              <i data-lucide="copy" class="w-3 h-3"></i>
            </button>
            <button class="icon-btn-sm btn-remove-block" data-index="${index}" title="Remove">
              <i data-lucide="trash-2" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
        <div class="block-card-preview">
          <pre class="text-[10px] font-mono text-zinc-400 bg-surface rounded p-2 overflow-x-auto whitespace-pre-wrap">${this.escapeHtml(block.content)}</pre>
        </div>
      </div>
      `;
    }).join('');

    // Event listeners
    container.querySelectorAll('.block-toggle').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const index = parseInt(e.currentTarget.dataset.index);
        this.blocks[index].enabled = e.currentTarget.checked;
        this.renderBlocks();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });
    });

    container.querySelectorAll('.btn-edit-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        this.editBlock(index);
      });
    });

    container.querySelectorAll('.btn-duplicate-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        const duplicate = JSON.parse(JSON.stringify(this.blocks[index]));
        duplicate.id = `duplicate-${Date.now()}`;
        duplicate.name += ' (copy)';
        this.blocks.splice(index + 1, 0, duplicate);
        this.renderBlocks();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });
    });

    container.querySelectorAll('.btn-remove-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(e.currentTarget.dataset.index);
        this.blocks.splice(index, 1);
        this.renderBlocks();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });
    });

    // Click to expand/collapse
    container.querySelectorAll('.block-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.drag-handle')) return;
        card.classList.toggle('expanded');
        const index = parseInt(card.dataset.index);
        this.blocks[index].expanded = card.classList.contains('expanded');
      });
    });

    if (typeof BlockDragDrop !== 'undefined' && BlockDragDrop.init) {
      setTimeout(() => BlockDragDrop.init(container), 50);
    }

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  renderVariables() {
    const container = document.getElementById('variables-list') || document.getElementById('variables-panel');
    if (!container) return;

    container.innerHTML = `
      <div class="mb-3">
        <h4 class="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 select-none">Manual Inputs</h4>
        <div class="space-y-1.5">
          ${Object.entries(BuilderEngine.variables).map(([name, value]) => `
            <div id="var-${name}" class="bg-surface border border-border rounded p-2 transition-all">
              <div class="flex items-center justify-between mb-1 select-none">
                <input type="text" value="${this.escapeHtml(name)}" class="variable-name bg-transparent text-[10px] font-mono text-purple-400 w-full focus:outline-none font-bold" data-old-name="${this.escapeHtml(name)}">
                <button class="btn-remove-var text-zinc-500 hover:text-red-500 ml-1.5 h-4 w-4 flex items-center justify-center rounded hover:bg-white/5" data-name="${this.escapeHtml(name)}">✕</button>
              </div>
              <input type="text" value="${this.escapeHtml(value)}" class="variable-value w-full h-7 bg-app border border-border rounded px-2 py-1 text-[11px] font-mono text-primary focus:outline-none" data-name="${this.escapeHtml(name)}" placeholder="Value...">
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.querySelectorAll('.variable-name').forEach(input => {
      input.addEventListener('change', (e) => {
        const oldName = e.target.dataset.oldName;
        const newName = e.target.value.trim().toUpperCase();
        if (newName && newName !== oldName) {
          const value = BuilderEngine.variables[oldName];
          BuilderEngine.removeVariable(oldName);
          BuilderEngine.setVariable(newName, value);
          this.renderVariables();
          this.updatePreview();
          if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
        }
      });
    });

    container.querySelectorAll('.variable-value').forEach(input => {
      input.addEventListener('input', (e) => {
        const name = e.target.dataset.name;
        const value = e.target.value;
        BuilderEngine.setVariable(name, value);
        this.renderDerivedVariables();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });
    });

    container.querySelectorAll('.btn-remove-var').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        BuilderEngine.removeVariable(name);
        this.renderVariables();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      });
    });

    this.renderDerivedVariables();
  },

  renderDerivedVariables() {
    const container = document.getElementById('derived-variables-list');
    if (!container) return;
    const derived = BuilderEngine.derivedVariables;

    if (Object.keys(derived).length === 0) {
      container.innerHTML = '<div class="text-[10px] text-zinc-500 italic select-none">No derived variables yet. Add a NETWORK variable to calculate values.</div>';
      return;
    }

    container.innerHTML = Object.entries(derived).map(([name, value]) => `
      <div class="flex items-center justify-between bg-app px-2 py-1 rounded border border-border select-none">
        <span class="font-mono text-purple-400 text-[10px] font-semibold">{{${name}}}</span>
        <span class="text-zinc-400 text-[10px] font-mono">${this.escapeHtml(value)}</span>
      </div>
    `).join('');
  },

  reorderBlock(fromIndex, toIndex) {
    const block = BuilderEngine.state.blocks.splice(fromIndex, 1)[0];
    BuilderEngine.state.blocks.splice(toIndex, 0, block);
    this.renderBlocks();
    this.updatePreview();
  },

  async addVariable() {
    const name = await PromptModal.show({
      title: 'Add Variable',
      message: 'Enter name of the variable:',
      placeholder: 'e.g., WAN_INTERFACE_2',
      confirmText: 'Add',
      cancelText: 'Cancel'
    });
    if (!name) return;
    const value = await PromptModal.show({
      title: 'Variable Value',
      message: `Enter value for ${name.toUpperCase()}:`,
      placeholder: 'Value...',
      confirmText: 'Set',
      cancelText: 'Cancel'
    });
    if (value === null) return;
    BuilderEngine.setVariable(name.toUpperCase(), value);
    this.renderVariables();
    this.updatePreview();
    if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
  },

  getBlockIcon(category) {
    const icons = {
      'security': 'shield',
      'network': 'network',
      'services': 'server',
      'routing': 'route',
      'qos': 'gauge',
      'wan': 'cloud',
      'custom': 'file-code'
    };
    return icons[category] || 'file-code';
  },

  async addBlock() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
    modal.innerHTML = `
      <div class="bg-surface border border-border-subtle rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto">
        <div class="p-4 border-b border-border-subtle">
          <h3 class="text-sm font-semibold text-zinc-100">Add Configuration Block</h3>
          <p class="text-xs text-zinc-500 mt-1">Choose a template or create a custom block</p>
        </div>

        <div class="p-4">
          <!-- Template Grid -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            ${DefaultBlocks.map(block => `
              <button class="block-template bg-elevated border border-border-subtle rounded-lg p-3 text-left hover:border-indigo-500/50 transition focus:outline-none" data-block-id="${block.id}">
                <div class="flex items-center space-x-2 mb-2">
                  <i data-lucide="${this.getBlockIcon(block.category)}" class="w-4 h-4 text-indigo-400"></i>
                  <span class="text-xs font-medium text-zinc-200">${block.name}</span>
                </div>
                <div class="text-[10px] text-zinc-500 line-clamp-2">${block.content.substring(0, 80).replace(/\n/g, ' ')}...</div>
              </button>
            `).join('')}
          </div>

          <div class="border-t border-border-subtle pt-4">
            <p class="text-xs text-zinc-400 mb-2">Or create custom block:</p>
            <input type="text" id="custom-block-name" placeholder="Enter block name..."
              class="w-full bg-elevated border border-border-subtle rounded px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 mb-2">
            <button id="btn-create-custom" class="w-full px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded transition focus:outline-none">
              Create Empty Block
            </button>
          </div>
        </div>

        <div class="p-4 border-t border-border-subtle flex justify-end">
          <button class="btn-cancel px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 focus:outline-none">Cancel</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.btn-cancel').addEventListener('click', () => modal.remove());

    // Template selection
    modal.querySelectorAll('.block-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.dataset.blockId;
        const template = DefaultBlocks.find(b => b.id === blockId);
        if (template) {
          this.blocks.push(JSON.parse(JSON.stringify(template)));
          this.renderBlocks();
          this.updatePreview();
          modal.remove();
          if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
        }
      });
    });

    // Custom block
    modal.querySelector('#btn-create-custom').addEventListener('click', () => {
      const name = modal.querySelector('#custom-block-name').value.trim();
      if (name) {
        this.blocks.push({
          id: `custom-${Date.now()}`,
          name,
          category: 'custom',
          enabled: true,
          content: '# Add your RouterOS commands here\n# Use {{VARIABLE_NAME}} for dynamic values\n'
        });
        this.renderBlocks();
        this.updatePreview();
        modal.remove();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
      }
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  async generateBlockWithAI() {
    const description = await PromptModal.show({
      title: 'Generate Block with AI',
      message: 'Describe what you want to generate. The AI will create RouterOS commands with {{VARIABLE}} placeholders where appropriate.',
      placeholder: 'e.g., WireGuard server with peer configuration',
      confirmText: 'Generate',
      cancelText: 'Cancel'
    });
    if (!description) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
    modal.innerHTML = `
      <div class="bg-surface border border-border rounded-lg max-w-2xl w-full p-6 shadow-2xl flex flex-col items-center justify-center">
        <h3 class="text-sm font-semibold mb-4 text-primary">Generating Block with AI...</h3>
        <div class="flex items-center space-x-2 text-text-muted">
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatMessage: `Generate a RouterOS configuration block for: ${description}. Output ONLY the RouterOS commands, no explanations. Use {{VARIABLE}} syntax for any values that should be parameterized.`,
          pastedConfig: '',
          mode: 'standard',
          provider: AppState.preferences.llmProvider,
          apiKey: AppState.preferences.useBackendEnv ? 'USE_BACKEND_ENV' : (AppState.sessionApiKey || 'USE_BACKEND_ENV'),
          model: AppState.preferences.model
        })
      });

      const result = await response.json();
      modal.remove();

      if (result.explanation) {
        BuilderEngine.state.blocks.push({
          id: `ai-generated-${Date.now()}`,
          name: `AI: ${description.substring(0, 30)}...`,
          category: 'ai-generated',
          enabled: true,
          content: result.explanation
        });
        this.renderBlocks();
        this.updatePreview();
        if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
        alert('Block generated successfully!');
      } else {
        alert('Failed to generate block');
      }
    } catch (error) {
      modal.remove();
      alert('AI generation failed: ' + error.message);
    }
  },

  applyPresetData(preset) {
    BuilderEngine.state.variables = {};

    Object.entries(preset.variables).forEach(([name, value]) => {
      BuilderEngine.setVariable(name, value);
    });

    BuilderEngine.loadDefaultBlocks();
    BuilderEngine.state.blocks.forEach(block => {
      block.enabled = preset.enabledBlocks.includes(block.id);
    });

    BuilderEngine.projectName = `Preset: ${preset.name}`;
    BuilderEngine.currentProjectId = `project-${Date.now()}`;
    BuilderEngine.createdAt = new Date().toISOString();

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
    if (typeof BuilderEngine !== 'undefined') BuilderEngine.autoSaveProject();

    alert(`Preset "${preset.name}" loaded successfully!`);
  },

  loadProjectData(project) {
    BuilderEngine.state.variables = project.variables || {};
    BuilderEngine.computeAllDerived();
    BuilderEngine.state.blocks = project.blocks || [];
    BuilderEngine.currentProjectId = project.id || `project-${Date.now()}`;
    BuilderEngine.projectName = project.name || `Project ${new Date().toLocaleDateString()}`;
    BuilderEngine.createdAt = project.createdAt || new Date().toISOString();

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
    if (typeof BuilderEngine !== 'undefined') BuilderEngine.autoSaveProject();
  },

  async saveToLibrary() {
    const name = await PromptModal.show({
      title: 'Save to Library',
      message: 'Enter a name for this project:',
      placeholder: 'e.g., Client ABC - EOLO Setup',
      defaultValue: 'My MikroTik Config',
      confirmText: 'Save',
      cancelText: 'Cancel'
    });
    if (!name) return;

    const project = {
      name: name,
      variables: BuilderEngine.state.variables,
      blocks: BuilderEngine.state.blocks
    };

    BuilderLibrary.save(project);
    alert('Project saved to Library!');
  },

  receiveFromAudit(configText) {
    BuilderEngine.state.blocks.push({
      id: `audit-import-${Date.now()}`,
      name: 'Imported from Audit',
      category: 'imported',
      enabled: true,
      content: configText
    });

    this.renderBlocks();
    this.updatePreview();
    if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
    alert('Configuration imported from Audit as a new block!');
  },

  async importExport() {
    const textareaHtml = `<textarea id="import-textarea" placeholder="Paste your MikroTik .rsc export here..." class="w-full h-64 bg-surface border border-border rounded p-3 text-xs font-mono text-zinc-100 focus:border-purple-500 focus:outline-none"></textarea>`;
    const footerHtml = `
      <button class="btn-cancel bg-transparent text-primary border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
      <button class="btn-parse bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-medium">Parse & Import</button>
    `;

    const { modal, closeModal } = createBuildTabModal('Import MikroTik Export', textareaHtml, footerHtml);

    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    modal.querySelector('.btn-parse').addEventListener('click', async () => {
      const exportText = modal.querySelector('#import-textarea').value;
      if (!exportText.trim()) return;

      try {
        const response = await fetch('/api/builder/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exportText })
        });

        const result = await response.json();

        if (result.success) {
          result.blocks.forEach(block => {
            this.blocks.push(block);
          });

          Object.entries(result.variables).forEach(([name, value]) => {
            BuilderEngine.setVariable(name, value);
          });

          this.renderBlocks();
          this.renderVariables();
          this.updatePreview();
          closeModal();
          if (typeof BuilderEngine !== 'undefined') BuilderEngine.triggerAutoSave();
          alert(`Imported ${result.blocks.length} blocks and ${Object.keys(result.variables).length} variables!`);
        } else {
          alert('Parse error: ' + result.error);
        }
      } catch (error) {
        alert('Failed to parse export: ' + error.message);
      }
    });
  },

  async validateConfig() {
    try {
      const response = await fetch('/api/builder/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variables: BuilderEngine.state.variables,
          blocks: this.blocks
        })
      });

      const result = await response.json();

      let content = '<div class="space-y-4">';

      // Group 1: Critical Errors
      const errors = result.errors || [];
      if (errors.length > 0) {
        content += `
          <div>
            <h4 class="text-xs font-semibold text-red-400 mb-2 flex items-center">
              <i data-lucide="alert-circle" class="w-3 h-3 mr-1"></i>
              ${errors.length} Critical Error(s)
            </h4>
            <div class="space-y-1.5">
              ${errors.map(err => {
                const message = typeof err === 'object' && err.message ? err.message : String(err);
                const target = typeof err === 'object' ? err.target : null;
                const targetType = typeof err === 'object' ? err.targetType : null;
                return `
                  <div class="text-xs text-red-300 bg-red-900/20 border border-red-900/50 px-3 py-2 rounded flex items-start">
                    <span class="mr-2">✕</span>
                    <span class="flex-1 text-left">${message}</span>
                    ${target ? `<button class="ml-auto text-[10px] underline hover:text-white whitespace-nowrap uppercase tracking-wider font-semibold" onclick="window.highlightTarget('${targetType}', '${target}')">Fix</button>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Group 2: Warnings
      const warnings = result.warnings || [];
      if (warnings.length > 0) {
        content += `
          <div>
            <h4 class="text-xs font-semibold text-amber-400 mb-2 flex items-center">
              <i data-lucide="alert-triangle" class="w-3 h-3 mr-1"></i>
              ${warnings.length} Warning(s)
            </h4>
            <div class="space-y-1.5">
              ${warnings.map(err => {
                const message = typeof err === 'object' && err.message ? err.message : String(err);
                const target = typeof err === 'object' ? err.target : null;
                const targetType = typeof err === 'object' ? err.targetType : null;
                return `
                  <div class="text-xs text-amber-300 bg-amber-900/20 border border-amber-900/50 px-3 py-2 rounded flex items-start">
                    <span class="mr-2">⚠</span>
                    <span class="flex-1 text-left">${message}</span>
                    ${target ? `<button class="ml-auto text-[10px] underline hover:text-white whitespace-nowrap uppercase tracking-wider font-semibold" onclick="window.highlightTarget('${targetType}', '${target}')">Fix</button>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      if (errors.length === 0 && warnings.length === 0) {
        content += `
          <div class="text-center py-6">
            <i data-lucide="check-circle" class="w-8 h-8 text-emerald-500 mx-auto mb-2"></i>
            <div class="text-sm font-medium text-emerald-400">Configuration is valid!</div>
            <div class="text-xs text-zinc-500 mt-1">No issues detected.</div>
          </div>
        `;
      }
      content += '</div>';

      createBuildTabModal('Validation Results', content);
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } catch (error) {
      alert('Validation failed: ' + error.message);
    }
  },

  async compareConfigs() {
    const textareasHtml = `
      <div class="space-y-4">
        <div>
          <label class="block text-[11px] text-text-muted mb-1 font-semibold">First Configuration</label>
          <textarea id="compare-textarea-1" placeholder="Paste first configuration..." class="w-full h-48 bg-surface border border-border rounded p-3 text-xs font-mono text-zinc-100 focus:border-purple-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label class="block text-[11px] text-text-muted mb-1 font-semibold">Second Configuration</label>
          <textarea id="compare-textarea-2" placeholder="Paste second configuration..." class="w-full h-48 bg-surface border border-border rounded p-3 text-xs font-mono text-zinc-100 focus:border-purple-500 focus:outline-none"></textarea>
        </div>
        <div id="diff-result" class="mt-4 font-mono text-xs"></div>
      </div>
    `;
    const footerHtml = `
      <button class="btn-cancel bg-transparent text-primary border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
      <button class="btn-compare bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-medium">Compare</button>
    `;

    const { modal, closeModal } = createBuildTabModal('Compare Configurations', textareasHtml, footerHtml);

    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    modal.querySelector('.btn-compare').addEventListener('click', async () => {
      const config1 = modal.querySelector('#compare-textarea-1').value;
      const config2 = modal.querySelector('#compare-textarea-2').value;

      if (!config1.trim() || !config2.trim()) return;

      try {
        const response = await fetch('/api/builder/compare', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config1, config2 })
        });

        const result = await response.json();

        if (result.success) {
          const diffContainer = modal.querySelector('#diff-result');
          DiffViewer.render(diffContainer, result.differences);
        } else {
          alert('Compare error: ' + result.error);
        }
      } catch (error) {
        alert('Failed to compare: ' + error.message);
      }
    });
  },

  setupListeners() {
    const saveLibBtn = document.getElementById('btn-save-library');
    if (saveLibBtn) {
      saveLibBtn.addEventListener('click', () => this.saveToLibrary());
    }

    const exportBtn = document.getElementById('btn-export-rsc') || document.getElementById('btn-download-rsc');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const content = BuilderEngine.renderFullConfig();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${BuilderEngine.state.variables.HOSTNAME || 'config'}.rsc`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    const btnImport = document.getElementById('btn-import-export');
    if (btnImport) btnImport.addEventListener('click', () => this.importExport());

    const btnValidate = document.getElementById('btn-validate');
    if (btnValidate) btnValidate.addEventListener('click', () => this.validateConfig());

    const btnCompare = document.getElementById('btn-compare');
    if (btnCompare) btnCompare.addEventListener('click', () => this.compareConfigs());

    const btnAiGenerate = document.getElementById('btn-generate-ai');
    if (btnAiGenerate) btnAiGenerate.addEventListener('click', () => this.generateBlockWithAI());

    const btnAddConditional = document.getElementById('btn-add-conditional');
    if (btnAddConditional) btnAddConditional.addEventListener('click', () => this.addConditionalBlock());

    const btnAddVar = document.getElementById('btn-add-variable');
    if (btnAddVar) btnAddVar.addEventListener('click', () => this.addVariable());

    const btnClearProject = document.getElementById('btn-clear-project');
    if (btnClearProject) {
      btnClearProject.addEventListener('click', async () => {
        if (typeof PromptModal !== 'undefined') {
          const confirmNew = await PromptModal.show({
            title: 'Clear Project',
            message: 'Are you sure you want to clear this project and start fresh? Make sure your current project is saved.',
            confirmText: 'Clear Project',
            cancelText: 'Cancel'
          });
          if (!confirmNew) return;

          const name = await PromptModal.show({
            title: 'Project Name',
            message: 'Enter a name for the cleared project:',
            placeholder: 'e.g., Client ABC - Basic Setup',
            defaultValue: `Untitled ${new Date().toLocaleDateString()}`,
            confirmText: 'Create',
            cancelText: 'Cancel'
          });
          if (name === null) return;

          BuilderEngine.state.variables = { ...BuilderEngine.defaultVariables };
          BuilderEngine.state.blocks = [];
          BuilderEngine.currentProjectId = `project-${Date.now()}`;
          BuilderEngine.projectName = name;
          BuilderEngine.createdAt = new Date().toISOString();

          this.renderVariables();
          this.renderBlocks();
          this.updatePreview();
          BuilderEngine.autoSaveProject();
        }
      });
    }

    // More Actions Dropdown Toggle Logic
    const moreBtn = document.getElementById('btn-more-actions');
    const dropdown = document.getElementById('more-actions-dropdown');

    if (moreBtn && dropdown) {
      moreBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!moreBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });

      // Close dropdown when any action button inside it is clicked
      dropdown.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          dropdown.classList.add('hidden');
        });
      });
    }

    const btnAddBlock = document.getElementById('btn-add-block');
    if (btnAddBlock) btnAddBlock.addEventListener('click', () => this.addBlock());

    const btnToggleDerived = document.getElementById('btn-toggle-derived');
    if (btnToggleDerived) {
      btnToggleDerived.addEventListener('click', () => {
        const list = document.getElementById('derived-variables-list');
        const icon = btnToggleDerived.querySelector('i');
        if (list) {
          list.classList.toggle('hidden');
          if (icon) {
            if (list.classList.contains('hidden')) {
              icon.setAttribute('data-lucide', 'chevron-down');
            } else {
              icon.setAttribute('data-lucide', 'chevron-up');
            }
            if (typeof lucide !== 'undefined') {
              lucide.createIcons();
            }
          }
        }
      });
    }

    const btnCopyPreview = document.getElementById('btn-copy-preview');
    if (btnCopyPreview) {
      btnCopyPreview.addEventListener('click', () => {
        const preview = document.getElementById('preview-content');
        if (preview && preview.textContent) {
          navigator.clipboard.writeText(preview.textContent).then(() => {
            alert('Configuration copied to clipboard!');
          });
        }
      });
    }

    const varHelpBtn = document.getElementById('btn-variable-help');
    if (varHelpBtn) {
      varHelpBtn.addEventListener('click', () => {
        if (typeof PromptModal !== 'undefined') {
          PromptModal.show({
            title: 'Using Variables',
            message: 'Use {{VARIABLE_NAME}} syntax in your blocks. Example:\n\n/ip address add address={{LAN_GATEWAY}}/24\n\nVariables are automatically replaced when you export.',
            confirmText: 'Got it'
          });
        } else {
          alert('Using Variables:\n\nUse {{VARIABLE_NAME}} syntax in your blocks.\n\nVariables are automatically replaced when you export.');
        }
      });
    }
  },

  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

window.highlightTarget = (type, id) => {
  // Find modal and close it
  const modals = document.querySelectorAll('.fixed.inset-0');
  modals.forEach(m => {
    if (m.innerHTML.includes('Validation Results')) {
      m.remove();
    }
  });

  const selector = type === 'variable' ? `#var-${id}` : `#block-${id}`;
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Add brief flash animation (yellow/indigo flash)
    element.style.outline = '2px solid rgb(147, 51, 234)'; // indigo-500/purple-600 outline
    element.classList.add('animate-pulse');
    setTimeout(() => {
      element.style.outline = '';
      element.classList.remove('animate-pulse');
    }, 2000);
  }
};
