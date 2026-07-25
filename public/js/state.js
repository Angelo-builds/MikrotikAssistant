const AppState = {
  currentTab: 'audit',
  sessions: [],
  currentSession: null,
  preferences: {
    llmProvider: 'openrouter',
    apiKey: '',
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
  },

  loadFromStorage() {
    const saved = localStorage.getItem('mikrotik-assistant-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.preferences = { ...this.preferences, ...parsed.preferences };
        if (parsed.currentTab) {
          this.currentTab = parsed.currentTab;
        }
      } catch (e) {
        console.error('Failed to parse app state:', e);
      }
    }
  },

  save() {
    localStorage.setItem('mikrotik-assistant-state', JSON.stringify({
      preferences: this.preferences,
      currentTab: this.currentTab
    }));
  },

  setCurrentTab(tab) {
    this.currentTab = tab;
    this.save();
  }
};

AppState.init();
