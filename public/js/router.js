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
      if (btn.dataset.tab === tab) {
        parent.className = 'tab-btn w-full text-left h-9 px-3 rounded-md bg-purple-600/10 text-purple-400 border-l-2 border-purple-500 text-xs font-semibold flex items-center transition-all';
      } else {
        parent.className = 'tab-btn w-full text-left h-9 px-3 rounded-md hover:bg-white/5 text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent';
      }
    });
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
      <div class="max-w-2xl mx-auto space-y-6 select-none animate-apple-reveal">
        <h2 class="text-lg font-bold text-primary flex items-center">
          ${UI_Icons.render('settings', 'mr-2 text-purple-500 w-5 h-5')}
          Preferences
        </h2>

        <div class="space-y-4">
          <!-- Section 1: AI Provider (Expanded by default) -->
          <div class="border border-border rounded-lg bg-surface overflow-hidden">
            <button class="section-toggle w-full px-4 py-3 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition-colors text-left" data-section="ai">
              <span class="text-xs font-semibold text-primary flex items-center">
                ${UI_Icons.render('activity', 'mr-2 w-4 h-4 text-purple-500')}
                AI Provider Settings
              </span>
              <span class="chevron-ai text-secondary">
                ${UI_Icons.render('chevron-down', 'w-4 h-4')}
              </span>
            </button>
            <div id="section-content-ai" class="p-4 space-y-4 border-t border-border text-xs text-secondary">
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase mb-1.5">LLM Provider</label>
                <select id="pref-provider" class="w-full h-8 bg-surface border border-border rounded px-3 text-xs text-primary focus:outline-none focus:border-purple-500 transition-colors">
                  <option value="openrouter" ${AppState.preferences.llmProvider === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
                  <option value="openai" ${AppState.preferences.llmProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
                  <option value="ollama" ${AppState.preferences.llmProvider === 'ollama' ? 'selected' : ''}>Ollama (Local)</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase mb-1.5">API Key</label>
                <input type="password" id="pref-apikey" class="w-full h-8 bg-surface border border-border rounded px-3 text-xs text-primary placeholder-text-muted focus:outline-none focus:border-purple-500 transition-colors" value="${AppState.preferences.apiKey || ''}">
              </div>
              <div>
                <label class="block text-[11px] font-bold text-text-muted uppercase mb-1.5">Model</label>
                <input type="text" id="pref-model" class="w-full h-8 bg-surface border border-border rounded px-3 text-xs text-primary placeholder-text-muted focus:outline-none focus:border-purple-500 transition-colors" value="${AppState.preferences.model || ''}">
              </div>
            </div>
          </div>

          <!-- Section 2: Privacy Shields (Collapsed by default) -->
          <div class="border border-border rounded-lg bg-surface overflow-hidden">
            <button class="section-toggle w-full px-4 py-3 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition-colors text-left" data-section="privacy">
              <span class="text-xs font-semibold text-primary flex items-center">
                ${UI_Icons.render('shield-check', 'mr-2 w-4 h-4 text-purple-500')}
                Privacy Shield Controls
              </span>
              <span class="chevron-privacy text-secondary">
                ${UI_Icons.render('chevron-right', 'w-4 h-4')}
              </span>
            </button>
            <div id="section-content-privacy" class="p-4 space-y-4 border-t border-border text-xs text-secondary hidden">
              <div class="space-y-3">
                <label class="flex items-center space-x-3 cursor-pointer select-none">
                  <input type="checkbox" id="mask-ips" ${AppState.preferences.privacyShields?.maskIPs ? 'checked' : ''} class="w-4 h-4 text-purple-600 bg-surface border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask IP Addresses</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer select-none">
                  <input type="checkbox" id="mask-macs" ${AppState.preferences.privacyShields?.maskMACs ? 'checked' : ''} class="w-4 h-4 text-purple-600 bg-surface border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask MAC Addresses</span>
                </label>
                <label class="flex items-center space-x-3 cursor-pointer select-none">
                  <input type="checkbox" id="mask-secrets" ${AppState.preferences.privacyShields?.maskSecrets ? 'checked' : ''} class="w-4 h-4 text-purple-600 bg-surface border-border rounded focus:ring-purple-500 focus:ring-1 focus:ring-offset-0">
                  <span class="text-xs text-primary font-medium">Mask Secrets & Passwords</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button sticky footer/bottom bar -->
        <div class="pt-4 flex items-center justify-between border-t border-border">
          <span class="text-[11px] text-text-muted font-mono">Press Cmd+S or Ctrl+S to save instantly</span>
          <button id="btn-save-prefs" class="inline-flex items-center h-8 px-4 rounded-md bg-purple-600 hover:bg-purple-700 text-xs text-white font-medium active:scale-95 transition-all duration-150">
            ${UI_Icons.render('lock', 'w-3.5 h-3.5 mr-1.5')}
            Save Preferences
          </button>
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
          chevron.innerHTML = UI_Icons.render('chevron-down', 'w-4 h-4');
        } else {
          target.classList.add('hidden');
          chevron.innerHTML = UI_Icons.render('chevron-right', 'w-4 h-4');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    });

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

    if (!providerEl) return; // Not on preferences screen active rendering right now

    AppState.preferences.llmProvider = providerEl.value;
    AppState.preferences.apiKey = apikeyEl.value;
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
