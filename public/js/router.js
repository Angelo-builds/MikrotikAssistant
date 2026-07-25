const Router = {
  init() {
    this.setupTabListeners();
    this.renderCurrentTab();
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
      if (btn.dataset.tab === tab) {
        btn.classList.add('bg-purple-600', 'active', 'text-white');
        btn.classList.remove('hover:bg-gray-700');
      } else {
        btn.classList.remove('bg-purple-600', 'active', 'text-white');
        btn.classList.add('hover:bg-gray-700');
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
      <div class="max-w-2xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Preferences</h2>
        <div class="bg-gray-800 rounded-lg p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">LLM Provider</label>
            <select id="pref-provider" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white">
              <option value="openrouter" ${AppState.preferences.llmProvider === 'openrouter' ? 'selected' : ''}>OpenRouter</option>
              <option value="openai" ${AppState.preferences.llmProvider === 'openai' ? 'selected' : ''}>OpenAI</option>
              <option value="ollama" ${AppState.preferences.llmProvider === 'ollama' ? 'selected' : ''}>Ollama (Local)</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">API Key</label>
            <input type="password" id="pref-apikey" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value="${AppState.preferences.apiKey || ''}">
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Model</label>
            <input type="text" id="pref-model" class="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white" value="${AppState.preferences.model || ''}">
          </div>
          <button id="btn-save-prefs" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition">Save Preferences</button>
        </div>
      </div>
    `;

    document.getElementById('btn-save-prefs').addEventListener('click', () => {
      AppState.preferences.llmProvider = document.getElementById('pref-provider').value;
      AppState.preferences.apiKey = document.getElementById('pref-apikey').value;
      AppState.preferences.model = document.getElementById('pref-model').value;
      AppState.save();
      alert('Preferences saved!');
    });
  }
};
