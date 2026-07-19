// Mik the Winbox Wizard — Modernized Production-Ready Chat & Audit Assistant
// Built with robust architectural patterns, reactive state management, and optimized accessibility.

/**
 * ============================================================================
 * STATE MANAGEMENT (WizardState)
 * ============================================================================
 */
class WizardState {
  constructor() {
    this._subscribers = [];
    this._state = {
      diffMode: 'split',        // 'split' | 'unified'
      commandMode: 'checklist', // 'checklist' | 'raw'
      language: 'auto',         // 'auto' | 'en' | 'it'
      theme: 'dark',            // 'dark' | 'light'
      currentChatId: null,
      settings: {
        provider: 'openai',
        model: 'gpt-4o-mini',
        apiKey: '',
        baseUrl: '',
        prompt: '',
        maskIPs: true,
        maskMACs: true,
        maskSecrets: true,
        maskInterfaces: true,
        maskDomains: true,
        maskIdentity: true
      },
      analysisResult: null,
      pastedConfigRaw: '',
      history: [],
      currentFile: null,
      isAttachmentDrawerOpen: false,
      isSidebarOpen: true,
      activeSidebarTab: 'history'
    };

    this.loadFromStorage();
  }

  get(key) {
    return this._state[key];
  }

  set(key, value) {
    const prev = this._state[key];
    this._state[key] = value;
    if (JSON.stringify(prev) !== JSON.stringify(value)) {
      this._notify(key, value, prev);
    }
  }

  // Reactive Subscription Pattern
  subscribe(key, callback) {
    this._subscribers.push({ key, callback });
  }

  _notify(key, value, prevValue) {
    this._subscribers.forEach(sub => {
      if (sub.key === key || sub.key === '*') {
        sub.callback(value, prevValue, key);
      }
    });
  }

