const Router = {
  init() {
    this.setupTabListeners();
    this.renderCurrentTab();
    this.setupGlobalShortcuts();
  },

  setupTabListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        AppState.setCurrentTab(tab);
        this.renderCurrentTab();
        this.updateActiveTab(tab);
      });
    });
  },

  updateActiveTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      const parent = btn;
      const icon = btn.querySelector('i');
      if (btn.dataset.tab === tab) {
        parent.className = 'nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md bg-elevated text-indigo-400 font-semibold text-xs transition';
        if (icon) {
          icon.className = icon.className.replace('text-zinc-400', 'text-indigo-400');
        }
      } else {
        parent.className = 'nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-elevated text-zinc-400 text-xs font-medium transition';
        if (icon) {
          icon.className = icon.className.replace('text-indigo-400', 'text-zinc-400');
        }
      }
    });
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  renderCurrentTab() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.innerHTML = '';

    switch (AppState.currentTab) {
      case 'audit':
        AuditTab.render(mainContent);
        break;
      case 'build':
        BuildTab.render(mainContent);
        break;
      case 'lib':
        LibTab.render(mainContent);
        break;
      case 'prefs':
        this.renderPreferences(mainContent);
        break;
    }
  },

  renderPreferences(container) {
    container.innerHTML = `
      <div class="max-w-md mx-auto space-y-3 select-none animate-apple-reveal font-sans text-xs">
        <h2 class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
          ${UI_Icons.render('settings', 'mr-1.5 text-purple-500 w-3.5 h-3.5')}
          Preferences
        </h2>

        <div class="space-y-2">
          <!-- Section Theme (Expanded by default) -->
          <div class="border border-border rounded-md bg-surface overflow-hidden">
            <button class="section-toggle w-full px-3 py-1.5 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none" data-section="theme">
              <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
                ${UI_Icons.render('sun', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
                Theme Preferences
              </span>
              <span class="chevron-theme text-zinc-500">
                ${UI_Icons.render('chevron-down', 'w-3.5 h-3.5')}
              </span>
            </button>
            <div id="section-content-theme" class="p-3 space-y-3 border-t border-border text-xs text-zinc-300">
              <div>
                <label class="block text-[9px] font-bold text-zinc-500 uppercase mb-1">App Theme</label>
                <select id="pref-theme" class="w-full h-7 bg-app border border-border rounded px-2.5 text-xs text-primary focus:outline-none focus:border-purple-500 transition-colors">
                  <option value="dark" ${AppState.theme === 'dark' ? 'selected' : ''}>Dark (Default)</option>
                  <option value="light" ${AppState.theme === 'light' ? 'selected' : ''}>Light</option>
                  <option value="system" ${AppState.theme === 'system' ? 'selected' : ''}>System Preference</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 1: AI Provider (Expanded by default) -->
          <div class="border border-border rounded-md bg-surface overflow-hidden">
            <button class="section-toggle w-full px-3 py-1.5 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none" data-section="ai">
              <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
                ${UI_Icons.render('activity', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
                AI Provider Settings
              </span>
              <span class="chevron-ai text-zinc-500">
                ${UI_Icons.render('chevron-down', 'w-3.5 h-3.5')}
              </span>
            </button>
            <div id="section-content-ai" class="p-3 space-y-3 border-t border-border text-xs text-zinc-300">
              <div>
                <label class="block text-[9px] font-bold text-zinc-500 uppercase mb-1">LLM Provider</label>
                <select id="pref-provider" class="w-full h-7 bg-app border border-border rounded px-2.5 text-xs text-primary focus:outline-none focus:border-purple-500 transition-colors">
                  <option value="openrouter" ${AppState.preferences.llmProvider === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
                  <option value="openai" ${AppState.preferences.llmProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                  <option value="ollama" ${AppState.preferences.llmProvider === 'ollama' ? 'selected' : ''}>Ollama (Local)</option>
                </select>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[9px] font-bold text-zinc-500 uppercase">API Key</label>
                  <label class="flex items-center space-x-1 cursor-pointer select-none text-[9px] font-bold text-zinc-500 uppercase">
                    <input type="checkbox" id="pref-use-backend-env" ${AppState.preferences.useBackendEnv ? 'checked' : ''} class="w-3 h-3 text-purple-600 bg-app border-border rounded focus:ring-purple-500">
                    <span>Use Backend Env</span>
                  </label>
                </div>
                <input type="password" id="pref-apikey" autocomplete="current-password" class="w-full h-7 bg-app border border-border rounded px-2.5 text-xs text-primary placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors" value="${AppState.sessionApiKey || ''}">
              </div>
              <div>
                <label class="block text-[9px] font-bold text-zinc-500 uppercase mb-1">Model</label>
                <input type="text" id="pref-model" class="w-full h-7 bg-app border border-border rounded px-2.5 text-xs text-primary placeholder-zinc-600 focus:outline-none focus:border-purple-500 transition-colors" value="${AppState.preferences.model || ''}">
              </div>
            </div>
          </div>

          <!-- Section 2: Privacy Shields (Collapsed by default) -->
          <div class="border border-border rounded-md bg-surface overflow-hidden">
            <button class="section-toggle w-full px-3 py-1.5 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none" data-section="privacy">
              <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
                ${UI_Icons.render('shield-check', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
                Privacy Shield Controls
              </span>
              <span class="chevron-privacy text-zinc-500">
                ${UI_Icons.render('chevron-right', 'w-3.5 h-3.5')}
              </span>
            </button>
            <div id="section-content-privacy" class="p-3 space-y-2 border-t border-border text-xs text-zinc-300 hidden">
              <div class="space-y-2">
                <label class="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input type="checkbox" id="mask-ips" ${AppState.preferences.privacyShields?.maskIPs ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask IP Addresses</span>
                </label>
                <label class="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input type="checkbox" id="mask-macs" ${AppState.preferences.privacyShields?.maskMACs ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask MAC Addresses</span>
                </label>
                <label class="flex items-center space-x-2.5 cursor-pointer select-none">
                  <input type="checkbox" id="mask-secrets" ${AppState.preferences.privacyShields?.maskSecrets ? 'checked' : ''} class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask Secrets & Passwords</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Section 3: Data Management (Collapsed by default) -->
          <div class="border border-border rounded-md bg-surface overflow-hidden">
            <button class="section-toggle w-full px-3 py-1.5 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none" data-section="data">
              <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
                ${UI_Icons.render('database', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
                📦 Export & Import
              </span>
              <span class="chevron-data text-zinc-500">
                ${UI_Icons.render('chevron-right', 'w-3.5 h-3.5')}
              </span>
            </button>
            <div id="section-content-data" class="p-3 space-y-3 border-t border-border text-xs text-zinc-300 hidden">
              <div class="grid grid-cols-2 gap-3 mb-2">
                <button id="btn-export-all" class="btn-secondary text-[11px] h-8 flex items-center justify-center">
                  ${UI_Icons.render('download', 'w-3 h-3 mr-1')} Export All Data
                </button>
                <button id="btn-export-custom" class="btn-secondary text-[11px] h-8 flex items-center justify-center">
                  ${UI_Icons.render('settings', 'w-3 h-3 mr-1')} Custom Export
                </button>
                <button id="btn-import" class="btn-primary text-[11px] h-8 flex items-center justify-center col-span-2">
                  ${UI_Icons.render('upload', 'w-3 h-3 mr-1')} Import Data
                </button>
              </div>
              <input type="file" id="import-file-input" class="hidden" accept=".json">
              <p class="text-[10px] text-zinc-500">Export includes chat history, build projects, and custom blocks. Max recommended size: 10MB.</p>
            </div>
          </div>
        </div>

        <!-- Save Button sticky footer/bottom bar -->
        <div class="pt-3 flex items-center justify-between border-t border-border">
          <span class="text-[10px] text-zinc-500 font-mono">Press Cmd+S / Ctrl+S to save</span>
          <button id="btn-save-prefs" class="bg-purple-600 hover:bg-purple-700 text-white h-7 px-3 rounded-md text-xs font-medium flex items-center justify-center transition active:scale-95">
            ${UI_Icons.render('lock', 'w-3 h-3 mr-1.5')}
            Save Preferences
          </button>
        </div>

        <!-- GitHub Link Section -->
        <div class="pt-3 border-t border-border-subtle">
          <a href="https://github.com/Angelo-builds/MikrotikAssistant"
             target="_blank"
             class="flex items-center justify-center space-x-2 text-xs text-zinc-500 hover:text-indigo-400 transition py-2">
            ${UI_Icons.render('github', 'w-4 h-4')}
            <span>View on GitHub</span>
          </a>
        </div>
      </div>
    `;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Wiring Preferences Collapsible Sections Toggle Buttons
    container.querySelectorAll('.section-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const sect = btn.dataset.section;
        const target = container.querySelector(`#section-content-${sect}`);
        const chevron = btn.querySelector(`.chevron-${sect}`);

        if (target.classList.contains('hidden')) {
          target.classList.remove('hidden');
          chevron.innerHTML = UI_Icons.render('chevron-down', 'w-3.5 h-3.5');
        } else {
          target.classList.add('hidden');
          chevron.innerHTML = UI_Icons.render('chevron-right', 'w-3.5 h-3.5');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });

    const apiKeyInput = document.getElementById('pref-apikey');
    const useBackendCheckbox = document.getElementById('pref-use-backend-env');

    const updateApiKeyInputState = () => {
      if (useBackendCheckbox.checked) {
        apiKeyInput.disabled = true;
        apiKeyInput.value = '';
        apiKeyInput.placeholder = 'Using Backend Environment Variable';
        apiKeyInput.classList.add('opacity-50');
      } else {
        apiKeyInput.disabled = false;
        apiKeyInput.placeholder = 'Enter API Key...';
        apiKeyInput.classList.remove('opacity-50');
      }
    };

    useBackendCheckbox.addEventListener('change', updateApiKeyInputState);
    updateApiKeyInputState();

    const themeSelect = document.getElementById('pref-theme');
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        AppState.setTheme(e.target.value);
        if (typeof showGlobalToast === 'function') {
          showGlobalToast(`Theme updated to ${e.target.value}!`, 'success');
        }
      });
    }

    // Data management setup
    const btnExportAll = document.getElementById('btn-export-all');
    if (btnExportAll) {
      btnExportAll.addEventListener('click', async () => {
        if (typeof ExportImport !== 'undefined') {
          await ExportImport.exportData({
            includeChats: true,
            includeBuilds: true,
            includeBlocks: true,
            includePreferences: true
          });
        }
      });
    }

    const btnExportCustom = document.getElementById('btn-export-custom');
    if (btnExportCustom) {
      btnExportCustom.addEventListener('click', async () => {
        if (typeof ExportImport !== 'undefined') {
          const chats = await ExportImport.getChatHistory();
          const builds = await ExportImport.getBuildProjects();
          const blocks = await ExportImport.getCustomBlocks();

          const modalHtml = `
            <div class="space-y-3 font-sans text-xs text-secondary select-none">
              <p class="text-xs text-zinc-400 mb-3">Select the data you want to include in your export:</p>
              <div class="space-y-2">
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" id="custom-export-chats" checked class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500">
                  <span class="text-xs text-primary font-medium">Chat History (${chats.length} sessions)</span>
                </label>
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" id="custom-export-builds" checked class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500">
                  <span class="text-xs text-primary font-medium">Build Projects (${builds.length} projects)</span>
                </label>
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" id="custom-export-blocks" checked class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500">
                  <span class="text-xs text-primary font-medium">Custom Blocks / Library (${blocks.length} blocks)</span>
                </label>
                <label class="flex items-center space-x-2.5 cursor-pointer">
                  <input type="checkbox" id="custom-export-prefs" class="w-3.5 h-3.5 text-purple-600 bg-app border-border rounded focus:ring-purple-500">
                  <span class="text-xs text-primary font-medium">Preferences</span>
                </label>
              </div>
            </div>
          `;

          const footerHtml = `
            <button class="btn-cancel bg-transparent text-primary border border-border hover:bg-white/5 px-4 py-2 rounded-md text-xs font-medium">Cancel</button>
            <button class="btn-confirm bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-xs font-medium">Export Selected</button>
          `;

          const modalContainer = document.createElement('div');
          modalContainer.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 animate-apple-reveal';
          modalContainer.innerHTML = `
            <div class="bg-surface border border-border rounded-lg max-w-md w-full overflow-hidden flex flex-col shadow-2xl">
              <div class="flex items-center justify-between p-4 border-b border-border bg-surface-elevated">
                <h3 class="text-sm font-semibold text-zinc-100">Custom Export</h3>
                <button class="btn-close text-secondary hover:text-zinc-100 text-xl">✕</button>
              </div>
              <div class="p-6 flex-1">
                ${modalHtml}
              </div>
              <div class="p-4 border-t border-border bg-surface-elevated/30 flex justify-end space-x-2">
                ${footerHtml}
              </div>
            </div>
          `;
          document.body.appendChild(modalContainer);

          const closeModal = () => modalContainer.remove();
          modalContainer.querySelector('.btn-close').addEventListener('click', closeModal);
          modalContainer.querySelector('.btn-cancel').addEventListener('click', closeModal);
          modalContainer.querySelector('.btn-confirm').addEventListener('click', async () => {
            const includeChats = modalContainer.querySelector('#custom-export-chats').checked;
            const includeBuilds = modalContainer.querySelector('#custom-export-builds').checked;
            const includeBlocks = modalContainer.querySelector('#custom-export-blocks').checked;
            const includePreferences = modalContainer.querySelector('#custom-export-prefs').checked;

            closeModal();
            await ExportImport.exportData({
              includeChats,
              includeBuilds,
              includeBlocks,
              includePreferences
            });
          });
        }
      });
    }

    const btnImport = document.getElementById('btn-import');
    const importFileInput = document.getElementById('import-file-input');
    if (btnImport && importFileInput) {
      btnImport.addEventListener('click', () => {
        importFileInput.click();
      });

      importFileInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (typeof ExportImport !== 'undefined') {
          try {
            await ExportImport.importData(file);
            location.reload();
          } catch (err) {
            if (typeof showGlobalToast === 'function') {
              showGlobalToast(`Import failed: ${err.message}`, 'error');
            } else {
              alert(`Import failed: ${err.message}`);
            }
          }
        }
      });
    }

    document.getElementById('btn-save-prefs').addEventListener('click', () => {
      this.executeSave();
    });
  },

  executeSave() {
    const providerEl = document.getElementById('pref-provider');
    const apikeyEl = document.getElementById('pref-apikey');
    const modelEl = document.getElementById('pref-model');
    const maskIpsEl = document.getElementById('mask-ips');
    const maskMacsEl = document.getElementById('mask-macs');
    const maskSecretsEl = document.getElementById('mask-secrets');
    const useBackendEnvEl = document.getElementById('pref-use-backend-env');

    if (!providerEl) return; // Not on preferences screen active rendering right now

    AppState.preferences.llmProvider = providerEl.value;
    AppState.preferences.useBackendEnv = useBackendEnvEl.checked;
    AppState.sessionApiKey = useBackendEnvEl.checked ? '' : apikeyEl.value;
    AppState.preferences.model = modelEl.value;
    AppState.preferences.privacyShields.maskIPs = maskIpsEl.checked;
    AppState.preferences.privacyShields.maskMACs = maskMacsEl.checked;
    AppState.preferences.privacyShields.maskSecrets = maskSecretsEl.checked;
    AppState.save();

    // Spawn non-intrusive toast notification badge
    if (typeof window.showGlobalToast === 'function') {
      window.showGlobalToast('Preferences successfully updated & saved!', 'success');
    } else {
      alert('Preferences saved successfully!');
    }
  },

  setupGlobalShortcuts() {
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const saveBtn = document.getElementById('btn-save-prefs');
        if (saveBtn) {
          this.executeSave();
        }
      }
    });
  }
};
