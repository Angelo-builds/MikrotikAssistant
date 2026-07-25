function createBuildTabModal(title, contentHtml, footerHtml = '') {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-apple-reveal';
  modal.innerHTML = `
    <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
      <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
        <h3 class="text-lg font-bold text-white">${title}</h3>
        <button class="btn-close text-gray-400 hover:text-white text-2xl transition-all duration-150 active:scale-95">✕</button>
      </div>
      <div class="p-6 overflow-y-auto flex-1 text-gray-200">
        ${contentHtml}
      </div>
      ${footerHtml ? `
      <div class="p-4 border-t border-gray-700 bg-gray-800/30 flex justify-end space-x-2">
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
      <div class="flex flex-col h-full">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 class="text-2xl font-bold">Configuration Builder</h2>
          <div class="flex flex-wrap gap-2">
            <button id="btn-generate-ai" class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">✨ AI Generate</button>
            <button id="btn-add-conditional" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">Add Conditional</button>
            <button id="btn-import-export" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">Import .rsc</button>
            <button id="btn-validate" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">Validate</button>
            <button id="btn-compare" class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">Compare</button>
            <button id="btn-save-library" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 active:scale-95">Save to Library</button>
            <button id="btn-export-rsc" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-150 active:scale-95">
              <span>💾</span>
              <span>Export .rsc</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4 flex-1 overflow-hidden">
          <!-- Column 1: Variables (3 cols) -->
          <div class="col-span-12 lg:col-span-3 bg-gray-800 rounded-lg border border-gray-700 flex flex-col overflow-hidden">
            <div class="p-3 border-b border-gray-700 bg-gray-800/50">
              <h3 class="font-bold text-sm text-purple-400">📊 Variables</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-4" id="variables-panel">
              <!-- Populated by JS -->
            </div>
          </div>

          <!-- Column 2: Blocks (5 cols) -->
          <div class="col-span-12 lg:col-span-5 bg-gray-800 rounded-lg border border-gray-700 flex flex-col overflow-hidden">
            <div class="p-3 border-b border-gray-700 bg-gray-800/50">
              <h3 class="font-bold text-sm text-blue-400">🧩 Configuration Blocks</h3>
            </div>
            <div class="flex-1 overflow-y-auto p-3 space-y-3" id="blocks-panel">
              <!-- Populated by JS -->
            </div>
          </div>

          <!-- Column 3: Live Preview (4 cols) -->
          <div class="col-span-12 lg:col-span-4 bg-gray-900 rounded-lg border border-gray-700 flex flex-col overflow-hidden">
            <div class="p-3 border-b border-gray-700 bg-gray-800/50 flex justify-between items-center">
              <h3 class="font-bold text-sm text-emerald-400">📝 Live Preview (.rsc)</h3>
              <span class="text-xs text-gray-500">Auto-updates</span>
            </div>
            <pre id="preview-output" class="flex-1 overflow-auto p-4 text-xs font-mono text-gray-300 whitespace-pre-wrap"></pre>
          </div>
        </div>
      </div>
    `;

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();
    this.setupListeners();
  },

  renderVariables() {
    const panel = document.getElementById('variables-panel');
    let html = '<div><h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Manual Inputs</h4><div class="space-y-2">';

    for (const [key, value] of Object.entries(BuilderEngine.state.variables)) {
      html += `
        <div>
          <label class="block text-xs text-gray-400 mb-1">${key}</label>
          <input type="text" data-var="${key}" value="${value}" class="var-input w-full bg-gray-900 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none">
        </div>
      `;
    }
    html += '</div></div>';

    html += '<div class="mt-4"><h4 class="text-xs font-bold text-gray-400 uppercase mb-2">Auto-Derived (Read Only)</h4><div class="space-y-2">';
    for (const [key, value] of Object.entries(BuilderEngine.state.derivedVariables)) {
      html += `
        <div>
          <label class="block text-xs text-gray-500 mb-1">${key}</label>
          <input type="text" value="${value}" disabled class="w-full bg-gray-900/50 border border-gray-700 rounded px-2 py-1.5 text-xs text-gray-500 cursor-not-allowed">
        </div>
      `;
    }
    html += '</div></div>';

    panel.innerHTML = html;
  },

  renderBlocks() {
    const panel = document.getElementById('blocks-panel');
    panel.innerHTML = BuilderEngine.state.blocks.map((block, index) => `
      <div class="bg-gray-900 border ${block.enabled ? 'border-purple-500/50' : 'border-gray-700'} rounded-lg overflow-hidden block-card relative pl-10" data-index="${index}" data-conditional="${block.isConditional ? 'true' : 'false'}" data-category="${block.category || ''}">
        <div class="flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700">
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="block-toggle rounded text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600" ${block.enabled ? 'checked' : ''} data-index="${index}">
            <span class="text-xs font-medium text-white">${block.name}</span>
            <span class="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">${block.category || 'general'}</span>
            ${block.isConditional ? '<span class="text-xs text-yellow-500 bg-yellow-900/30 px-2 py-0.5 rounded">Conditional</span>' : ''}
          </div>
          <div class="flex items-center space-x-2">
            <button class="btn-edit-block text-xs text-purple-400 hover:text-purple-300" data-index="${index}">Edit</button>
            <button class="btn-duplicate-block text-xs text-gray-400 hover:text-white" data-index="${index}">Duplicate</button>
            <button class="btn-remove-block text-xs text-gray-500 hover:text-red-400" data-index="${index}">Remove</button>
            <button class="toggle-content text-gray-400 hover:text-white text-xs ml-2">▼</button>
          </div>
        </div>
        <div class="block-content hidden p-2">
          <textarea class="block-editor w-full bg-gray-950 border border-gray-700 rounded p-2 text-xs font-mono text-gray-300 h-32 focus:border-blue-500 focus:outline-none resize-y" data-index="${index}">${block.content}</textarea>
        </div>
      </div>
    `).join('');

    // Initialize drag & drop
    setTimeout(() => {
      if (typeof BlockDragDrop !== 'undefined' && panel) {
        BlockDragDrop.init(panel);
      }
    }, 100);

    // Re-setup specific listeners for newly rendered blocks
    this.setupBlockListenersOnly();
  },

  setupBlockListenersOnly() {
    // Block toggles
    document.querySelectorAll('.block-toggle').forEach((checkbox) => {
      checkbox.addEventListener('change', (e) => {
        const index = parseInt(e.target.dataset.index);
        BuilderEngine.state.blocks[index].enabled = e.target.checked;
        this.renderBlocks();
        this.updatePreview();
      });
    });

    // Block content editors
    document.querySelectorAll('.block-editor').forEach((textarea) => {
      textarea.addEventListener('input', (e) => {
        const index = parseInt(e.target.dataset.index);
        BuilderEngine.state.blocks[index].content = e.target.value;
        this.updatePreview();
      });
    });

    // Toggle block content visibility
    document.querySelectorAll('.toggle-content').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const content = e.target.closest('.block-card').querySelector('.block-content');
        content.classList.toggle('hidden');
        e.target.textContent = content.classList.contains('hidden') ? '▼' : '▲';
      });
    });

    // Edit button (Monaco)
    document.querySelectorAll('.btn-edit-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.editBlock(index);
      });
    });

    // Duplicate button
    document.querySelectorAll('.btn-duplicate-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        const original = BuilderEngine.state.blocks[index];
        const copy = {
          ...original,
          id: `${original.id}-copy-${Date.now()}`,
          name: `${original.name} (Copy)`
        };
        BuilderEngine.state.blocks.splice(index + 1, 0, copy);
        this.renderBlocks();
        this.updatePreview();
      });
    });

    // Remove button
    document.querySelectorAll('.btn-remove-block').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        BuilderEngine.state.blocks.splice(index, 1);
        this.renderBlocks();
        this.updatePreview();
      });
    });
  },

  updatePreview() {
    const output = document.getElementById('preview-output');
    if (output) {
      output.textContent = BuilderEngine.renderFullConfig();
    }
  },

  setupListeners() {
    // Variable inputs
    document.querySelectorAll('.var-input').forEach(input => {
      input.addEventListener('input', (e) => {
        BuilderEngine.setVariable(e.target.dataset.var, e.target.value);
        this.renderVariables(); // Re-render to update derived
        this.updatePreview();
        // Re-bind listeners for new inputs to prevent loss of focus or event listeners
        this.setupVariableListenersOnly();
      });
    });

    // Save to Library button
    const saveLibBtn = document.getElementById('btn-save-library');
    if (saveLibBtn) {
      saveLibBtn.addEventListener('click', () => this.saveToLibrary());
    }

    // Export button
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

    // Import .rsc button
    const btnImport = document.getElementById('btn-import-export');
    if (btnImport) btnImport.addEventListener('click', () => this.importExport());

    // Validate button
    const btnValidate = document.getElementById('btn-validate');
    if (btnValidate) btnValidate.addEventListener('click', () => this.validateConfig());

    // Compare button
    const btnCompare = document.getElementById('btn-compare');
    if (btnCompare) btnCompare.addEventListener('click', () => this.compareConfigs());

    // AI Generate button
    const btnAiGenerate = document.getElementById('btn-generate-ai');
    if (btnAiGenerate) btnAiGenerate.addEventListener('click', () => this.generateBlockWithAI());

    // Add Conditional button
    const btnAddConditional = document.getElementById('btn-add-conditional');
    if (btnAddConditional) btnAddConditional.addEventListener('click', () => this.addConditionalBlock());
  },

  // Replace editBlock method with Monaco Editor integration
  async editBlock(index) {
    const block = BuilderEngine.state.blocks[index];

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
    modal.innerHTML = `
      <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
          <h3 class="text-lg font-bold text-white">Edit Block: ${block.name}</h3>
          <button class="btn-close text-gray-400 hover:text-white text-2xl">✕</button>
        </div>
        <div class="p-6 overflow-y-auto flex-1 flex flex-col">
          <div id="monaco-container" class="flex-1 min-h-[400px]"></div>
        </div>
        <div class="flex justify-end space-x-2 p-4 border-t border-gray-700 bg-gray-800/30">
          <button class="btn-cancel bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Cancel</button>
          <button class="btn-save bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Save Changes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeModal = () => {
      MonacoIntegration.dispose();
      modal.remove();
    };

    modal.querySelector('.btn-close').addEventListener('click', closeModal);
    modal.querySelector('.btn-cancel').addEventListener('click', closeModal);

    const container = modal.querySelector('#monaco-container');
    await MonacoIntegration.init(container, block.content);

    modal.querySelector('.btn-save').addEventListener('click', () => {
      const newContent = MonacoIntegration.getContent();
      BuilderEngine.state.blocks[index].content = newContent;
      closeModal();
      this.renderBlocks();
      this.updatePreview();
    });
  },

  // Add reorderBlock method
  reorderBlock(fromIndex, toIndex) {
    const block = BuilderEngine.state.blocks.splice(fromIndex, 1)[0];
    BuilderEngine.state.blocks.splice(toIndex, 0, block);
    this.renderBlocks();
    this.updatePreview();
  },

  // Add AI block generation method
  async generateBlockWithAI() {
    const description = prompt('Describe the block you want to generate (e.g., "WireGuard server with peer configuration"):');
    if (!description) return;

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8';
    modal.innerHTML = `
      <div class="bg-gray-800 border border-gray-700 rounded-lg max-w-2xl w-full p-6 shadow-2xl flex flex-col items-center justify-center">
        <h3 class="text-lg font-bold mb-4 text-white">Generating Block with AI...</h3>
        <div class="flex items-center space-x-2 text-gray-400">
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

  // Add conditional block support
  addConditionalBlock() {
    const condition = prompt('Enter condition (e.g., "RouterOS == 7" or "PPPoE == true"):');
    if (!condition) return;

    BuilderEngine.state.blocks.push({
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
  },

  setupVariableListenersOnly() {
    document.querySelectorAll('.var-input').forEach(input => {
      input.addEventListener('input', (e) => {
        // Save cursor position to prevent cursor jumping on input change
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;
        const focusedVar = e.target.dataset.var;

        BuilderEngine.setVariable(focusedVar, e.target.value);
        this.renderVariables();
        this.updatePreview();

        // Restore focus and cursor position
        const restoredInput = document.querySelector(`.var-input[data-var="${focusedVar}"]`);
        if (restoredInput) {
          restoredInput.focus();
          restoredInput.setSelectionRange(selectionStart, selectionEnd);
        }
        this.setupVariableListenersOnly();
      });
    });
  },

  applyPresetData(preset) {
    // Clear current variables
    BuilderEngine.state.variables = {};

    // Set preset variables
    Object.entries(preset.variables).forEach(([name, value]) => {
      BuilderEngine.setVariable(name, value);
    });

    // Reset blocks to default state based on preset
    BuilderEngine.loadDefaultBlocks();
    BuilderEngine.state.blocks.forEach(block => {
      block.enabled = preset.enabledBlocks.includes(block.id);
    });

    this.renderVariables();
    this.renderBlocks();
    this.updatePreview();

    // Show feedback
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
    // Create a new custom block with the audited config
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
    const textareaHtml = `<textarea id="import-textarea" placeholder="Paste your MikroTik .rsc export here..." class="w-full h-64 bg-gray-900 border border-gray-700 rounded p-3 text-xs font-mono text-gray-200 focus:border-purple-500 focus:outline-none"></textarea>`;
    const footerHtml = `
      <button class="btn-cancel bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-95 font-medium">Cancel</button>
      <button class="btn-parse bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-95 font-medium">Parse & Import</button>
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
          // Add parsed blocks
          result.blocks.forEach(block => {
            this.blocks.push(block);
          });

          // Add extracted variables
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
        content += '<div><h4 class="font-bold text-red-400 mb-2">Errors:</h4><div class="space-y-2">';
        content += result.errors.map(e => `<div class="text-sm text-red-300 bg-red-900/20 px-3 py-2 rounded border border-red-900/30">✕ ${e}</div>`).join('');
        content += '</div></div>';
      }

      if (result.warnings && result.warnings.length > 0) {
        content += '<div><h4 class="font-bold text-yellow-400 mb-2">Warnings:</h4><div class="space-y-2">';
        content += result.warnings.map(w => `<div class="text-sm text-yellow-300 bg-yellow-900/20 px-3 py-2 rounded border border-yellow-900/30">⚠ ${w}</div>`).join('');
        content += '</div></div>';
      }

      if ((!result.errors || result.errors.length === 0) && (!result.warnings || result.warnings.length === 0)) {
        content += '<div class="text-center py-8 text-green-400 font-medium">✓ Configuration is valid! No errors or warnings found.</div>';
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
          <label class="block text-xs text-gray-400 mb-1 font-semibold">First Configuration</label>
          <textarea id="compare-textarea-1" placeholder="Paste first configuration..." class="w-full h-48 bg-gray-900 border border-gray-700 rounded p-3 text-xs font-mono text-gray-200 focus:border-purple-500 focus:outline-none"></textarea>
        </div>
        <div>
          <label class="block text-xs text-gray-400 mb-1 font-semibold">Second Configuration</label>
          <textarea id="compare-textarea-2" placeholder="Paste second configuration..." class="w-full h-48 bg-gray-900 border border-gray-700 rounded p-3 text-xs font-mono text-gray-200 focus:border-purple-500 focus:outline-none"></textarea>
        </div>
        <div id="diff-result" class="mt-4"></div>
      </div>
    `;
    const footerHtml = `
      <button class="btn-cancel bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-95 font-medium">Cancel</button>
      <button class="btn-compare bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all duration-150 active:scale-95 font-medium">Compare</button>
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
  }
};