  loadFromStorage() {
    // Load Settings
    const savedSettings = localStorage.getItem('mikrotik_chatbot_settings');
    if (savedSettings) {
      try {
        this._state.settings = { ...this._state.settings, ...JSON.parse(savedSettings) };
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    } else {
      this.updateModelDefaults(this._state.settings.provider);
    }

    // Load Language
    const savedLang = localStorage.getItem('mikrotik_chatbot_language');
    this._state.language = savedLang || 'auto';

    // Load Theme
    const savedTheme = localStorage.getItem('mikrotik_chatbot_theme');
    this._state.theme = savedTheme || 'dark';

    // Load Session History
    const savedHistory = localStorage.getItem('mikrotik_chatbot_history');
    if (savedHistory) {
      try {
        this._state.history = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }
  }

  saveSettings(newSettings) {
    this._state.settings = { ...this._state.settings, ...newSettings };
    localStorage.setItem('mikrotik_chatbot_settings', JSON.stringify(this._state.settings));
    this._notify('settings', this._state.settings);
  }

  saveLanguage(lang) {
    this._state.language = lang;
    localStorage.setItem('mikrotik_chatbot_language', lang);
    this._notify('language', lang);
  }

  saveTheme(theme) {
    this._state.theme = theme;
    localStorage.setItem('mikrotik_chatbot_theme', theme);
    this._notify('theme', theme);
  }

  updateModelDefaults(provider) {
    let model = '';
    let baseUrl = '';
    switch (provider) {
      case 'openai':
        model = 'gpt-4o-mini';
        break;
      case 'anthropic':
        model = 'claude-3-5-sonnet-20240620';
        break;
      case 'openrouter':
        model = 'meta-llama/llama-3-8b-instruct:free';
        break;
      case 'ollama':
        model = 'llama3';
        baseUrl = 'http://localhost:11434';
        break;
      case 'custom':
        model = '';
        baseUrl = 'http://localhost:11434';
        break;
    }
    this._state.settings.model = model;
    this._state.settings.baseUrl = baseUrl;
  }
}

// Instantiate Global App State Single Source of Truth
const stateStore = new WizardState();

/**
 * ============================================================================
 * TOAST NOTIFICATION SERVICE (ToastService)
 * ============================================================================
 */
class ToastService {
  static show(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto select-text';

    if (type === 'success') {
      toast.className += ' bg-emerald-950/90 border-emerald-500/30 text-emerald-300 shadow-emerald-glow';
      toast.innerHTML = `<span>🟢</span> <span class="text-xs font-semibold">${message}</span>`;
    } else if (type === 'error') {
      toast.className += ' bg-red-950/90 border-red-500/30 text-red-300';
      toast.innerHTML = `<span>🔴</span> <span class="text-xs font-semibold">${message}</span>`;
    } else {
      toast.className += ' bg-slate-900/95 border-slate-800 text-slate-300';
      toast.innerHTML = `<span>🔵</span> <span class="text-xs font-semibold">${message}</span>`;
    }

    container.appendChild(toast);

    // Trigger Slide-up / Fade-in Reveal
    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    // Auto Dismiss Toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global short-hand helper compatible with legacy calls
const showToast = (msg, type) => ToastService.show(msg, type);

/**
 * ============================================================================
 * LOCALIZATION & TRANSLATION SERVICE (LocalizationService)
 * ============================================================================
 */
const i18n = {
  en: {
    title: 'Mik the Winbox Wizard — MikroTik Privacy AI Chatbot Assistant',
    headerTitle: 'Mik the Winbox Wizard',
    headerBadge: "Mik's Privacy Shield Active",
    headerDesc: 'RouterOS Configuration Auditor & Safe Correction Suite',
    newChat: 'New Chat',
    tooltipAudit: 'New Chat',
    tooltipHistory: 'Audit History',
    tooltipUpload: 'Upload File',
    tooltipHelp: 'Wizard Assistance',
    historyTitle: 'Session History',
    clearHistory: 'Wipe All',
    searchHistoryPlaceholder: 'Search saved audits...',
    historyEmpty: 'No audits saved in this session yet.',
    pasteConfigLabel: 'RouterOS Config or Log Export',
    quickFirewall: 'Firewall Audit',
    quickRouting: 'Gateway & DNS',
    clearLabel: 'Clear',
    pastedConfigPlaceholder: '# Paste a .rsc export configuration here... (All IP/MAC/secrets will be masked locally before sending to AI, and restored instantly!)',
    dragTitle: 'Drop RouterOS Configuration File',
    dragDesc: 'Accepts .rsc, .txt, or .log exports',
    chatMessageLabel: 'Explain the Problem / Task Description',
    chatMessagePlaceholder: "Describe the issue (e.g., 'Ospf isn't establishing peer' or 'Check if WAN ports are secure')",
    privacyDefault: 'Toggles configuration in Settings',
    privacyActiveLabel: '🛡️ Privacy Guard: {count}/6 Shields Active',
    submitBtn: 'Analyze & Correct',
    submitBtnLoading: 'Analyzing...',
    tabExplanation: 'Explanation',
    tabDiff: 'Configuration Diff',
    tabCommands: 'Fix Commands',
    diffModeSplit: 'Split',
    diffModeUnified: 'Unified',
    commandModeChecklist: 'Checklist',
    commandModeRaw: 'Raw Terminal',
    copyBtn: 'Copy Content',
    copiedText: 'Copied!',
    welcomeTitle: 'Mik the Winbox Wizard is Ready to Cast Spells!',
    welcomeDesc: 'Configure your LLM provider in settings, paste your RouterOS `/export` config or log files, explain your problem, and let <strong class="text-brand-400">Mik</strong> audit your network config.',
    welcomePrivacy: "🛡️ Fully Privacy Guarded: Mik's Privacy Shield ensures your passwords, IPs, MACs, custom interface names, and identities never leave this machine.",
    diffOriginalHeader: 'Original Config (Redacted Display)',
    diffCorrectedHeader: 'Corrected Config (Fully Restored)',
    diffUnifiedDesc: 'Unified Diff Legend: <span class="text-red-400">Red Line = Original</span> | <span class="text-cyber-emerald">Green Line = Corrected</span>',
    commandsTip: 'These are RouterOS terminal commands. Paste them directly into your MikroTik CLI window to apply the fix.',
    commandsChecklistEmpty: '<div class="text-center py-12 text-slate-500 text-xs">No terminal commands generated for this analysis.</div>',
    commandsRawEmpty: '# Commands will appear here after analysis...',
    commandsRawNoNeed: '# No specific terminal commands needed for this fix.',
    loaderTitle: "Mik's Privacy Shield Active",
    loaderStep1Title: 'Redact & Mask Private Context',
    loaderStep1DescActive: 'Scanning configuration for secrets & private subnets...',
    loaderStep1DescPending: 'Awaiting previous step...',
    loaderStep1DescComplete: 'Shield locked! Replaced private IPs, passwords, and custom identities locally.',
    loaderStep2Title: 'AI Audit in Safe Sandbox',
    loaderStep2DescActive: 'Sending redacted instructions to secure sandbox...',
    loaderStep2DescPending: 'Awaiting previous step...',
    loaderStep2DescComplete: 'Audit successfully compiled by LLM provider.',
    loaderStep3Title: 'De-anonymize Original Records',
    loaderStep3DescActive: 'Rebuilding config mapping: Replacing placeholders with secure originals...',
    loaderStep3DescPending: 'Awaiting previous step...',
    loaderStep3DescComplete: 'Original network credentials restored securely in-browser.',
    loaderStep4Title: 'Format Redline Comparison Diff',
    loaderStep4DescActive: 'Rendering dynamic colored line comparisons & fix checklists...',
    loaderStep4DescPending: 'Awaiting previous step...',
    loaderStep4DescComplete: 'Analysis pipeline fully executed.',
    toastSettingsSaved: 'Settings saved successfully!',
    toastConnectionSuccess: 'Connection verified successfully!',
    toastConnectionError: 'Connection test failed: ',
    toastCopySuccess: 'Command copied!',
    toastCopyTabSuccess: 'Copied to clipboard!',
    toastTemplateFirewall: 'Loaded default firewall template!',
    toastTemplateRouting: 'Loaded default routing template!',
    toastPipelineComplete: 'Auditing pipeline complete!',
    toastFileUploadSuccess: 'File uploaded successfully!',
    toastFileUploadError: 'Only text, .rsc, or .log files are supported!',
    settingsPanelTitle: 'Engine Settings Panel',
    settingsTabAi: 'AI Provider',
    settingsTabPrivacy: 'Privacy Shields',
    settingsTabPrompt: 'System Prompt',
    settingsLabelLlmProvider: 'LLM Provider',
    settingsLabelModelName: 'Model Name',
    settingsLabelApiKey: 'API Key / Secret',
    settingsLabelBaseUrl: 'Base URL (For Local/Ollama)',
    settingsBtnTestConnection: 'Test Connection',
    settingsLabelPrivacyPipeline: 'De-identification Pipeline',
    settingsLabelPrivacyLocalTag: 'Runs Locally',
    settingsMaskIpsTitle: 'Mask IP Addresses',
    settingsMaskIpsDesc: 'Scans IPv4/6; maps to placeholders',
    settingsMaskMacsTitle: 'Mask MAC Hardware ID',
    settingsMaskMacsDesc: 'Hides physical hex hardware interfaces',
    settingsMaskSecretsTitle: 'Mask Keys & Secrets',
    settingsMaskSecretsDesc: 'Hides security-profiles, passwords, pre-shared keys',
    settingsMaskInterfacesTitle: 'Mask Custom Interface Names',
    settingsMaskInterfacesDesc: 'Keeps standard interfaces like bridge, ether1; masks custom',
    settingsMaskDomainsTitle: 'Mask Domain Names',
    settingsMaskDomainsDesc: 'Hides external server addresses & DDNS urls',
    settingsMaskIdentityTitle: 'Mask Router system identity',
    settingsMaskIdentityDesc: 'Redacts custom system labels or hardware handles',
    settingsLabelPromptOverride: 'Custom Prompt Override',
    settingsLabelPromptDesc: 'Set a tailored system instruction list for RouterOS optimization. Leave blank to fallback to system standard prompt.',
    settingsPromptPlaceholder: 'Enter elite instructions...',
    settingsBtnSave: 'Save Configuration',
    historyNoDesc: '(No description)',
    historyQueryEmpty: 'No history items match your search.',
    historyWipeToast: 'All history wiped successfully!',
    copyLabel: 'Copy'
  },
  it: {
    title: 'Mik il Mago di Winbox — Assistente Chatbot AI per la Privacy di MikroTik',
    headerTitle: 'Mik il Mago di Winbox',
    headerBadge: 'Scudo della Privacy di Mik Attivo',
    headerDesc: 'Suite di Audit e Correzione Sicura della Configurazione RouterOS',
    newChat: 'Nuova Chat',
    tooltipAudit: 'Nuova Chat',
    tooltipHistory: 'Cronologia degli Audit',
    tooltipUpload: 'Carica File',
    tooltipHelp: 'Assistenza del Mago',
    historyTitle: 'Cronologia Sessione',
    clearHistory: 'Cancella Tutto',
    searchHistoryPlaceholder: 'Cerca gli audit salvati...',
    historyEmpty: 'Nessun audit salvato ancora in questa sessione.',
    pasteConfigLabel: 'Config. o Log Esportati da RouterOS',
    quickFirewall: 'Audit del Firewall',
    quickRouting: 'Gateway e DNS',
    clearLabel: 'Cancella',
    pastedConfigPlaceholder: '# Incolla qui una configurazione .rsc di esportazione... (Tutti gli IP/MAC/segreti saranno mascherati localmente prima dell\'invio all\'IA e ripristinati istantaneamente!)',
    dragTitle: 'Rilascia il File di Configurazione RouterOS',
    dragDesc: 'Accetta esportazioni .rsc, .txt o .log',
    chatMessageLabel: 'Spiega il Problema / Descrizione del Compito',
    chatMessagePlaceholder: "Descrivi il problema (es. 'OSPF non stabilisce il peering' o 'Verifica se le porte WAN sono sicure')",
    privacyDefault: 'Configura i parametri di mascheramento nelle Impostazioni',
    privacyActiveLabel: '🛡️ Scudo Privacy: {count}/6 Schermature Attive',
    submitBtn: 'Analizza e Correggi',
    submitBtnLoading: 'Analisi in corso...',
    tabExplanation: 'Spiegazione',
    tabDiff: 'Differenze Config',
    tabCommands: 'Comandi di Ripristino',
    diffModeSplit: 'Diviso',
    diffModeUnified: 'Unificato',
    commandModeChecklist: 'Lista di Controllo',
    commandModeRaw: 'Terminale CLI',
    copyBtn: 'Copia Contenuto',
    copiedText: 'Copia eseguita!',
    welcomeTitle: 'Mik il Mago di Winbox è pronto a lanciare incantesimi!',
    welcomeDesc: 'Configura il tuo provider LLM nelle impostazioni, incolla la tua configurazione `/export` o file di log di RouterOS, spiega il problema e lascia che <strong class="text-brand-400">Mik</strong> verifichi il tuo dispositivo.',
    welcomePrivacy: '🛡️ Massima Privacy Garantita: lo Scudo di Mik assicura che password, IP, MAC, nomi di interfacce personalizzate e identità non lascino mai questa macchina.',
    diffOriginalHeader: 'Config. Originale (Visualizzazione Oscurata)',
    diffCorrectedHeader: 'Config. Corretta (Completamente Ripristinata)',
    diffUnifiedDesc: 'Legenda Differenze: <span class="text-red-400">Linea Rossa = Originale</span> | <span class="text-cyber-emerald">Green Line = Corretta</span>',
    commandsTip: 'Questi sono comandi del terminale RouterOS. Incollali direttamente nella finestra CLI di MikroTik per applicare la correzione.',
    commandsChecklistEmpty: '<div class="text-center py-12 text-slate-500 text-xs">Nessun comando di terminale generato per questa analisi.</div>',
    commandsRawEmpty: '# I comandi appariranno qui dopo l\'analisi...',
    commandsRawNoNeed: '# Nessun comando di terminale specifico necessario per questa correzione.',
    loaderTitle: 'Scudo Privacy di Mik Attivo',
    loaderStep1Title: 'Anonimizzazione Contesto Privato',
    loaderStep1DescActive: 'Scansione della configurazione per segreti e sotto-reti private...',
    loaderStep1DescPending: 'In attesa della fase precedente...',
    loaderStep1DescComplete: 'Scudo attivato! Sostituiti IP privati, password e identità personalizzate localmente.',
    loaderStep2Title: 'AI Audit nella Sandbox Sicura',
    loaderStep2DescActive: 'Invio delle istruzioni oscurate alla sandbox sicura...',
    loaderStep2DescPending: 'In attesa della fase precedente...',
    loaderStep2DescComplete: 'Audit compilato con successo dal provider LLM.',
    loaderStep3Title: 'Ripristino Record Originali',
    loaderStep3DescActive: 'Ricostruzione della mappa: Sostituzione dei segnaposto con gli originali sicuri...',
    loaderStep3DescPending: 'In attesa della fase precedente...',
    loaderStep3DescComplete: 'Credenziali di rete originali ripristinate in modo sicuro nel browser.',
    loaderStep4Title: 'Generazione Differenze Redline',
    loaderStep4DescActive: 'Rendering del confronto dinamico a colori e lista comandi di ripristino...',
    loaderStep4DescPending: 'In attesa della fase precedente...',
    loaderStep4DescComplete: 'Pipeline di analisi completamente eseguita.',
    toastSettingsSaved: 'Impostazioni salvate con successo!',
    toastConnectionSuccess: 'Connessione verificata con successo!',
    toastConnectionError: 'Test di connessione fallito: ',
    toastCopySuccess: 'Comando copiato!',
    toastCopyTabSuccess: 'Copiato negli appunti!',
    toastTemplateFirewall: 'Caricato template firewall!',
    toastTemplateRouting: 'Caricato template gateway e DNS!',
    toastPipelineComplete: 'Pipeline di auditing completata!',
    toastFileUploadSuccess: 'File caricato con successo!',
    toastFileUploadError: 'Sono supportati solo file di testo, .rsc o .log!',
    settingsPanelTitle: 'Pannello Impostazioni',
    settingsTabAi: 'Provider IA',
    settingsTabPrivacy: 'Scudi Privacy',
    settingsTabPrompt: 'Prompt di Sistema',
    settingsLabelLlmProvider: 'Provider LLM',
    settingsLabelModelName: 'Nome Modello',
    settingsLabelApiKey: 'Chiave API / Segreta',
    settingsLabelBaseUrl: 'URL Base (Per Ollama Locale)',
    settingsBtnTestConnection: 'Test Connessione',
    settingsLabelPrivacyPipeline: 'Pipeline di Anonimizzazione',
    settingsLabelPrivacyLocalTag: 'Eseguito Localmente',
    settingsMaskIpsTitle: 'Maschera Indirizzi IP',
    settingsMaskIpsDesc: 'Rileva IPv4/6; mappa a [PRIV_IP_x] e [PUB_IP_x]',
    settingsMaskMacsTitle: 'Maschera ID Hardware MAC',
    settingsMaskMacsDesc: 'Nasconde le interfacce hex hardware fisiche',
    settingsMaskSecretsTitle: 'Maschera Chiavi e Segreti',
    settingsMaskSecretsDesc: 'Nasconde profili di sicurezza, password e chiavi precondivise',
    settingsMaskInterfacesTitle: 'Maschera Nomi Interfaccia',
    settingsMaskInterfacesDesc: 'Mantiene le interfacce standard (bridge, ether1); maschera le personalizzate',
    settingsMaskDomainsTitle: 'Maschera Nomi di Dominio',
    settingsMaskDomainsDesc: 'Nasconde indirizzi di server esterni e URL DDNS',
    settingsMaskIdentityTitle: 'Maschera Identità Sistema Router',
    settingsMaskIdentityDesc: 'Rimuove etichette di sistema personalizzate o handle hardware',
    settingsLabelPromptOverride: 'Prompt Personalizzato',
    settingsLabelPromptDesc: 'Imposta istruzioni personalizzate per l\'ottimizzazione di RouterOS. Lascia vuoto per utilizzare il prompt predefinito del mago.',
    settingsPromptPlaceholder: 'Inserisci le istruzioni del mago...',
    settingsBtnSave: 'Salva Configurazione',
    historyNoDesc: '(Nessuna descrizione)',
    historyQueryEmpty: 'Nessun elemento della cronologia corrisponde alla ricerca.',
    historyWipeToast: 'Cronologia interamente cancellata!',
    copyLabel: 'Copia'
  }
};

class LocalizationService {
  static getTranslation() {
    const currentLang = stateStore.get('language') === 'auto' ? 'en' : stateStore.get('language');
    return i18n[currentLang] || i18n.en;
  }

  static updateUILanguage() {
    const t = this.getTranslation();

    // Headers & Main Titles
    if (els.uiTitle) els.uiTitle.textContent = t.title;
    if (els.uiHeaderTitle) els.uiHeaderTitle.textContent = t.headerTitle;
    if (els.uiHeaderBadge) els.uiHeaderBadge.textContent = t.headerBadge;
    if (els.uiHeaderDesc) els.uiHeaderDesc.textContent = t.headerDesc;

    // Session History Sidebar
    if (els.btnClearHistory) els.btnClearHistory.textContent = t.clearHistory;
    if (els.searchHistory) els.searchHistory.placeholder = t.searchHistoryPlaceholder;
    if (els.uiHistoryEmpty) els.uiHistoryEmpty.textContent = t.historyEmpty;

    // Input elements
    if (els.uiLabelPasteConfig) els.uiLabelPasteConfig.textContent = t.pasteConfigLabel;
    if (els.pastedConfig) els.pastedConfig.placeholder = t.pastedConfigPlaceholder;
    if (els.uiDragTitle) els.uiDragTitle.textContent = t.dragTitle;
    if (els.uiDragDesc) els.uiDragDesc.textContent = t.dragDesc;
    if (els.chatMessage) els.chatMessage.placeholder = t.chatMessagePlaceholder;

    // Welcome Section
    if (els.uiLabelWelcomeTitle) els.uiLabelWelcomeTitle.textContent = t.welcomeTitle;
    if (els.uiLabelWelcomeDesc) els.uiLabelWelcomeDesc.innerHTML = t.welcomeDesc;
    if (els.uiLabelWelcomePrivacy) els.uiLabelWelcomePrivacy.textContent = t.welcomePrivacy;

    // Buttons
    if (els.uiBtnNewChat) els.uiBtnNewChat.textContent = t.newChat;
    if (els.uiBtnHeaderNewChat) els.uiBtnHeaderNewChat.textContent = t.newChat;

    // Modals
    if (els.uiLabelDiffOriginal) els.uiLabelDiffOriginal.textContent = t.diffOriginalHeader;
    if (els.uiLabelDiffCorrected) els.uiLabelDiffCorrected.textContent = t.diffCorrectedHeader;
    if (els.uiLabelDiffUnifiedDesc) els.uiLabelDiffUnifiedDesc.innerHTML = t.diffUnifiedDesc;
    if (els.uiLabelCommandsTip) els.uiLabelCommandsTip.textContent = t.commandsTip;

    // Form inputs & settings
    if (els.uiLabelLlmProvider) els.uiLabelLlmProvider.textContent = t.settingsLabelLlmProvider;
    if (els.uiLabelModelName) els.uiLabelModelName.textContent = t.settingsLabelModelName;
    if (els.uiLabelTestConnection) els.uiLabelTestConnection.textContent = t.settingsBtnTestConnection;

    // Masking Toggles Labels
    if (els.uiMaskIpsTitle) els.uiMaskIpsTitle.textContent = t.settingsMaskIpsTitle;
    if (els.uiMaskIpsDesc) els.uiMaskIpsDesc.textContent = t.settingsMaskIpsDesc;
    if (els.uiMaskMacsTitle) els.uiMaskMacsTitle.textContent = t.settingsMaskMacsTitle;
    if (els.uiMaskMacsDesc) els.uiMaskMacsDesc.textContent = t.settingsMaskMacsDesc;
    if (els.uiMaskSecretsTitle) els.uiMaskSecretsTitle.textContent = t.settingsMaskSecretsTitle;
    if (els.uiMaskSecretsDesc) els.uiMaskSecretsDesc.textContent = t.settingsMaskSecretsDesc;
    if (els.uiMaskInterfacesTitle) els.uiMaskInterfacesTitle.textContent = t.settingsMaskInterfacesTitle;
    if (els.uiMaskInterfacesDesc) els.uiMaskInterfacesDesc.textContent = t.settingsMaskInterfacesDesc;
    if (els.uiMaskDomainsTitle) els.uiMaskDomainsTitle.textContent = t.settingsMaskDomainsTitle;
    if (els.uiMaskDomainsDesc) els.uiMaskDomainsDesc.textContent = t.settingsMaskDomainsDesc;
    if (els.uiMaskIdentityTitle) els.uiMaskIdentityTitle.textContent = t.settingsMaskIdentityTitle;
    if (els.uiMaskIdentityDesc) els.uiMaskIdentityDesc.textContent = t.settingsMaskIdentityDesc;

    if (els.uiLabelPromptOverride) els.uiLabelPromptOverride.textContent = t.settingsLabelPromptOverride;
    if (els.settingPrompt) els.settingPrompt.placeholder = t.settingsPromptPlaceholder;
    if (els.uiLabelSaveSettings) els.uiLabelSaveSettings.textContent = t.settingsBtnSave;

    // Trigger stateful components update
    updatePrivacyShieldLabel();
    updateLLMStatusBadge();
    HistoryManager.renderList();
  }
}

/**
 * ============================================================================
 * CHAT SESSION HISTORY MANAGEMENT (HistoryManager)
 * ============================================================================
 */
class HistoryManager {
  static saveItem(item) {
    const history = stateStore.get('history');
    const activeChatId = stateStore.get('currentChatId');

    if (activeChatId) {
      const idx = history.findIndex(h => h.id === activeChatId);
      if (idx !== -1) {
        history[idx].messages.push(...item.messages);
        history[idx].timestamp = item.timestamp;
        // Bring active conversation card to top of the stack
        const updated = history.splice(idx, 1)[0];
        history.unshift(updated);
        stateStore.set('history', history);
        localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(history));
        this.renderList();
        return;
      }
    }

    stateStore.set('currentChatId', item.id);
    history.unshift(item);
    if (history.length > 25) {
      history.pop();
    }
    stateStore.set('history', history);
    localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(history));
    this.renderList();
  }

  static restoreItem(item) {
    if (els.chatMessagesContainer) {
      els.chatMessagesContainer.innerHTML = '';
    }
    els.panelWelcome.classList.add('hidden');

    stateStore.set('currentChatId', item.id);
    stateStore.set('pastedConfigRaw', '');

    els.selectRosVersion.value = item.rosVersion || 'auto';
    els.selectHardware.value = item.hardwareModel || 'auto';

    if (item.messages && item.messages.length > 0) {
      item.messages.forEach(msg => {
        stateStore.set('analysisResult', msg.result);
        stateStore.set('pastedConfigRaw', msg.pastedConfig);
        appendUserMessage(msg.chatMessage, msg.pastedConfig);
        appendAssistantResponse(msg.result);
      });
    }

    if (window.innerWidth < 1024) {
      stateStore.set('isSidebarOpen', false);
      renderSidebarState();
    }
    showToast('Restored conversation history stream!', 'success');
  }

  static clearAll() {
    const t = LocalizationService.getTranslation();
    stateStore.set('history', []);
    localStorage.removeItem('mikrotik_chatbot_history');
    this.renderList();
    showToast(t.historyWipeToast, 'success');
  }

  static renderList(filterQuery = '') {
    const t = LocalizationService.getTranslation();
    const container = els.historyItemsContainer;
    if (!container) return;

    container.innerHTML = '';
    const history = stateStore.get('history');

    const filtered = history.filter(item => {
      const q = filterQuery.toLowerCase();
      const matchInMessages = item.messages && item.messages.some(m =>
        m.chatMessage && m.chatMessage.toLowerCase().includes(q)
      );
      return item.title.toLowerCase().includes(q) || matchInMessages;
    });

    if (history.length === 0) {
      container.innerHTML = `<div id="ui-history-empty" class="text-center py-8 text-slate-500 text-xs font-medium">${t.historyEmpty}</div>`;
      return;
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs font-medium">${t.historyQueryEmpty}</div>`;
      return;
    }

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'group/item relative p-3 bg-cyber-bg border border-cyber-border rounded-xl transition-all duration-300 ease-out-apple cursor-pointer flex flex-col gap-1 hover:border-brand-500/30 hover:shadow-brand-glow active:scale-[0.98]';

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition p-1 hover:bg-red-500/10 rounded-md';
      deleteBtn.setAttribute('aria-label', `Delete audit history item ${item.title}`);
      deleteBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let currentHistory = stateStore.get('history').filter(h => h.id !== item.id);
        stateStore.set('history', currentHistory);
        if (stateStore.get('currentChatId') === item.id) {
          startNewChat();
        }
        localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(currentHistory));
        this.renderList(filterQuery);
      });

