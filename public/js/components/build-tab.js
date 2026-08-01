function createBuildTabModal(title, contentHtml, footerHtml = '') {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-apple-reveal';
  modal.innerHTML = `
    <div class="bg-surface border border-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
        <h3 class="text-sm font-semibold text-primary">${title}</h3>
        <button class="btn-close text-secondary hover:text-primary text-2xl transition-all duration-150 active:scale-95">✕</button>
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
    container.innerHTML = `
      <div class="flex flex-col h-full space-y-4">
        <!-- Sub Header Controls -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-bold text-primary flex items-center">
            ${UI_Icons.render('hammer', 'mr-2 text-purple-500 w-5 h-5')}
            Configuration Builder
          </h2>
          <div class="flex flex-wrap gap-2">
            <button id="btn-generate-ai" class="inline-flex items-center h-8 px-3.5 rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs text-white font-medium transition-all duration-150 active:scale-95">
              ${UI_Icons.render('activity', 'w-3.5 h-3.5 mr-1.5')}
              AI Generate
            </button>
            <button id="btn-add-conditional" class="inline-flex items-center h-8 px-3 rounded-md border border-border bg-transparent hover:bg-white/5 text-xs text-primary font-medium active:scale-95 transition-all duration-150">
              ${UI_Icons.render('plus', 'w-3.5 h-3.5 mr-1.5')}
              Add Conditional
            </button>
            <button id="btn-import-export" class="inline-flex items-center h-8 px-3 rounded-md bg-purple-600 hover:bg-purple-700 text-xs text-white font-medium transition-all duration-150 active:scale-95">
              ${UI_Icons.render('download', 'w-3.5 h-3.5 mr-1.5')}
              Import .rsc
            </button>
            <button id="btn-validate" class="inline-flex items-center h-8 px-3 rounded-md border border-border bg-transparent hover:bg-white/5 text-xs text-primary font-medium active:scale-95 transition-all duration-150">
              ${UI_Icons.render('shield-check', 'w-3.5 h-3.5 mr-1.5')}
              Validate
            </button>
            <button id="btn-compare" class="inline-flex items-center h-8 px-3 rounded-md border border-border bg-transparent hover:bg-white/5 text-xs text-primary font-medium active:scale-95 transition-all duration-150">
              ${UI_Icons.render('pencil', 'w-3.5 h-3.5 mr-1.5')}
              Compare
            </button>
            <button id="btn-save-library" class="inline-flex items-center h-8 px-3 rounded-md border border-border bg-transparent hover:bg-white/5 text-xs text-primary font-medium active:scale-95 transition-all duration-150">
              ${UI_Icons.render('library', 'w-3.5 h-3.5 mr-1.5')}
              Save to Library
            </button>
            <button id="btn-export-rsc" class="inline-flex items-center h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-xs text-white font-medium transition-all duration-150 active:scale-95">
              ${UI_Icons.render('lock', 'w-3.5 h-3.5 mr-1.5')}
              Export .rsc
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
          <!-- Column 1: Variables (3 cols) -->
          <div class="col-span-12 lg:col-span-3 bg-surface rounded-lg border border-border flex flex-col overflow-hidden h-full">
            <div class="p-3 border-b border-border bg-surface-elevated flex items-center justify-between">
              <h3 class="font-bold text-xs text-purple-400 flex items-center">
                ${UI_Icons.render('activity', 'mr-2 w-4 h-4')}
                Variables
              </h3>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-4" id="variables-panel">
              <!-- Populated by JS -->
            </div>
          </div>

          <!-- Column 2: Blocks (5 cols) -->
          <div class="col-span-12 lg:col-span-5 bg-surface rounded-lg border border-border flex flex-col overflow-hidden h-full">
            <div class="p-3 border-b border-border bg-surface-elevated">
              <h3 class="font-bold text-xs text-purple-400 flex items-center">
                ${UI_Icons.render('hammer', 'mr-2 w-4 h-4')}
                Configuration Blocks
              </h3>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-3" id="blocks-panel">
              <!-- Populated by JS -->
            </div>
          </div>

          <!-- Column 3: Live Preview (4 cols) -->
          <div class="col-span-12 lg:col-span-4 bg-surface rounded-lg border border-border flex flex-col overflow-hidden h-full">
            <div class="p-3 border-b border-border bg-surface-elevated flex justify-between items-center">
              <h3 class="font-bold text-xs text-purple-400 flex items-center">
                ${UI_Icons.render('shield-check', 'mr-2 w-4 h-4')}
                Live Preview (.rsc)
              </h3>
              <span class="text-[10px] text-text-muted font-mono">Auto-updates</span>
            </div>
            <pre id="preview-output" class="flex-1 overflow-auto p-4 text-xs font-mono text-secondary whitespace-pre-wrap select-all bg-black/10"></pre>
          </div>
        </div>
      </div>
    `;

    // Render components
    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
    this.setupListeners();

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

  async editBlock(index) {
    const block = this.blocks[index];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
    modal.innerHTML = `
      <div class="bg-surface border border-border rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl font-sans">
        <div class="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
          <h3 class="text-sm font-semibold text-primary">Edit Block: ${block.name}</h3>
          <button class="btn-close text-secondary hover:text-primary text-xl">✕</button>
        </div>
        ${block.isConditional ? `
          <div class="p-3 bg-yellow-900/20 border-b border-yellow-700/50 flex items-center space-x-2">
            <span class="text-yellow-400 text-xs font-semibold">Conditional Block - Condition:</span>
            <input type="text" id="conditional-condition-edit" value="${block.condition}"
              class="flex-1 bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-yellow-300">
          </div>
        ` : ''}
        <div class="p-6 overflow-y-auto flex-1 flex flex-col">
          <div id="monaco-container" class="flex-1 min-h-[500px]"></div>
        </div>
        <div class="flex justify-end space-x-2 p-4 border-t border-border bg-surface-elevated/30">
          <button class="btn-cancel bg-transparent text-primary border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
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

      if (block.isConditional) {
        const newCondition = modal.querySelector('#conditional-condition-edit').value.trim();
        this.blocks[index].condition = newCondition;
        this.blocks[index].name = `IF ${newCondition}`;
      }

      closeModal();
      this.renderBlocks();
      this.updatePreview();
    });
  },

  addConditionalBlock() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
    modal.innerHTML = `
      <div class="bg-surface rounded-lg border border-border max-w-md w-full p-6 shadow-2xl font-sans">
        <h3 class="text-sm font-semibold mb-4 text-primary">Add Conditional Block</h3>
        <p class="text-xs text-secondary mb-3">Example conditions:</p>
        <ul class="text-xs text-text-muted mb-4 space-y-1 font-mono">
          <li>• ROUTEROS_VERSION == 7</li>
          <li>• PPPoE_ENABLED == true</li>
          <li>• BGP_ENABLED != false</li>
        </ul>
        <input type="text" id="condition-input" placeholder="e.g., ROUTEROS_VERSION == 7"
          class="w-full bg-surface border border-border rounded px-3 py-2 text-xs font-mono mb-4 text-white">
        <div class="flex justify-end space-x-2">
          <button class="btn-cancel bg-transparent text-primary border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
          <button class="btn-confirm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-medium">Create Block</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    const input = modal.querySelector('#condition-input');
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') modal.querySelector('.btn-confirm').click();
      if (e.key === 'Escape') closeModal();
    });

    modal.querySelector('.btn-confirm').addEventListener('click', () => {
      const condition = input.value.trim();
      if (!condition) { closeModal(); return; }

      this.blocks.push({
        id: `conditional-${Date.now()}`,
        name: `IF ${condition}`,
        category: 'conditional',
        enabled: true,
        content: `# IF ${condition}\n# Add your conditional RouterOS commands here\n# ENDIF`,
        isConditional: true,
        condition: condition
      });
      closeModal();
      this.renderBlocks();
      this.updatePreview();
    });
  },

  renderBlocks() {
    const container = document.getElementById('blocks-panel') || document.getElementById('blocks-list');
    if (!container) return;

    container.innerHTML = this.blocks.map((block, index) => `
      <div class="block-card bg-surface border ${block.enabled ? 'border-purple-500/50' : 'border-border'} rounded-lg p-4 transition-all hover:border-purple-500/70 relative pl-10"
           data-index="${index}"
           ${block.isConditional ? 'data-conditional="true"' : ''}
           data-category="${block.category || 'general'}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <input type="checkbox" ${block.enabled ? 'checked' : ''} class="block-toggle rounded text-purple-600 focus:ring-purple-500 bg-surface border-border" data-index="${index}">
            <span class="font-medium text-white text-xs">${block.name}</span>
            <span class="text-[10px] text-text-muted bg-surface-elevated px-2 py-0.5 rounded font-mono">${block.category || 'general'}</span>
            ${block.isConditional ? '<span class="text-[10px] text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded font-mono">Conditional</span>' : ''}
          </div>
          <div class="flex items-center space-x-2">
            <button class="btn-edit-block text-[11px] text-purple-400 hover:text-purple-300" data-index="${index}">Edit</button>
            <button class="btn-duplicate-block text-[11px] text-secondary hover:text-primary" data-index="${index}">Duplicate</button>
            <button class="btn-remove-block text-[11px] text-text-muted hover:text-red-400" data-index="${index}">Remove</button>
          </div>
        </div>
        ${block.enabled ? `<pre class="text-[11px] text-secondary font-mono bg-black/10 p-3 rounded max-h-40 overflow-y-auto whitespace-pre-wrap select-all border border-border">${this.escapeHtml(block.content)}</pre>` : ''}
      </div>
    `).join('');

    if (typeof BlockDragDrop !== 'undefined' && BlockDragDrop.init) {
      setTimeout(() => BlockDragDrop.init(container), 50);
    }

    container.querySelectorAll('.block-toggle').forEach(cb => {
      cb.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.blocks[index].enabled = e.target.checked;
        this.renderBlocks();
        this.updatePreview();
      });
    });

    container.querySelectorAll('.btn-edit-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editBlock(index);
      });
    });

    container.querySelectorAll('.btn-duplicate-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const duplicate = JSON.parse(JSON.stringify(this.blocks[index]));
        duplicate.id = `duplicate-${Date.now()}`;
        duplicate.name += ' (copy)';
        this.blocks.splice(index + 1, 0, duplicate);
        this.renderBlocks();
        this.updatePreview();
      });
    });

    container.querySelectorAll('.btn-remove-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.blocks.splice(index, 1);
        this.renderBlocks();
        this.updatePreview();
      });
    });
  },

  renderVariables() {
    const container = document.getElementById('variables-list') || document.getElementById('variables-panel');
    if (!container) return;

    container.innerHTML = `
      <div class="mb-4">
        <h4 class="text-[11px] font-bold text-text-muted uppercase mb-2">Manual Inputs</h4>
        <div class="space-y-3">
          ${Object.entries(BuilderEngine.variables).map(([name, value]) => `
            <div class="bg-surface-elevated border border-border rounded-lg p-3">
              <div class="flex items-center justify-between mb-2">
                <input type="text" value="${this.escapeHtml(name)}" class="variable-name bg-transparent text-xs font-mono text-purple-400 w-full focus:outline-none font-semibold" data-old-name="${this.escapeHtml(name)}">
                <button class="btn-remove-var text-text-muted hover:text-red-400 ml-2" data-name="${this.escapeHtml(name)}">✕</button>
              </div>
              <input type="text" value="${this.escapeHtml(value)}" class="variable-value w-full bg-surface border border-border rounded px-2 py-1 text-xs font-mono text-white" data-name="${this.escapeHtml(name)}" placeholder="Value...">
            </div>
          `).join('')}
        </div>
      </div>
      <div class="mt-4">
        <h4 class="text-[11px] font-bold text-text-muted uppercase mb-2 font-semibold">Auto-Derived (Read Only)</h4>
        <div class="space-y-2" id="derived-variables-list"></div>
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
      });
    });

    container.querySelectorAll('.btn-remove-var').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const name = e.target.dataset.name;
        BuilderEngine.removeVariable(name);
        this.renderVariables();
        this.updatePreview();
      });
    });

    this.renderDerivedVariables();
  },

  renderDerivedVariables() {
    const container = document.getElementById('derived-variables-list');
    if (!container) return;
    const derived = BuilderEngine.derivedVariables;

    if (Object.keys(derived).length === 0) {
      container.innerHTML = '<div class="text-xs text-text-muted italic">No derived variables yet. Add a NETWORK variable to see auto-calculated values.</div>';
      return;
    }

    container.innerHTML = Object.entries(derived).map(([name, value]) => `
      <div class="flex items-center justify-between bg-black/10 px-2 py-1 rounded border border-border">
        <span class="font-mono text-purple-400 text-xs font-semibold">{{${name}}}</span>
        <span class="text-secondary text-xs font-mono">${this.escapeHtml(value)}</span>
      </div>
    `).join('');
  },

  reorderBlock(fromIndex, toIndex) {
    const block = BuilderEngine.state.blocks.splice(fromIndex, 1)[0];
    BuilderEngine.state.blocks.splice(toIndex, 0, block);
    this.renderBlocks();
    this.updatePreview();
  },

  async generateBlockWithAI() {
    const description = prompt('Describe the block you want to generate (e.g., "WireGuard server with peer configuration"):');
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
          apiKey: AppState.preferences.apiKey,
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

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();

    alert(`Preset "${preset.name}" loaded successfully!`);
  },

  loadProjectData(project) {
    BuilderEngine.state.variables = project.variables || {};
    BuilderEngine.computeAllDerived();
    BuilderEngine.state.blocks = project.blocks || [];

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
  },

  saveToLibrary() {
    const name = prompt('Project name:', 'My MikroTik Config');
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
    alert('Configuration imported from Audit as a new block!');
  },

  async importExport() {
    const textareaHtml = `<textarea id="import-textarea" placeholder="Paste your MikroTik .rsc export here..." class="w-full h-64 bg-surface border border-border rounded p-3 text-xs font-mono text-primary focus:border-purple-500 focus:outline-none"></textarea>`;
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

      if (result.errors && result.errors.length > 0) {
        content += '<div><h4 class="font-bold text-red-450 mb-2 text-xs">Errors:</h4><div class="space-y-2">';
        content += result.errors.map(e => `<div class="text-xs text-red-350 bg-red-950/20 px-3 py-2 rounded border border-red-950/30">✕ ${e}</div>`).join('');
        content += '</div></div>';
      }

      if (result.warnings && result.warnings.length > 0) {
        content += '<div><h4 class="font-bold text-yellow-450 mb-2 text-xs">Warnings:</h4><div class="space-y-2">';
        content += result.warnings.map(w => `<div class="text-xs text-yellow-350 bg-yellow-950/20 px-3 py-2 rounded border border-yellow-950/30">⚠ ${w}</div>`).join('');
        content += '</div></div>';
      }

      if ((!result.errors || result.errors.length === 0) && (!result.warnings || result.warnings.length === 0)) {
        content += '<div class="text-center py-8 text-emerald-400 font-medium">✓ Configuration is valid! No errors or warnings found.</div>';
      }

      content += '</div>';

      createBuildTabModal('Validation Results', content);
    } catch (error) {
      alert('Validation failed: ' + error.message);
    }
  },

  async compareConfigs() {
    const textareasHtml = `
      <div class="space-y-4">
        <div>
          <label class="block text-[11px] text-text-muted mb-1 font-semibold">First Configuration</label>
          <textarea id="compare-textarea-1" placeholder="Paste first configuration..." class="w-full h-48 bg-surface border border-border rounded p-3 text-xs font-mono text-primary focus:border-purple-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label class="block text-[11px] text-text-muted mb-1 font-semibold">Second Configuration</label>
          <textarea id="compare-textarea-2" placeholder="Paste second configuration..." class="w-full h-48 bg-surface border border-border rounded p-3 text-xs font-mono text-primary focus:border-purple-500 focus:outline-none"></textarea>
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

    const exportBtn = document.getElementById('btn-export-rsc');
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
  },

  escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
