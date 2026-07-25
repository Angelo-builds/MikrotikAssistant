const BuildTab = {
  render(container) {
    container.innerHTML = `
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Configuration Builder</h2>
          <div class="flex space-x-2">
            <button id="btn-save-library" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm"> Save to Library</button>
            <button id="btn-export-rsc" class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
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
      <div class="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden block-card" data-index="${index}">
        <div class="flex items-center justify-between p-2 bg-gray-800/50 border-b border-gray-700">
          <div class="flex items-center space-x-2">
            <input type="checkbox" class="block-toggle rounded text-purple-600 focus:ring-purple-500 bg-gray-700 border-gray-600" ${block.enabled ? 'checked' : ''}>
            <span class="text-xs font-medium text-white">${block.name}</span>
          </div>
          <button class="toggle-content text-gray-400 hover:text-white text-xs">▼</button>
        </div>
        <div class="block-content hidden p-2">
          <textarea class="block-editor w-full bg-gray-950 border border-gray-700 rounded p-2 text-xs font-mono text-gray-300 h-32 focus:border-blue-500 focus:outline-none resize-y">${block.content}</textarea>
        </div>
      </div>
    `).join('');
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

    // Block toggles
    document.querySelectorAll('.block-toggle').forEach((checkbox, index) => {
      checkbox.addEventListener('change', (e) => {
        BuilderEngine.state.blocks[index].enabled = e.target.checked;
        this.updatePreview();
      });
    });

    // Block content editors
    document.querySelectorAll('.block-editor').forEach((textarea, index) => {
      textarea.addEventListener('input', (e) => {
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
  }
};