      const header = document.createElement('div');
      header.className = 'flex items-center justify-between pr-5';

      const title = document.createElement('span');
      title.className = 'text-xs font-bold text-slate-800 dark:text-slate-200 truncate block max-w-[140px]';
      title.textContent = item.title;

      const time = document.createElement('span');
      time.className = 'text-[9px] text-slate-500 font-mono';
      time.textContent = item.timestamp;

      header.appendChild(title);
      header.appendChild(time);

      const firstMsg = item.messages && item.messages[0] ? item.messages[0].chatMessage : '';

      const desc = document.createElement('p');
      desc.className = 'text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 leading-normal';
      desc.textContent = firstMsg || t.historyNoDesc;

      card.appendChild(header);
      card.appendChild(desc);
      card.appendChild(deleteBtn);

      card.addEventListener('click', () => this.restoreItem(item));
      container.appendChild(card);
    });
  }
}

/**
 * ============================================================================
 * UI DOM NODES DEFINITIONS & REFERENCES
 * ============================================================================
 */
const els = {
  pastedConfig: document.getElementById('pasted-config'),
  chatMessage: document.getElementById('chat-message'),
  btnSubmit: document.getElementById('btn-submit'),
  loadingSpinner: document.getElementById('loading-spinner'),
  submitIcon: document.getElementById('submit-icon'),

  btnThemeToggle: document.getElementById('btn-theme-toggle'),
  themeSunIcon: document.getElementById('theme-sun-icon'),
  themeMoonIcon: document.getElementById('theme-moon-icon'),

  btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
  btnCloseSidebar: document.getElementById('btn-close-sidebar'),
  sidebarControlCenter: document.getElementById('sidebar-control-center'),

  sidebarTabHistory: document.getElementById('sidebar-tab-history'),
  sidebarTabContext: document.getElementById('sidebar-tab-context'),
  sidebarTabPreferences: document.getElementById('sidebar-tab-preferences'),
  sidebarSectionHistory: document.getElementById('sidebar-section-history'),
  sidebarSectionContext: document.getElementById('sidebar-section-context'),
  sidebarSectionPreferences: document.getElementById('sidebar-section-preferences'),

  btnClearHistory: document.getElementById('btn-clear-history'),
  searchHistory: document.getElementById('search-history'),
  historyItemsContainer: document.getElementById('history-items-container'),

  dragDropZone: document.getElementById('drag-drop-zone'),
  globalDragOverlay: document.getElementById('global-drag-overlay'),
  fileInfoBar: document.getElementById('file-info-bar'),
  fileNameLabel: document.getElementById('file-name-label'),
  fileSizeLabel: document.getElementById('file-size-label'),
  btnRemoveFile: document.getElementById('btn-remove-file'),
  fileInput: document.getElementById('file-input'),

  attachmentDrawer: document.getElementById('attachment-drawer'),
  btnToggleDrawer: document.getElementById('btn-toggle-drawer'),
  btnClearAttachment: document.getElementById('btn-clear-attachment'),

  chatMessagesStream: document.getElementById('chat-messages-stream'),
  chatMessagesContainer: document.getElementById('chat-messages-container'),

  btnNewChat: document.getElementById('btn-new-chat'),
  btnHeaderNewChat: document.getElementById('btn-header-new-chat'),
  uiBtnNewChat: document.getElementById('ui-btn-new-chat'),
  uiBtnHeaderNewChat: document.getElementById('ui-btn-header-new-chat'),

  selectRosVersion: document.getElementById('select-ros-version'),
  selectHardware: document.getElementById('select-hardware'),

  modalDiff: document.getElementById('modal-diff'),
  modalCommands: document.getElementById('modal-commands'),
  btnCloseDiff: document.getElementById('btn-close-diff'),
  btnCloseCommands: document.getElementById('btn-close-commands'),

  diffViewModeSplit: document.getElementById('diff-view-mode-split'),
  diffViewModeUnified: document.getElementById('diff-view-mode-unified'),
  diffTableBody: document.getElementById('diff-table-body'),
  diffSplitHeaders: document.getElementById('diff-split-headers'),
  diffUnifiedHeader: document.getElementById('diff-unified-header'),

  commandViewModeChecklist: document.getElementById('command-view-mode-checklist'),
  commandViewModeRaw: document.getElementById('command-view-mode-raw'),
  commandsChecklistContainer: document.getElementById('commands-checklist-container'),
  commandsRawContainer: document.getElementById('commands-raw-container'),
  commandsBlock: document.getElementById('commands-block'),

  panelWelcome: document.getElementById('panel-welcome'),
  btnQuickFirewall: document.getElementById('btn-quick-firewall'),
  btnQuickRouting: document.getElementById('btn-quick-routing'),

  btnSaveSettings: document.getElementById('btn-save-settings'),
  btnTestConnection: document.getElementById('btn-test-connection'),
  testSpinner: document.getElementById('test-spinner'),
  testResult: document.getElementById('test-result'),

  settingProvider: document.getElementById('setting-provider'),
  settingModel: document.getElementById('setting-model'),
  settingApiKey: document.getElementById('setting-apikey'),
  settingBaseurl: document.getElementById('setting-baseurl'),
  settingPrompt: document.getElementById('setting-prompt'),
  settingLanguage: document.getElementById('setting-language'),

  maskIPs: document.getElementById('mask-ips'),
  maskMACs: document.getElementById('mask-macs'),
  maskSecrets: document.getElementById('mask-secrets'),
  maskInterfaces: document.getElementById('mask-interfaces'),
  maskDomains: document.getElementById('mask-domains'),
  maskIdentity: document.getElementById('mask-identity'),

  llmStatusDot: document.getElementById('llm-status-dot'),
  llmStatusText: document.getElementById('llm-status-text'),
  llmStatusDotMobile: document.getElementById('llm-status-dot-mobile'),
  llmStatusTextMobile: document.getElementById('llm-status-text-mobile'),
  privacyCount: document.getElementById('privacy-count'),

  toastContainer: document.getElementById('toast-container'),

  uiTitle: document.getElementById('ui-title'),
  uiHeaderTitle: document.getElementById('ui-header-title'),
  uiHeaderBadge: document.getElementById('ui-header-badge'),
  uiHeaderDesc: document.getElementById('ui-header-desc'),
  uiHistoryEmpty: document.getElementById('ui-history-empty'),
  uiLabelPasteConfig: document.getElementById('ui-label-paste-config'),
  uiDragTitle: document.getElementById('ui-drag-title'),
  uiDragDesc: document.getElementById('ui-drag-desc'),
  uiLabelWelcomeTitle: document.getElementById('ui-label-welcome-title'),
  uiLabelWelcomeDesc: document.getElementById('ui-label-welcome-desc'),
  uiLabelWelcomePrivacy: document.getElementById('ui-label-welcome-privacy'),
  uiLabelDiffOriginal: document.getElementById('ui-label-diff-original'),
  uiLabelDiffCorrected: document.getElementById('ui-label-diff-corrected'),
  uiLabelDiffUnifiedDesc: document.getElementById('ui-label-diff-unified-desc'),
  uiLabelCommandsTip: document.getElementById('ui-label-commands-tip'),
  uiLabelLlmProvider: document.getElementById('ui-label-llm-provider'),
  uiLabelModelName: document.getElementById('ui-label-model-name'),
  uiLabelTestConnection: document.getElementById('ui-label-test-connection'),
  uiMaskIpsTitle: document.getElementById('ui-mask-ips-title'),
  uiMaskIpsDesc: document.getElementById('ui-mask-ips-desc'),
  uiMaskMacsTitle: document.getElementById('ui-mask-macs-title'),
  uiMaskMacsDesc: document.getElementById('ui-mask-macs-desc'),
  uiMaskSecretsTitle: document.getElementById('ui-mask-secrets-title'),
  uiMaskSecretsDesc: document.getElementById('ui-mask-secrets-desc'),
  uiMaskInterfacesTitle: document.getElementById('ui-mask-interfaces-title'),
  uiMaskInterfacesDesc: document.getElementById('ui-mask-interfaces-desc'),
  uiMaskDomainsTitle: document.getElementById('ui-mask-domains-title'),
  uiMaskDomainsDesc: document.getElementById('ui-mask-domains-desc'),
  uiMaskIdentityTitle: document.getElementById('ui-mask-identity-title'),
  uiMaskIdentityDesc: document.getElementById('ui-mask-identity-desc'),
  uiLabelPromptOverride: document.getElementById('ui-label-prompt-override'),
  uiLabelSaveSettings: document.getElementById('ui-label-save-settings')
};

