const AppState = {
  currentTab: 'audit',
  sessions: [],
  currentSession: null,
  theme: 'dark', // 'dark' | 'light'
  sessionApiKey: '',
  preferences: {
    llmProvider: 'openrouter',
    useBackendEnv: false,
    model: 'meta-llama/llama-3-8b-instruct:free',
    privacyShields: {
      maskIPs: true,
      maskMACs: true,
      maskSecrets: true,
      maskInterfaces: true,
      maskDomains: true,
      maskIdentity: true
    }
  },

  init() {
    this.loadFromStorage();
    this.initTheme();
  },

  loadFromStorage() {
    const saved = localStorage.getItem('mikrotik-assistant-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.preferences = { ...this.preferences, ...parsed.preferences };

        // Secure Ephemeral Migration: Check for legacy key in localStorage
        if (this.preferences.apiKey) {
          this.sessionApiKey = this.preferences.apiKey;
          delete this.preferences.apiKey;
          setTimeout(() => this.save(), 50); // Save state without the legacy apiKey
        }

        if (parsed.currentTab) {
          this.currentTab = parsed.currentTab;
        }
      } catch (e) {
        console.error('Failed to parse app state:', e);
      }
    }
  },

  initTheme() {
    let savedTheme = localStorage.getItem('mikrotik-assistant-theme') || 'system';
    this.setTheme(savedTheme);

    // Watch system changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
        if (this.theme === 'system') {
          this.applyThemeToDOM();
        }
      });
    }
  },

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem('mikrotik-assistant-theme', theme);
    this.applyThemeToDOM();
    this.save();
  },

  applyThemeToDOM() {
    let resolvedTheme = this.theme;
    if (this.theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        resolvedTheme = 'light';
      } else {
        resolvedTheme = 'dark';
      }
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme);

    // Update Monaco editor dynamically if defined
    if (typeof monaco !== 'undefined' && monaco.editor) {
      const monacoTheme = resolvedTheme === 'light' ? 'vs' : 'mikrotik-dark';
      monaco.editor.setTheme(monacoTheme);
    }
  },

  toggleTheme() {
    const nextTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(nextTheme);
  },

  save() {
    // Under no circumstances should the API key be written to localStorage
    const savedPrefs = { ...this.preferences };
    delete savedPrefs.apiKey; // Explicit guard
    localStorage.setItem('mikrotik-assistant-state', JSON.stringify({
      preferences: savedPrefs,
      currentTab: this.currentTab
    }));
  },

  setCurrentTab(tab) {
    this.currentTab = tab;
    this.save();
  }
};

AppState.init();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppState;
}