/**
 * ============================================================================
 * INITIAL BOOTSTRAPPER
 * ============================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
  // Bind settings fields from state
  const settings = stateStore.get('settings');
  els.settingProvider.value = settings.provider;
  els.settingModel.value = settings.model || '';
  els.settingApiKey.value = settings.apiKey || '';
  els.settingBaseurl.value = settings.baseUrl || '';
  els.settingPrompt.value = settings.prompt || '';

  els.maskIPs.checked = settings.maskIPs;
  els.maskMACs.checked = settings.maskMACs;
  els.maskSecrets.checked = settings.maskSecrets;
  els.maskInterfaces.checked = settings.maskInterfaces;
  els.maskDomains.checked = settings.maskDomains;
  els.maskIdentity.checked = settings.maskIdentity;

  els.settingLanguage.value = stateStore.get('language');

  // Trigger Services
  LocalizationService.updateUILanguage();
  HistoryManager.renderList();
  setupEventListeners();
  setupDragAndDrop();
  applyActiveTheme();
  adjustTextAreaHeight();

  // Active sidebar default
  switchSidebarTab('history');
  renderSidebarState();
});

/**
 * ============================================================================
 * RESPONSIVE COLLAPSIBLE SIDEBAR RENDERER
 * ============================================================================
 */
function renderSidebarState() {
  const isOpen = stateStore.get('isSidebarOpen');
  if (isOpen) {
    els.sidebarControlCenter.classList.remove('w-0', 'border-r-0', '-translate-x-full');
    els.sidebarControlCenter.classList.add('w-80', 'border-r');
    if (window.innerWidth < 1024) {
      els.sidebarControlCenter.classList.add('absolute', 'inset-y-0', 'left-0', 'translate-x-0');
      els.sidebarControlCenter.classList.remove('relative');
    } else {
      els.sidebarControlCenter.classList.add('relative', 'translate-x-0');
      els.sidebarControlCenter.classList.remove('absolute');
    }
  } else {
    els.sidebarControlCenter.classList.remove('w-80', 'border-r', 'translate-x-0');
    els.sidebarControlCenter.classList.add('w-0', 'border-r-0');
    if (window.innerWidth < 1024) {
      els.sidebarControlCenter.classList.add('absolute', 'inset-y-0', 'left-0', '-translate-x-full');
      els.sidebarControlCenter.classList.remove('relative');
    } else {
      els.sidebarControlCenter.classList.add('relative', '-translate-x-full');
      els.sidebarControlCenter.classList.remove('absolute');
    }
  }
}

window.addEventListener('resize', () => {
  renderSidebarState();
});

/**
 * ============================================================================
 * STATE-SAVING PREFERENCE WRAPPERS
 * ============================================================================
 */
function startNewChat() {
  stateStore.set('currentChatId', null);
  stateStore.set('analysisResult', null);
  stateStore.set('pastedConfigRaw', '');

  if (els.chatMessagesContainer) {
    els.chatMessagesContainer.innerHTML = '';
  }
  els.panelWelcome.classList.remove('hidden');

  els.chatMessage.value = '';
  adjustTextAreaHeight();

  stateStore.set('currentFile', null);
  els.pastedConfig.value = '';
  els.fileInfoBar.classList.add('hidden');
  closeAttachmentDrawer();

  showToast('Wizard session refreshed. Magic is ready!', 'success');
}

function saveSettings() {
  const t = LocalizationService.getTranslation();
  const updated = {
    provider: els.settingProvider.value,
    model: els.settingModel.value,
    apiKey: els.settingApiKey.value,
    baseUrl: els.settingBaseurl.value,
    prompt: els.settingPrompt.value,
    maskIPs: els.maskIPs.checked,
    maskMACs: els.maskMACs.checked,
    maskSecrets: els.maskSecrets.checked,
    maskInterfaces: els.maskInterfaces.checked,
    maskDomains: els.maskDomains.checked,
    maskIdentity: els.maskIdentity.checked
  };

  stateStore.saveSettings(updated);
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
  showToast(t.toastSettingsSaved, 'success');
}

/**
 * ============================================================================
 * ACCESSIBLE GENTLE THEME TOGGLERS
 * ============================================================================
 */
function applyActiveTheme() {
  const isLight = stateStore.get('theme') === 'light';
  if (isLight) {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
    els.themeSunIcon.classList.add('hidden');
    els.themeMoonIcon.classList.remove('hidden');
  } else {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    els.themeSunIcon.classList.remove('hidden');
    els.themeMoonIcon.classList.add('hidden');
  }
}

function toggleTheme() {
  const currentTheme = stateStore.get('theme');
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
  stateStore.saveTheme(nextTheme);
  applyActiveTheme();
}

function switchSidebarTab(tabId) {
  stateStore.set('activeSidebarTab', tabId);

  // Reset visual tab active/inactive states
  [els.sidebarTabHistory, els.sidebarTabContext, els.sidebarTabPreferences].forEach(el => {
    el.className = 'py-1.5 px-1 text-[10px] font-bold rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition truncate text-center';
  });

  els.sidebarSectionHistory.classList.add('hidden');
  els.sidebarSectionContext.classList.add('hidden');
  els.sidebarSectionPreferences.classList.add('hidden');

  const activeBtn = tabId === 'history' ? els.sidebarTabHistory : (tabId === 'context' ? els.sidebarTabContext : els.sidebarTabPreferences);
  activeBtn.className = 'py-1.5 px-1 text-[10px] font-bold rounded-lg bg-slate-200 dark:bg-slate-800/80 text-brand-600 dark:text-brand-400 border border-cyber-border hover:text-brand-500 transition truncate text-center';

  const activeSection = tabId === 'history' ? els.sidebarSectionHistory : (tabId === 'context' ? els.sidebarSectionContext : els.sidebarSectionPreferences);
  activeSection.classList.remove('hidden');
}

/**
 * ============================================================================
 * RSC ATTACHMENTS & COLLAPSIBLE ATTACHMENTS DRAWER
 * ============================================================================
 */
function toggleAttachmentDrawer() {
  const isOpen = stateStore.get('isAttachmentDrawerOpen');
  if (isOpen) {
    closeAttachmentDrawer();
  } else {
    openAttachmentDrawer();
  }
}

function openAttachmentDrawer() {
  stateStore.set('isAttachmentDrawerOpen', true);
  els.attachmentDrawer.classList.remove('hidden');
  els.btnToggleDrawer.classList.add('bg-brand-500/10', 'text-brand-400');
}

function closeAttachmentDrawer() {
  stateStore.set('isAttachmentDrawerOpen', false);
  els.attachmentDrawer.classList.add('hidden');
  els.btnToggleDrawer.classList.remove('bg-brand-500/10', 'text-brand-400');
}

function adjustTextAreaHeight() {
  const textarea = els.chatMessage;
  textarea.style.height = '38px';
  textarea.style.height = Math.max(38, Math.min(textarea.scrollHeight, 128)) + 'px';
}

function setupDragAndDrop() {
  const t = LocalizationService.getTranslation();

  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    els.globalDragOverlay.classList.remove('hidden');
  });

  els.globalDragOverlay.addEventListener('dragover', (e) => e.preventDefault());
  els.globalDragOverlay.addEventListener('dragleave', (e) => {
    e.preventDefault();
    els.globalDragOverlay.classList.add('hidden');
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    els.globalDragOverlay.classList.add('hidden');
  });

  els.globalDragOverlay.addEventListener('drop', (e) => {
    e.preventDefault();
    els.globalDragOverlay.classList.add('hidden');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadedFile(e.dataTransfer.files[0]);
    }
  });

  els.btnRemoveFile.addEventListener('click', () => {
    stateStore.set('currentFile', null);
    els.pastedConfig.value = '';
    els.pastedConfig.disabled = false;
    els.fileInfoBar.classList.add('hidden');
  });

  els.fileInput.addEventListener('change', () => {
    if (els.fileInput.files && els.fileInput.files.length > 0) {
      handleUploadedFile(els.fileInput.files[0]);
    }
  });
}

function handleUploadedFile(file) {
  const t = LocalizationService.getTranslation();
  const validExtensions = ['.rsc', '.txt', '.log'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!validExtensions.includes(ext) && file.type !== 'text/plain') {
    showToast(t.toastFileUploadError, 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    stateStore.set('currentFile', file);
    els.pastedConfig.value = e.target.result;
    els.pastedConfig.disabled = false;

    els.fileNameLabel.textContent = file.name;
    els.fileSizeLabel.textContent = (file.size / 1024).toFixed(1) + ' KB';

    els.fileInfoBar.classList.remove('hidden');
    openAttachmentDrawer();
    showToast(t.toastFileUploadSuccess, 'success');
  };
  reader.readAsText(file);
}

/**
 * ============================================================================
 * SYSTEM STATUS BADGES & PRIVATE CHECKS
 * ============================================================================
 */
function updatePrivacyShieldLabel() {
  const t = LocalizationService.getTranslation();
  let activeCount = 0;
  if (els.maskIPs.checked) activeCount++;
  if (els.maskMACs.checked) activeCount++;
  if (els.maskSecrets.checked) activeCount++;
  if (els.maskInterfaces.checked) activeCount++;
  if (els.maskDomains.checked) activeCount++;
  if (els.maskIdentity.checked) activeCount++;

  els.privacyCount.textContent = t.privacyActiveLabel.replace('{count}', activeCount);
}

function updateLLMStatusBadge() {
  const settings = stateStore.get('settings');
  const prov = settings.provider;
  const hasKey = !!settings.apiKey;

  let activeText = '';
  let isActive = false;

  if (prov === 'ollama' || prov === 'custom') {
    activeText = `LAN Active (${prov.toUpperCase()})`;
    isActive = true;
  } else if (hasKey) {
    activeText = `Secure Cloud Active`;
    isActive = true;
  } else {
    activeText = 'LLM Offline';
    isActive = false;
  }

  if (isActive) {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-cyber-emerald rounded-full animate-pulse shadow-emerald-glow';
    els.llmStatusText.textContent = activeText;
    els.llmStatusText.className = 'font-bold text-cyber-emerald text-[10px] tracking-wide';

    els.llmStatusDotMobile.className = 'w-2 h-2 bg-cyber-emerald rounded-full animate-pulse shadow-emerald-glow';
    els.llmStatusTextMobile.textContent = activeText;
    els.llmStatusTextMobile.className = 'font-bold text-cyber-emerald text-[10px] tracking-wide';
  } else {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-slate-500 rounded-full';
    els.llmStatusText.textContent = 'LLM Offline (Requires Key/API)';
    els.llmStatusText.className = 'font-medium text-slate-400 text-[10px]';

    els.llmStatusDotMobile.className = 'w-2 h-2 bg-slate-500 rounded-full';
    els.llmStatusTextMobile.textContent = 'LLM Offline';
    els.llmStatusTextMobile.className = 'font-medium text-slate-400 text-[10px]';
  }
}

/**
 * ============================================================================
 * BACKEND API CONVERGENCE (Connection test, templates, modals rendering)
 * ============================================================================
 */
async function testConnection() {
  const prov = els.settingProvider.value;
  const key = els.settingApiKey.value;
  const model = els.settingModel.value;
  const base = els.settingBaseurl.value;
  const t = LocalizationService.getTranslation();

  els.testSpinner.classList.remove('hidden');
  els.testResult.textContent = '';

  try {
    const res = await fetch('/api/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: prov, apiKey: key, baseUrl: base, model })
    });

    const data = await res.json();
    els.testSpinner.classList.add('hidden');

    if (data.success) {
      els.testResult.textContent = t.toastConnectionSuccess;
      els.testResult.className = 'text-[10px] font-black text-cyber-emerald';
      showToast(t.toastConnectionSuccess, 'success');
    } else {
      throw new Error(data.message || 'No response');
    }
  } catch (err) {
    els.testSpinner.classList.add('hidden');
    els.testResult.textContent = 'Connection Fail';
    els.testResult.className = 'text-[10px] font-black text-cyber-red';
    showToast(t.toastConnectionError + err.message, 'error');
  }
}

function loadFirewallTemplate() {
  const t = LocalizationService.getTranslation();
  els.pastedConfig.value = `/ip firewall filter\nadd action=accept chain=input comment="defconf: accept established,related" connection-state=established,related\nadd action=drop chain=input comment="defconf: drop invalid" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment="defconf: drop WAN access" in-interface-list=WAN\nadd action=accept chain=forward comment="defconf: accept in-interface=ether1" in-interface=ether1`;
  els.chatMessage.value = "Audita le mie regole di firewall. Ci sono vulnerabilità o porte non protette?";
  openAttachmentDrawer();
  showToast(t.toastTemplateFirewall, 'success');
}

function loadRoutingTemplate() {
  const t = LocalizationService.getTranslation();
  els.pastedConfig.value = `/ip route\nadd dst-address=0.0.0.0/0 gateway=192.168.88.1 routing-table=main\n/ip dns\nset allow-remote-requests=yes servers=8.8.8.8,1.1.1.1`;
  els.chatMessage.value = "Why cannot users connect to local addresses, and how should static gateway routes be defined securely?";
  openAttachmentDrawer();
  showToast(t.toastTemplateRouting, 'success');
}

function switchDiffMode(modeId) {
  stateStore.set('diffMode', modeId);
  els.diffViewModeSplit.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 hover:text-white transition';
  els.diffViewModeUnified.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 hover:text-white transition';

  if (modeId === 'split') {
    els.diffViewModeSplit.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-cyber-border transition';
  } else {
    els.diffViewModeUnified.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-cyber-border transition';
  }

  const analysis = stateStore.get('analysisResult');
  const pasted = stateStore.get('pastedConfigRaw');
  if (analysis) {
    renderDiff(pasted, analysis.correctedConfig || '');
  }
}

function switchCommandMode(modeId) {
  stateStore.set('commandMode', modeId);
  els.commandViewModeChecklist.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 hover:text-white transition';
  els.commandViewModeRaw.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-500 hover:text-white transition';

  if (modeId === 'checklist') {
    els.commandViewModeChecklist.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-emerald border border-cyber-border transition';
    els.commandsChecklistContainer.classList.remove('hidden');
    els.commandsRawContainer.classList.add('hidden');
  } else {
    els.commandViewModeRaw.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-emerald border border-cyber-border transition';
    els.commandsChecklistContainer.classList.add('hidden');
    els.commandsRawContainer.classList.remove('hidden');
  }
}

/**
 * ============================================================================
 * MODALS VISUAL DIFF & CHECKLIST RENDERING (Leveraging global public/utils.js)
 * ============================================================================
 */
function renderDiff(originalText, correctedText) {
  const tbody = els.diffTableBody;
  tbody.innerHTML = '';

  const alignedLines = window.computeLineDiff(originalText, correctedText);
  const mode = stateStore.get('diffMode');

  if (mode === 'split') {
    els.diffSplitHeaders.classList.remove('hidden');
    els.diffUnifiedHeader.classList.add('hidden');

    alignedLines.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-900/60 hover:bg-slate-900/40 text-slate-700 dark:text-slate-300';

      const tdLeft = document.createElement('td');
      tdLeft.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs border-r border-slate-900';

      const tdRight = document.createElement('td');
      tdRight.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';

      if (row.type === 'equal') {
        tdLeft.textContent = row.left;
        tdRight.textContent = row.right;
        tdLeft.className += ' text-slate-500 dark:text-slate-400';
        tdRight.className += ' text-slate-500 dark:text-slate-400';
      } else if (row.type === 'delete') {
        tdLeft.className += ' diff-deleted text-cyber-red font-medium';
        tdLeft.textContent = row.left;
        tdRight.textContent = '';
      } else if (row.type === 'insert') {
        tdLeft.textContent = '';
        tdRight.className += ' diff-inserted text-cyber-emerald font-medium';
        tdRight.textContent = row.right;
      } else if (row.type === 'modify') {
        tdLeft.className += ' diff-modified-left text-cyber-amber';
        tdLeft.textContent = row.left;
        tdRight.className += ' diff-modified-right text-cyber-emerald font-medium';
        tdRight.textContent = row.right;
      }

      tr.appendChild(tdLeft);
      tr.appendChild(tdRight);
      tbody.appendChild(tr);
    });
  } else {
    els.diffSplitHeaders.classList.add('hidden');
    els.diffUnifiedHeader.classList.remove('hidden');

    alignedLines.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-900 hover:bg-slate-900/40';
      const td = document.createElement('td');
      td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';

      if (row.type === 'equal') {
        tr.className += ' text-slate-500';
        td.textContent = `  ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'delete') {
        td.className += ' diff-deleted text-cyber-red font-medium';
        td.textContent = `- ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'insert') {
        td.className += ' diff-inserted text-cyber-emerald font-medium';
        td.textContent = `+ ${row.right}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'modify') {
        // Red line followed by green line
        const trDel = document.createElement('tr');
        trDel.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const tdDel = document.createElement('td');
        tdDel.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-deleted text-cyber-red font-medium';
        tdDel.textContent = `- ${row.left}`;
        trDel.appendChild(tdDel);
        tbody.appendChild(trDel);

        const trIns = document.createElement('tr');
        trIns.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const tdIns = document.createElement('td');
        tdIns.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-inserted text-cyber-emerald font-medium';
        tdIns.textContent = `+ ${row.right}`;
        trIns.appendChild(tdIns);
        tbody.appendChild(trIns);
      }
    });
  }
}

function renderCommands(fixCommands) {
  const t = LocalizationService.getTranslation();
  els.commandsBlock.textContent = fixCommands || t.commandsRawNoNeed;

  const container = els.commandsChecklistContainer;
  container.innerHTML = '';

  const rawLines = fixCommands ? fixCommands.split('\n') : [];
  const lines = rawLines.map(line => line.trim()).filter(line => line.length > 0 && !line.startsWith('#'));

  if (lines.length === 0) {
    container.innerHTML = t.commandsChecklistEmpty;
    return;
  }

  lines.forEach((line) => {
    const item = document.createElement('div');
    item.className = 'p-3 bg-cyber-bg border border-cyber-border rounded-xl flex items-center justify-between space-x-3 hover:border-slate-700 transition duration-200';

    const left = document.createElement('div');
    left.className = 'flex items-start space-x-3 select-none flex-1 overflow-hidden';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mt-1 accent-cyber-emerald h-4 w-4 rounded shrink-0 cursor-pointer';

    const text = document.createElement('code');
    text.className = 'text-xs text-slate-800 dark:text-slate-200 font-mono select-text break-all leading-normal';
    text.textContent = line;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        text.className += ' line-through opacity-40';
        item.className = 'p-3 bg-cyber-bg/40 border border-cyber-border rounded-xl flex items-center justify-between space-x-3 opacity-60 transition';
      } else {
        text.className = 'text-xs text-slate-800 dark:text-slate-200 font-mono select-text break-all leading-normal';
        item.className = 'p-3 bg-cyber-bg border border-cyber-border rounded-xl flex items-center justify-between space-x-3 hover:border-slate-700 transition';
      }
    });

    left.appendChild(checkbox);
    left.appendChild(text);

    const btnCopy = document.createElement('button');
    btnCopy.className = 'text-[10px] bg-cyber-panel border border-cyber-border hover:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0 transition active:scale-95';
    btnCopy.textContent = t.copyLabel;

    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(line).then(() => {
        btnCopy.textContent = t.copiedText;
        btnCopy.className = 'text-[10px] bg-emerald-950 border border-cyber-emerald text-cyber-emerald font-bold px-2.5 py-1 rounded-lg shrink-0 transition';
        showToast(t.toastCopySuccess, 'success');
        setTimeout(() => {
          btnCopy.textContent = t.copyLabel;
          btnCopy.className = 'text-[10px] bg-cyber-panel border border-cyber-border hover:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0';
        }, 1500);
      });
    });

    item.appendChild(left);
    item.appendChild(btnCopy);
    container.appendChild(item);
  });
}

/**
 * ============================================================================
 * CONVERSATION STREAM LAYOUT BUILDERS (Bubble appending)
 * ============================================================================
 */
function appendUserMessage(messageText, pastedConfigText) {
  const container = els.chatMessagesContainer || els.chatMessagesStream;
  const bubble = document.createElement('div');
  bubble.className = 'flex flex-col space-y-2.5 items-end max-w-3xl ml-auto w-full select-text animate-apple-reveal';

  let attachmentHtml = '';
  if (pastedConfigText) {
    attachmentHtml = `
      <div class="glow-border-purple text-xs rounded-2xl p-3 bg-cyber-panel/85 border border-cyber-border max-w-full font-mono text-[10px] text-slate-500 dark:text-slate-400 select-text overflow-x-auto max-h-40 whitespace-pre">
        <span class="block text-[9px] font-black uppercase text-cyber-purple tracking-wider mb-1 select-none">📎 Attached RSC Export</span>
        <span>${pastedConfigText.trim()}</span>
      </div>
    `;
  }

  bubble.innerHTML = `
    <div class="flex items-center space-x-2 text-[10px] text-slate-500 font-semibold select-none">
      <span>You</span>
      <span>•</span>
      <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="chat-bubble-user text-xs text-white p-4 rounded-2xl leading-relaxed shadow-lg max-w-full">
      ${messageText || 'Analyze attached configuration.'}
    </div>
    ${attachmentHtml}
  `;

  container.appendChild(bubble);
  scrollStreamToBottom();
}

function appendAssistantResponse(result) {
  const container = els.chatMessagesContainer || els.chatMessagesStream;
  const wrapper = document.createElement('div');
  wrapper.className = 'flex flex-col space-y-2.5 items-start max-w-3xl mr-auto w-full select-text animate-apple-reveal';

  const explanationHtml = window.renderMarkdown(result.explanation || 'No explanation returned.');
  const pasted = stateStore.get('pastedConfigRaw');

  const hasDiff = result.correctedConfig && result.correctedConfig.trim().length > 0 &&
                  pasted && pasted.trim().length > 0 &&
                  result.correctedConfig.trim() !== pasted.trim();

  const rawLines = result.fixCommands ? result.fixCommands.split('\n') : [];
  const hasCommands = rawLines.map(line => line.trim()).some(line => line.length > 0 && !line.startsWith('#'));

  let actionButtonsHtml = '';
  if (hasDiff || hasCommands) {
    actionButtonsHtml = `
      <div class="flex items-center gap-2 pt-4 border-t border-cyber-border mt-4 select-none">
        ${hasDiff ? `
        <button id="btn-show-diff-overlay" class="bg-brand-500 hover:bg-brand-600 border border-brand-100/10 text-white font-bold px-4 py-2 rounded-xl text-[10px] flex items-center gap-1.5 transition active:scale-95 shadow">
          <span>🔎</span> View Config Diff
        </button>
        ` : ''}
        ${hasCommands ? `
        <button id="btn-show-checklist-overlay" class="bg-[#1e1b4b] hover:bg-indigo-900 border border-cyber-border text-slate-300 hover:text-white font-bold px-4 py-2 rounded-xl text-[10px] flex items-center gap-1.5 transition active:scale-95 shadow">
          <span>📋</span> View Fix Checklist
        </button>
        ` : ''}
      </div>
    `;
  }

  wrapper.innerHTML = `
    <div class="flex items-center space-x-2 text-[10px] text-slate-500 font-semibold select-none">
      <span class="text-cyber-accent">🧙‍♂️ Mik the Winbox Wizard</span>
      <span>•</span>
      <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="chat-bubble-assistant text-xs text-slate-700 dark:text-slate-300 p-5 rounded-2xl leading-relaxed shadow-xl max-w-full w-full">
      ${explanationHtml}
      ${actionButtonsHtml}
    </div>
  `;

  const btnDiff = wrapper.querySelector('#btn-show-diff-overlay');
  if (btnDiff) {
    btnDiff.addEventListener('click', () => {
      renderDiff(pasted, result.correctedConfig || '');
      els.modalDiff.classList.remove('hidden');
    });
  }

  const btnChecklist = wrapper.querySelector('#btn-show-checklist-overlay');
  if (btnChecklist) {
    btnChecklist.addEventListener('click', () => {
      renderCommands(result.fixCommands || '');
      els.modalCommands.classList.remove('hidden');
    });
  }

  container.appendChild(wrapper);
  scrollStreamToBottom();
}

function scrollStreamToBottom() {
  els.chatMessagesStream.scrollTop = els.chatMessagesStream.scrollHeight;
}

/**
 * ============================================================================
 * HIGH-IMPACT INLINE RETRY EXCEPTION CARDS
 * ============================================================================
 */
function appendInlineErrorCard(errorMessage, retryCallback) {
  const container = els.chatMessagesContainer || els.chatMessagesStream;
  const card = document.createElement('div');
  card.className = 'flex flex-col space-y-3 p-5 rounded-2xl bg-red-950/40 border border-red-500/30 shadow-lg text-xs text-red-200 w-full max-w-2xl animate-apple-reveal';

  card.innerHTML = `
    <div class="flex items-start space-x-3">
      <span class="text-base select-none">💥</span>
      <div class="flex-1 space-y-1">
        <h4 class="font-bold uppercase tracking-wider text-red-400">Analysis Spell Failed</h4>
        <p class="leading-relaxed font-medium">${errorMessage}</p>
      </div>
    </div>
    <div class="flex justify-end pt-2 border-t border-red-500/10">
      <button id="btn-inline-retry" class="px-4 py-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold rounded-xl text-[10px] uppercase tracking-wide transition flex items-center space-x-1.5 select-none shadow">
        <span>🔄</span> <span>Retry Analysis</span>
      </button>
    </div>
  `;

  const btnRetry = card.querySelector('#btn-inline-retry');
  btnRetry.addEventListener('click', () => {
    card.remove();
    retryCallback();
  });

  container.appendChild(card);
  scrollStreamToBottom();
}

/**
 * ============================================================================
 * INTERACTIVE MULTI-STEP PIPELINE (runStepperAndSubmit)
 * ============================================================================
 */
async function runStepperAndSubmit(submitPayload) {
  const t = LocalizationService.getTranslation();

  const loaderCard = document.createElement('div');
  loaderCard.id = 'inline-loader-card';
  loaderCard.className = 'flex flex-col space-y-3.5 items-start max-w-2xl mr-auto w-full select-none p-5 rounded-2xl bg-cyber-panel border border-brand-500/30 shadow-brand-glow animate-pulse';

  loaderCard.innerHTML = `
    <!-- Header -->
    <div class="flex items-center space-x-2.5">
      <div class="relative w-7 h-7 flex items-center justify-center shrink-0">
        <div class="absolute inset-0 border-2 border-dashed border-brand-500/50 rounded-lg animate-[spin_4s_linear_infinite]"></div>
        <div class="w-4 h-4 rounded-md bg-brand-500 text-white flex items-center justify-center border border-brand-100/10">
          <svg class="w-2.5 h-2.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
      <div>
        <h4 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">${t.loaderTitle}</h4>
        <p class="text-[9px] text-slate-500">Executing safe de-identification network audit...</p>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="w-full bg-cyber-bg rounded-full h-2.5 border border-cyber-border overflow-hidden relative">
      <div id="inline-loader-progress-bar" class="bg-brand-500 h-full w-[15%] transition-all duration-300 shadow-cyber-glow"></div>
    </div>
    <div class="flex justify-between w-full text-[10px] font-bold text-slate-500">
      <span id="inline-loader-log-text">${t.loaderStep1DescActive}</span>
      <span id="inline-loader-percentage" class="text-brand-400 font-mono">15%</span>
    </div>

    <!-- Steps -->
    <div class="w-full space-y-2 border-t border-cyber-border/40 pt-3 text-[11px] font-medium">
      <div id="inline-step-mask" class="flex items-center justify-between text-slate-800 dark:text-slate-200">
        <div class="flex items-center space-x-2.5">
          <div class="step-indicator w-4 h-4 rounded-full border border-cyan-500/50 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-cyber-accent pulse-ring-active shadow-cyber-glow">1</div>
          <span>${t.loaderStep1Title}</span>
        </div>
        <span class="step-stat text-[10px] font-mono text-cyber-accent">Active</span>
      </div>

      <div id="inline-step-transit" class="flex items-center justify-between text-slate-400 dark:text-slate-600">
        <div class="flex items-center space-x-2.5">
          <div class="step-indicator w-4 h-4 rounded-full border border-slate-800 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-slate-600">2</div>
          <span>${t.loaderStep2Title}</span>
        </div>
        <span class="step-stat text-[10px] font-mono text-slate-600">Pending</span>
      </div>

      <div id="inline-step-restore" class="flex items-center justify-between text-slate-400 dark:text-slate-600">
        <div class="flex items-center space-x-2.5">
          <div class="step-indicator w-4 h-4 rounded-full border border-slate-800 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-slate-600">3</div>
          <span>${t.loaderStep3Title}</span>
        </div>
        <span class="step-stat text-[10px] font-mono text-slate-600">Pending</span>
      </div>

      <div id="inline-step-diff" class="flex items-center justify-between text-slate-400 dark:text-slate-600">
        <div class="flex items-center space-x-2.5">
          <div class="step-indicator w-4 h-4 rounded-full border border-slate-800 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-slate-600">4</div>
          <span>${t.loaderStep4Title}</span>
        </div>
        <span class="step-stat text-[10px] font-mono text-slate-600">Pending</span>
      </div>
    </div>
  `;

  // Append User message
  appendUserMessage(submitPayload.chatMessage, stateStore.get('pastedConfigRaw'));

  const activeContainer = els.chatMessagesContainer || els.chatMessagesStream;
  activeContainer.appendChild(loaderCard);
  scrollStreamToBottom();

  const inlineProgressBar = loaderCard.querySelector('#inline-loader-progress-bar');
  const inlineLogText = loaderCard.querySelector('#inline-loader-log-text');
  const inlinePercentage = loaderCard.querySelector('#inline-loader-percentage');
  const inlineStepMask = loaderCard.querySelector('#inline-step-mask');
  const inlineStepTransit = loaderCard.querySelector('#inline-step-transit');
  const inlineStepRestore = loaderCard.querySelector('#inline-step-restore');
  const inlineStepDiff = loaderCard.querySelector('#inline-step-diff');

  function updateInlineStep(el, stepState, logMsg) {
    const indicator = el.querySelector('.step-indicator');
    const stat = el.querySelector('.step-stat');
    if (inlineLogText) inlineLogText.textContent = logMsg;

    if (stepState === 'active') {
      el.className = 'flex items-center justify-between text-slate-800 dark:text-slate-200';
      indicator.className = 'step-indicator w-4 h-4 rounded-full border border-cyan-500/50 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-cyber-accent pulse-ring-active shadow-cyber-glow';
      stat.textContent = 'Active';
      stat.className = 'step-stat text-[10px] font-mono text-cyber-accent';
    } else if (stepState === 'complete') {
      el.className = 'flex items-center justify-between text-slate-500 dark:text-slate-400';
      indicator.className = 'step-indicator w-4 h-4 rounded-full border border-emerald-500/50 text-[9px] font-bold flex items-center justify-center bg-slate-900 text-cyber-emerald';
      indicator.innerHTML = '✓';
      stat.textContent = 'Completed';
      stat.className = 'step-stat text-[10px] font-mono text-cyber-emerald';
    } else {
      el.className = 'flex items-center justify-between text-slate-400 dark:text-slate-600';
      indicator.className = 'step-indicator w-4 h-4 rounded-full border border-slate-800 text-[9px] font-bold flex items-center justify-center bg-slate-950 text-slate-600';
      stat.textContent = 'Pending';
      stat.className = 'step-stat text-[10px] font-mono text-slate-600';
    }
  }

  function setInlineProgressBar(pct, text) {
    if (inlineProgressBar) inlineProgressBar.style.width = pct + '%';
    if (inlinePercentage) inlinePercentage.textContent = text;
  }

  // Delay helper
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Stage 1: Masking
  await delay(700);
  updateInlineStep(inlineStepMask, 'complete', t.loaderStep1DescComplete);
  updateInlineStep(inlineStepTransit, 'active', t.loaderStep2DescActive);
  setInlineProgressBar(40, '40%');

  // Stage 2: AI Transit & Call API
  let serverResponseData = null;
  let serverError = null;

  try {
    const fetchPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitPayload)
    });

    const timeoutPromise = delay(1200);
    const [res] = await Promise.all([fetchPromise, timeoutPromise]);

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Server error ${res.status}`);
    }

    serverResponseData = await res.json();
  } catch (err) {
    serverError = err;
  }

  if (serverError) {
    loaderCard.remove();
    showToast(serverError.message, 'error');
    appendInlineErrorCard(serverError.message, () => {
      runStepperAndSubmit(submitPayload);
    });
    return;
  }

  // Stage 3: Restoration
  updateInlineStep(inlineStepTransit, 'complete', t.loaderStep2DescComplete);
  updateInlineStep(inlineStepRestore, 'active', t.loaderStep3DescActive);
  setInlineProgressBar(75, '75%');
  await delay(600);

  // Stage 4: Formatting Diff
  updateInlineStep(inlineStepRestore, 'complete', t.loaderStep3DescComplete);
  updateInlineStep(inlineStepDiff, 'active', t.loaderStep4DescActive);
  setInlineProgressBar(95, '95%');
  await delay(500);

  // Completed
  setInlineProgressBar(100, '100%');
  updateInlineStep(inlineStepDiff, 'complete', t.loaderStep4DescComplete);
  await delay(300);

  // Remove loading card
  loaderCard.remove();

  // Load results into active state Store
  stateStore.set('analysisResult', serverResponseData);
  els.panelWelcome.classList.add('hidden');

  // Append assistant bubble
  appendAssistantResponse(serverResponseData);
  showToast(t.toastPipelineComplete, 'success');

  // Reset inputs
  els.pastedConfig.value = '';
  stateStore.set('currentFile', null);
  els.fileInfoBar.classList.add('hidden');
  closeAttachmentDrawer();

  // Save conversation step in history list
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  let title = `RouterOS Config ${stateStore.get('history').length + 1}`;
  const currentChatId = stateStore.get('currentChatId');

  if (currentChatId) {
    const existing = stateStore.get('history').find(h => h.id === currentChatId);
    if (existing) {
      title = existing.title;
    }
  } else if (stateStore.get('currentFile')) {
    title = stateStore.get('currentFile').name;
  }

  HistoryManager.saveItem({
    id: currentChatId || Date.now(),
    title,
    timestamp,
    rosVersion: submitPayload.routerOsVersion,
    hardwareModel: submitPayload.hardwareModel,
    messages: [{
      chatMessage: submitPayload.chatMessage || 'Configuration audit request',
      pastedConfig: stateStore.get('pastedConfigRaw'),
      result: serverResponseData
    }]
  });
}

/**
 * ============================================================================
 * CHAT SUBMISSION CONTROLLER
 * ============================================================================
 */
async function submitChat() {
  const pastedVal = els.pastedConfig.value.trim();
  const chatVal = els.chatMessage.value.trim();

  if (!pastedVal && !chatVal) {
    showToast('Please attach a configuration or write a question!', 'error');
    return;
  }

  els.btnSubmit.disabled = true;
  els.submitIcon.classList.add('hidden');
  els.loadingSpinner.classList.remove('hidden');

  stateStore.set('pastedConfigRaw', pastedVal);

  const settings = stateStore.get('settings');
  const maskOptions = {
    maskIPs: settings.maskIPs,
    maskMACs: settings.maskMACs,
    maskSecrets: settings.maskSecrets,
    maskInterfaces: settings.maskInterfaces,
    maskDomains: settings.maskDomains,
    maskIdentity: settings.maskIdentity
  };

  let chatHistory = [];
  const currentChatId = stateStore.get('currentChatId');
  if (currentChatId) {
    const activeChat = stateStore.get('history').find(h => h.id === currentChatId);
    if (activeChat && activeChat.messages) {
      chatHistory = activeChat.messages.map(msg => ({
        chatMessage: msg.chatMessage,
        pastedConfig: msg.pastedConfig,
        explanation: msg.result ? msg.result.explanation : '',
        correctedConfig: msg.result ? msg.result.correctedConfig : '',
        fixCommands: msg.result ? msg.result.fixCommands : ''
      }));
    }
  }

  const body = {
    pastedConfig: pastedVal,
    chatMessage: chatVal,
    chatHistory,
    provider: settings.provider,
    apiKey: settings.apiKey,
    baseUrl: settings.baseUrl,
    model: settings.model,
    systemPrompt: settings.prompt,
    language: stateStore.get('language'),
    maskOptions,
    routerOsVersion: els.selectRosVersion.value,
    hardwareModel: els.selectHardware.value
  };

  try {
    await runStepperAndSubmit(body);
    els.chatMessage.value = '';
    adjustTextAreaHeight();
  } finally {
    els.btnSubmit.disabled = false;
    els.submitIcon.classList.remove('hidden');
    els.loadingSpinner.classList.add('hidden');
  }
}

/**
 * ============================================================================
 * DEBOUNCED SEARCH HISTORY ACTION
 * ============================================================================
 */
const handleSearchInput = window.debounce((query) => {
  HistoryManager.renderList(query);
}, 250);

/**
 * ============================================================================
 * FULL-SCALE EVENT INTERFACES
 * ============================================================================
 */
function setupEventListeners() {
  els.btnToggleSidebar.addEventListener('click', () => {
    stateStore.set('isSidebarOpen', !stateStore.get('isSidebarOpen'));
    renderSidebarState();
  });

  els.btnCloseSidebar.addEventListener('click', () => {
    stateStore.set('isSidebarOpen', false);
    renderSidebarState();
  });

  els.settingLanguage.addEventListener('change', () => {
    stateStore.saveLanguage(els.settingLanguage.value);
    LocalizationService.updateUILanguage();
  });

  els.sidebarTabHistory.addEventListener('click', () => switchSidebarTab('history'));
  els.sidebarTabContext.addEventListener('click', () => switchSidebarTab('context'));
  els.sidebarTabPreferences.addEventListener('click', () => switchSidebarTab('preferences'));

  els.settingProvider.addEventListener('change', () => {
    stateStore.updateModelDefaults(els.settingProvider.value);
    // Bind updated default fields
    const updatedSettings = stateStore.get('settings');
    els.settingModel.value = updatedSettings.model || '';
    els.settingBaseurl.value = updatedSettings.baseUrl || '';
  });

  els.btnSaveSettings.addEventListener('click', () => {
    saveSettings();
    if (window.innerWidth < 1024) {
      stateStore.set('isSidebarOpen', false);
      renderSidebarState();
    }
  });

  els.btnTestConnection.addEventListener('click', testConnection);

  [els.maskIPs, els.maskMACs, els.maskSecrets, els.maskInterfaces, els.maskDomains, els.maskIdentity].forEach(el => {
    el.addEventListener('change', updatePrivacyShieldLabel);
  });

  els.btnToggleDrawer.addEventListener('click', toggleAttachmentDrawer);
  els.btnClearAttachment.addEventListener('click', () => {
    els.pastedConfig.value = '';
    stateStore.set('currentFile', null);
    els.fileInfoBar.classList.add('hidden');
    closeAttachmentDrawer();
  });

  els.btnCloseDiff.addEventListener('click', () => els.modalDiff.classList.add('hidden'));
  els.btnCloseCommands.addEventListener('click', () => els.modalCommands.classList.add('hidden'));

  [els.modalDiff, els.modalCommands].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  els.diffViewModeSplit.addEventListener('click', () => switchDiffMode('split'));
  els.diffViewModeUnified.addEventListener('click', () => switchDiffMode('unified'));

  els.commandViewModeChecklist.addEventListener('click', () => switchCommandMode('checklist'));
  els.commandViewModeRaw.addEventListener('click', () => switchCommandMode('raw'));

  els.btnQuickFirewall.addEventListener('click', loadFirewallTemplate);
  els.btnQuickRouting.addEventListener('click', loadRoutingTemplate);

  els.btnClearHistory.addEventListener('click', () => HistoryManager.clearAll());
  els.btnNewChat.addEventListener('click', startNewChat);
  els.btnHeaderNewChat.addEventListener('click', startNewChat);

  // Apply performance-optimized debounced search filter
  els.searchHistory.addEventListener('input', (e) => handleSearchInput(e.target.value));

  els.chatMessage.addEventListener('input', adjustTextAreaHeight);
  els.btnSubmit.addEventListener('click', submitChat);

  els.chatMessage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitChat();
    }
  });

  els.btnThemeToggle.addEventListener('click', toggleTheme);
}
