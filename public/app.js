// Main frontend JS for Mik the Winbox Wizard with Unified Chat Stream & Contextual dropdowns

// Professional UI Localization Dictionary
const i18n = {
  en: {
    title: 'Mik the Winbox Wizard — MikroTik Privacy AI Chatbot Assistant',
    headerTitle: 'Mik the Winbox Wizard',
    headerBadge: "Mik's Privacy Shield Active",
    headerDesc: 'RouterOS Configuration Auditor & Safe Correction Suite',
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
    settingsMaskIpsDesc: 'Scans IPv4/6; maps to [PRIV_IP_x] & [PUB_IP_x]',
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
    diffUnifiedDesc: 'Legenda Differenze: <span class="text-red-400">Linea Rossa = Originale</span> | <span class="text-cyber-emerald">Linea Verde = Corretta</span>',
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

// State Management
const state = {
  diffMode: 'split',        // 'split' | 'unified'
  commandMode: 'checklist', // 'checklist' | 'raw'
  language: 'auto',         // 'auto' | 'en' | 'it'
  theme: 'dark',            // 'dark' | 'light'
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
  // Active response data
  analysisResult: null,
  pastedConfigRaw: '',
  history: [], // List of { id, title, timestamp, pastedConfig, chatMessage, result, rosVersion, hardwareModel }
  currentFile: null,
  isAttachmentDrawerOpen: false,
  activeSettingsCategoryTab: 'ai' // 'ai' | 'privacy' | 'prompt'
};

// UI Elements Reference
const els = {
  pastedConfig: document.getElementById('pasted-config'),
  chatMessage: document.getElementById('chat-message'),
  btnSubmit: document.getElementById('btn-submit'),
  loadingSpinner: document.getElementById('loading-spinner'),
  submitIcon: document.getElementById('submit-icon'),

  // Theme Toggles
  btnThemeToggle: document.getElementById('btn-theme-toggle'),
  themeSunIcon: document.getElementById('theme-sun-icon'),
  themeMoonIcon: document.getElementById('theme-moon-icon'),

  // Sidebar controls
  sidebarBtnAudit: document.getElementById('sidebar-btn-audit'),
  sidebarBtnHistory: document.getElementById('sidebar-btn-history'),
  sidebarBtnHelp: document.getElementById('sidebar-btn-help'),
  historyBadge: document.getElementById('history-badge'),

  // History Drawer
  drawerHistory: document.getElementById('drawer-history'),
  btnClearHistory: document.getElementById('btn-clear-history'),
  searchHistory: document.getElementById('search-history'),
  historyItemsContainer: document.getElementById('history-items-container'),

  // Drag and Drop Zone & Overlays
  dragDropZone: document.getElementById('drag-drop-zone'),
  globalDragOverlay: document.getElementById('global-drag-overlay'),
  fileInfoBar: document.getElementById('file-info-bar'),
  fileNameLabel: document.getElementById('file-name-label'),
  fileSizeLabel: document.getElementById('file-size-label'),
  btnRemoveFile: document.getElementById('btn-remove-file'),
  fileInput: document.getElementById('file-input'),

  // Collapsible Attachment drawer
  attachmentDrawer: document.getElementById('attachment-drawer'),
  btnToggleDrawer: document.getElementById('btn-toggle-drawer'),
  btnClearAttachment: document.getElementById('btn-clear-attachment'),

  // Chat message stream area
  chatMessagesStream: document.getElementById('chat-messages-stream'),

  // Dropdown contexts
  selectRosVersion: document.getElementById('select-ros-version'),
  selectHardware: document.getElementById('select-hardware'),

  // MODALS
  modalDiff: document.getElementById('modal-diff'),
  modalCommands: document.getElementById('modal-commands'),
  btnCloseDiff: document.getElementById('btn-close-diff'),
  btnCloseCommands: document.getElementById('btn-close-commands'),

  // Modals Toggles & Content
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

  // Actions / Templates
  panelWelcome: document.getElementById('panel-welcome'),
  btnQuickFirewall: document.getElementById('btn-quick-firewall'),
  btnQuickRouting: document.getElementById('btn-quick-routing'),

  // Settings Sliding Panel Drawer
  btnSettings: document.getElementById('btn-settings'),
  modalSettings: document.getElementById('modal-settings'),
  settingsPanelDrawer: document.getElementById('settings-panel-drawer'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  btnTestConnection: document.getElementById('btn-test-connection'),
  testSpinner: document.getElementById('test-spinner'),
  testResult: document.getElementById('test-result'),

  // Settings Drawer Categories
  settingsTabAi: document.getElementById('settings-tab-ai'),
  settingsTabPrivacy: document.getElementById('settings-tab-privacy'),
  settingsTabPrompt: document.getElementById('settings-tab-prompt'),
  settingsSectionAi: document.getElementById('settings-section-ai'),
  settingsSectionPrivacy: document.getElementById('settings-section-privacy'),
  settingsSectionPrompt: document.getElementById('settings-section-prompt'),

  // Settings Fields
  settingProvider: document.getElementById('setting-provider'),
  settingModel: document.getElementById('setting-model'),
  settingApiKey: document.getElementById('setting-apikey'),
  settingBaseurl: document.getElementById('setting-baseurl'),
  settingPrompt: document.getElementById('setting-prompt'),
  settingLanguage: document.getElementById('setting-language'),

  // Settings Toggles
  maskIPs: document.getElementById('mask-ips'),
  maskMACs: document.getElementById('mask-macs'),
  maskSecrets: document.getElementById('mask-secrets'),
  maskInterfaces: document.getElementById('mask-interfaces'),
  maskDomains: document.getElementById('mask-domains'),
  maskIdentity: document.getElementById('mask-identity'),

  // Statuses
  llmStatusDot: document.getElementById('llm-status-dot'),
  llmStatusText: document.getElementById('llm-status-text'),
  privacyCount: document.getElementById('privacy-count'),

  // Privacy Stepper Loader
  privacyLoader: document.getElementById('privacy-loader'),
  stepperProgressBar: document.getElementById('stepper-progress-bar'),
  stepperPercentage: document.getElementById('stepper-percentage'),
  stepperLogText: document.getElementById('stepper-log-text'),
  stepMask: document.getElementById('step-mask'),
  stepTransit: document.getElementById('step-transit'),
  stepRestore: document.getElementById('step-restore'),
  stepDiff: document.getElementById('step-diff'),

  // Toast container
  toastContainer: document.getElementById('toast-container'),

  // Translatable Elements
  uiTitle: document.getElementById('ui-title'),
  uiHeaderTitle: document.getElementById('ui-header-title'),
  uiHeaderBadge: document.getElementById('ui-header-badge'),
  uiHeaderDesc: document.getElementById('ui-header-desc'),
  uiTooltipAudit: document.getElementById('ui-tooltip-audit'),
  uiTooltipHistory: document.getElementById('ui-tooltip-history'),
  uiTooltipUpload: document.getElementById('ui-tooltip-upload'),
  uiTooltipHelp: document.getElementById('ui-tooltip-help'),
  uiHistoryTitle: document.getElementById('ui-history-title'),
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
  uiLoaderTitle: document.getElementById('ui-loader-title'),
  uiLoaderStep1Title: document.getElementById('ui-loader-step1-title'),
  uiLoaderStep2Title: document.getElementById('ui-loader-step2-title'),
  uiLoaderStep3Title: document.getElementById('ui-loader-step3-title'),
  uiLoaderStep4Title: document.getElementById('ui-loader-step4-title'),
  uiSettingsPanelTitle: document.getElementById('ui-settings-panel-title'),
  uiLabelLlmProvider: document.getElementById('ui-label-llm-provider'),
  uiLabelModelName: document.getElementById('ui-label-model-name'),
  uiLabelTestConnection: document.getElementById('ui-label-test-connection'),
  uiLabelPrivacyPipeline: document.getElementById('ui-label-privacy-pipeline'),
  uiLabelPrivacyLocalTag: document.getElementById('ui-label-privacy-local-tag'),
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
  uiLabelPromptDesc: document.getElementById('ui-label-prompt-desc'),
  uiLabelSaveSettings: document.getElementById('ui-label-save-settings')
};

// INITIAL SETUP
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadHistory();
  setupEventListeners();
  setupDragAndDrop();
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
  updateUILanguage();
  adjustTextAreaHeight();
  applyActiveTheme();
});

// DYNAMIC UI TRANSLATION / LOCALIZATION
function updateUILanguage() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  // Title & Headers
  if (els.uiTitle) els.uiTitle.textContent = t.title;
  if (els.uiHeaderTitle) els.uiHeaderTitle.textContent = t.headerTitle;
  if (els.uiHeaderBadge) els.uiHeaderBadge.textContent = t.headerBadge;
  if (els.uiHeaderDesc) els.uiHeaderDesc.textContent = t.headerDesc;

  // Tooltips
  if (els.uiTooltipAudit) els.uiTooltipAudit.textContent = t.tooltipAudit;
  if (els.uiTooltipHistory) els.uiTooltipHistory.textContent = t.tooltipHistory;
  if (els.uiTooltipUpload) els.uiTooltipUpload.textContent = t.tooltipUpload;
  if (els.uiTooltipHelp) els.uiTooltipHelp.textContent = t.tooltipHelp;

  // History Sidebar
  if (els.uiHistoryTitle) {
    els.uiHistoryTitle.childNodes[2].textContent = ` ${t.historyTitle}`;
  }
  if (els.btnClearHistory) els.btnClearHistory.textContent = t.clearHistory;
  if (els.searchHistory) els.searchHistory.placeholder = t.searchHistoryPlaceholder;
  if (els.uiHistoryEmpty) els.uiHistoryEmpty.textContent = t.historyEmpty;

  // Left panel input
  if (els.uiLabelPasteConfig) {
    els.uiLabelPasteConfig.textContent = t.pasteConfigLabel;
  }
  if (els.pastedConfig) els.pastedConfig.placeholder = t.pastedConfigPlaceholder;
  if (els.uiDragTitle) els.uiDragTitle.textContent = t.dragTitle;
  if (els.uiDragDesc) els.uiDragDesc.textContent = t.dragDesc;
  if (els.chatMessage) els.chatMessage.placeholder = t.chatMessagePlaceholder;

  // Welcome panel
  if (els.uiLabelWelcomeTitle) els.uiLabelWelcomeTitle.textContent = t.welcomeTitle;
  if (els.uiLabelWelcomeDesc) els.uiLabelWelcomeDesc.innerHTML = t.welcomeDesc;
  if (els.uiLabelWelcomePrivacy) els.uiLabelWelcomePrivacy.textContent = t.welcomePrivacy;

  // Diff Headers
  if (els.uiLabelDiffOriginal) els.uiLabelDiffOriginal.textContent = t.diffOriginalHeader;
  if (els.uiLabelDiffCorrected) els.uiLabelDiffCorrected.textContent = t.diffCorrectedHeader;
  if (els.uiLabelDiffUnifiedDesc) els.uiLabelDiffUnifiedDesc.innerHTML = t.diffUnifiedDesc;

  // Fix commands
  if (els.uiLabelCommandsTip) {
    els.uiLabelCommandsTip.textContent = t.commandsTip;
  }

  // Stepper Loader
  if (els.uiLoaderTitle) els.uiLoaderTitle.textContent = t.loaderTitle;
  if (els.uiLoaderStep1Title) els.uiLoaderStep1Title.textContent = t.loaderStep1Title;
  if (els.uiLoaderStep2Title) els.uiLoaderStep2Title.textContent = t.loaderStep2Title;
  if (els.uiLoaderStep3Title) els.uiLoaderStep3Title.textContent = t.loaderStep3Title;
  if (els.uiLoaderStep4Title) els.uiLoaderStep4Title.textContent = t.loaderStep4Title;

  // Settings Panel Drawer
  if (els.uiSettingsPanelTitle) els.uiSettingsPanelTitle.textContent = t.settingsPanelTitle;
  if (els.settingsTabAi) els.settingsTabAi.textContent = t.settingsTabAi;
  if (els.settingsTabPrivacy) els.settingsTabPrivacy.textContent = t.settingsTabPrivacy;
  if (els.settingsTabPrompt) els.settingsTabPrompt.textContent = t.settingsTabPrompt;

  // Category 1 Fields
  if (els.uiLabelLlmProvider) els.uiLabelLlmProvider.textContent = t.settingsLabelLlmProvider;
  if (els.uiLabelModelName) els.uiLabelModelName.textContent = t.settingsLabelModelName;
  if (els.uiLabelTestConnection) els.uiLabelTestConnection.textContent = t.settingsBtnTestConnection;

  // Category 2 Fields
  if (els.uiLabelPrivacyPipeline) els.uiLabelPrivacyPipeline.textContent = t.settingsLabelPrivacyPipeline;
  if (els.uiLabelPrivacyLocalTag) els.uiLabelPrivacyLocalTag.textContent = t.settingsLabelPrivacyLocalTag;
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

  // Category 3 Fields
  if (els.uiLabelPromptOverride) els.uiLabelPromptOverride.textContent = t.settingsLabelPromptOverride;
  if (els.uiLabelPromptDesc) els.uiLabelPromptDesc.textContent = t.settingsLabelPromptDesc;
  if (els.settingPrompt) els.settingPrompt.placeholder = t.settingsPromptPlaceholder;

  // Save Settings button
  if (els.uiLabelSaveSettings) els.uiLabelSaveSettings.textContent = t.settingsBtnSave;

  // Dynamic status badges
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
  renderHistoryList();
}

// LOAD SETTINGS
function loadSettings() {
  const saved = localStorage.getItem('mikrotik_chatbot_settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.settings = { ...state.settings, ...parsed };
    } catch (e) {
      console.error('Error parsing settings', e);
    }
  } else {
    updateModelDefaults(state.settings.provider);
  }

  const savedLang = localStorage.getItem('mikrotik_chatbot_language');
  if (savedLang) {
    state.language = savedLang;
  } else {
    state.language = 'auto';
  }
  els.settingLanguage.value = state.language;

  const savedTheme = localStorage.getItem('mikrotik_chatbot_theme');
  if (savedTheme) {
    state.theme = savedTheme;
  } else {
    state.theme = 'dark';
  }

  // Populate Inputs
  els.settingProvider.value = state.settings.provider;
  els.settingModel.value = state.settings.model || '';
  els.settingApiKey.value = state.settings.apiKey || '';
  els.settingBaseurl.value = state.settings.baseUrl || '';
  els.settingPrompt.value = state.settings.prompt || '';

  // Populate Toggles
  els.maskIPs.checked = state.settings.maskIPs;
  els.maskMACs.checked = state.settings.maskMACs;
  els.maskSecrets.checked = state.settings.maskSecrets;
  els.maskInterfaces.checked = state.settings.maskInterfaces;
  els.maskDomains.checked = state.settings.maskDomains;
  els.maskIdentity.checked = state.settings.maskIdentity;
}

// SAVE SETTINGS
function saveSettings() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  state.settings.provider = els.settingProvider.value;
  state.settings.model = els.settingModel.value;
  state.settings.apiKey = els.settingApiKey.value;
  state.settings.baseUrl = els.settingBaseurl.value;
  state.settings.prompt = els.settingPrompt.value;

  state.settings.maskIPs = els.maskIPs.checked;
  state.settings.maskMACs = els.maskMACs.checked;
  state.settings.maskSecrets = els.maskSecrets.checked;
  state.settings.maskInterfaces = els.maskInterfaces.checked;
  state.settings.maskDomains = els.maskDomains.checked;
  state.settings.maskIdentity = els.maskIdentity.checked;

  localStorage.setItem('mikrotik_chatbot_settings', JSON.stringify(state.settings));
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
  showToast(t.toastSettingsSaved, 'success');
}

// UPDATE DEFAULTS
function updateModelDefaults(provider) {
  let model = '';
  let baseUrl = '';
  if (provider === 'openai') {
    model = 'gpt-4o-mini';
    baseUrl = '';
  } else if (provider === 'anthropic') {
    model = 'claude-3-5-sonnet-20240620';
    baseUrl = '';
  } else if (provider === 'openrouter') {
    model = 'meta-llama/llama-3-8b-instruct:free';
    baseUrl = '';
  } else if (provider === 'ollama') {
    model = 'llama3';
    baseUrl = 'http://localhost:11434';
  } else if (provider === 'custom') {
    model = '';
    baseUrl = 'http://localhost:11434';
  }

  els.settingModel.value = model;
  els.settingBaseurl.value = baseUrl;
}

// TOAST NOTIFICATIONS
function showToast(message, type = 'info') {
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

  els.toastContainer.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Automatically remove toast
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// DRAG AND DROP HANDLERS
function setupDragAndDrop() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  // Global window drag handlers to fade overlay in/out elegantly
  window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    els.globalDragOverlay.classList.remove('hidden');
  });

  els.globalDragOverlay.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

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
    state.currentFile = null;
    els.pastedConfig.value = '';
    els.pastedConfig.disabled = false;
    els.fileInfoBar.classList.add('hidden');
  });

  els.fileInput.addEventListener('change', (e) => {
    if (els.fileInput.files && els.fileInput.files.length > 0) {
      handleUploadedFile(els.fileInput.files[0]);
    }
  });
}

function handleUploadedFile(file) {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  const validExtensions = ['.rsc', '.txt', '.log'];
  const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

  if (!validExtensions.includes(ext) && file.type !== 'text/plain') {
    showToast(t.toastFileUploadError, 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    state.currentFile = file;
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

// SETUP EVENT LISTENERS
function setupEventListeners() {
  // Toggle Settings Drawer
  els.btnSettings.addEventListener('click', () => {
    loadSettings();
    els.modalSettings.classList.remove('hidden');
    setTimeout(() => {
      els.settingsPanelDrawer.classList.remove('translate-x-full');
    }, 10);
    els.testResult.textContent = '';
  });

  const closeSettingsHandler = () => {
    els.settingsPanelDrawer.classList.add('translate-x-full');
    setTimeout(() => {
      els.modalSettings.classList.add('hidden');
    }, 300);
  };

  els.btnCloseSettings.addEventListener('click', closeSettingsHandler);
  els.modalSettings.addEventListener('click', (e) => {
    if (e.target === els.modalSettings) {
      closeSettingsHandler();
    }
  });

  // Language selector
  els.settingLanguage.addEventListener('change', () => {
    state.language = els.settingLanguage.value;
    localStorage.setItem('mikrotik_chatbot_language', state.language);
    updateUILanguage();
  });

  // Settings Category switcher
  els.settingsTabAi.addEventListener('click', () => switchSettingsCategoryTab('ai'));
  els.settingsTabPrivacy.addEventListener('click', () => switchSettingsCategoryTab('privacy'));
  els.settingsTabPrompt.addEventListener('click', () => switchSettingsCategoryTab('prompt'));

  els.settingProvider.addEventListener('change', () => {
    updateModelDefaults(els.settingProvider.value);
  });

  els.btnSaveSettings.addEventListener('click', () => {
    saveSettings();
    closeSettingsHandler();
  });

  // Test Connection
  els.btnTestConnection.addEventListener('click', testConnection);

  // Dynamic status indicators
  [els.maskIPs, els.maskMACs, els.maskSecrets, els.maskInterfaces, els.maskDomains, els.maskIdentity].forEach(el => {
    el.addEventListener('change', updatePrivacyShieldLabel);
  });

  // Sidebar Controls
  els.sidebarBtnAudit.addEventListener('click', () => {
    els.drawerHistory.classList.add('hidden');
    resetChatWorkspace();
  });

  els.sidebarBtnHistory.addEventListener('click', () => {
    els.drawerHistory.classList.toggle('hidden');
  });

  els.sidebarBtnHelp.addEventListener('click', () => {
    const currentLang = state.language === 'auto' ? 'en' : state.language;
    const t = i18n[currentLang] || i18n.en;
    showToast(t.tooltipHelp + ': ' + t.welcomePrivacy, 'info');
  });

  // Collapsible Attachment Drawer trigger
  els.btnToggleDrawer.addEventListener('click', toggleAttachmentDrawer);
  els.btnClearAttachment.addEventListener('click', () => {
    els.pastedConfig.value = '';
    state.currentFile = null;
    els.fileInfoBar.classList.add('hidden');
    closeAttachmentDrawer();
  });

  // Modal closers
  els.btnCloseDiff.addEventListener('click', () => els.modalDiff.classList.add('hidden'));
  els.btnCloseCommands.addEventListener('click', () => els.modalCommands.classList.add('hidden'));

  // Modals click-away
  [els.modalDiff, els.modalCommands].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // Diff view mode toggles inside modal
  els.diffViewModeSplit.addEventListener('click', () => switchDiffMode('split'));
  els.diffViewModeUnified.addEventListener('click', () => switchDiffMode('unified'));

  // Commands checklist toggles inside modal
  els.commandViewModeChecklist.addEventListener('click', () => switchCommandMode('checklist'));
  els.commandViewModeRaw.addEventListener('click', () => switchCommandMode('raw'));

  // Quick Action Welcome Panel triggers
  els.btnQuickFirewall.addEventListener('click', loadFirewallTemplate);
  els.btnQuickRouting.addEventListener('click', loadRoutingTemplate);

  // Clear Session History button
  els.btnClearHistory.addEventListener('click', clearHistory);

  // History filtering input
  els.searchHistory.addEventListener('input', () => renderHistoryList(els.searchHistory.value));

  // Chat message height auto adjustment
  els.chatMessage.addEventListener('input', adjustTextAreaHeight);

  // Submission
  els.btnSubmit.addEventListener('click', submitChat);

  // Enter key trigger for quick sending (Shift+Enter for new line)
  els.chatMessage.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitChat();
    }
  });

  // Theme Toggle Button
  els.btnThemeToggle.addEventListener('click', toggleTheme);
}

// APPLY ACTIVE THEME
function applyActiveTheme() {
  const isLight = state.theme === 'light';
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

// TOGGLE THEME
function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mikrotik_chatbot_theme', state.theme);
  applyActiveTheme();
}

function switchSettingsCategoryTab(catId) {
  state.activeSettingsCategoryTab = catId;

  // Reset category styles
  [els.settingsTabAi, els.settingsTabPrivacy, els.settingsTabPrompt].forEach(el => {
    el.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md text-slate-400 hover:text-white transition';
  });

  els.settingsSectionAi.classList.add('hidden');
  els.settingsSectionPrivacy.classList.add('hidden');
  els.settingsSectionPrompt.classList.add('hidden');

  if (catId === 'ai') {
    els.settingsTabAi.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-cyber-border transition';
    els.settingsSectionAi.classList.remove('hidden');
  } else if (catId === 'privacy') {
    els.settingsTabPrivacy.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-cyber-border transition';
    els.settingsSectionPrivacy.classList.remove('hidden');
  } else if (catId === 'prompt') {
    els.settingsTabPrompt.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-cyber-border transition';
    els.settingsSectionPrompt.classList.remove('hidden');
  }
}

// TOGGLE ATTACHMENT DRAWER
function toggleAttachmentDrawer() {
  if (state.isAttachmentDrawerOpen) {
    closeAttachmentDrawer();
  } else {
    openAttachmentDrawer();
  }
}

function openAttachmentDrawer() {
  state.isAttachmentDrawerOpen = true;
  els.attachmentDrawer.classList.remove('hidden');
  els.btnToggleDrawer.classList.add('bg-brand-500/10', 'text-brand-400');
}

function closeAttachmentDrawer() {
  state.isAttachmentDrawerOpen = false;
  els.attachmentDrawer.classList.add('hidden');
  els.btnToggleDrawer.classList.remove('bg-brand-500/10', 'text-brand-400');
}

// TEXT AREA AUTO GROW
function adjustTextAreaHeight() {
  const textarea = els.chatMessage;
  textarea.style.height = '38px';
  textarea.style.height = Math.max(38, Math.min(textarea.scrollHeight, 128)) + 'px';
}

// LOCAL HISTORY PERSISTENCE
function loadHistory() {
  const saved = localStorage.getItem('mikrotik_chatbot_history');
  if (saved) {
    try {
      state.history = JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing history', e);
    }
  }
  renderHistoryList();
}

function saveHistoryItem(item) {
  state.history.unshift(item);
  if (state.history.length > 25) {
    state.history.pop();
  }
  localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(state.history));
  renderHistoryList();
}

function renderHistoryList(filterQuery = '') {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  const container = els.historyItemsContainer;
  container.innerHTML = '';

  const filtered = state.history.filter(item => {
    const q = filterQuery.toLowerCase();
    return item.title.toLowerCase().includes(q) ||
           (item.chatMessage && item.chatMessage.toLowerCase().includes(q));
  });

  els.historyBadge.textContent = state.history.length;

  if (state.history.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">${t.historyEmpty}</div>`;
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">${t.historyQueryEmpty}</div>`;
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'group/item relative p-3.5 bg-cyber-bg/60 hover:bg-[#1e1b4b]/40 border border-cyber-border rounded-2xl transition cursor-pointer flex flex-col gap-1';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'absolute top-3 right-3 text-slate-500 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition p-1 hover:bg-red-500/10 rounded-md';
    deleteBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.history = state.history.filter(h => h.id !== item.id);
      localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(state.history));
      renderHistoryList(filterQuery);
    });

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between pr-5';

    const title = document.createElement('span');
    title.className = 'text-xs font-bold text-slate-200 truncate block max-w-[180px]';
    title.textContent = item.title;

    const time = document.createElement('span');
    time.className = 'text-[9px] text-slate-500 font-mono';
    time.textContent = item.timestamp;

    header.appendChild(title);
    header.appendChild(time);

    const desc = document.createElement('p');
    desc.className = 'text-[10px] text-slate-400 line-clamp-2 leading-normal';
    desc.textContent = item.chatMessage || t.historyNoDesc;

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(deleteBtn);

    card.addEventListener('click', () => {
      restoreHistoryItem(item);
    });

    container.appendChild(card);
  });
}

function restoreHistoryItem(item) {
  // Clear chat stream and restore a single conversation step
  els.chatMessagesStream.innerHTML = '';
  els.panelWelcome.classList.add('hidden');

  state.analysisResult = item.result;
  state.pastedConfigRaw = item.pastedConfig;

  // Set selectors
  els.selectRosVersion.value = item.rosVersion || 'auto';
  els.selectHardware.value = item.hardwareModel || 'auto';

  // Inject User Message
  appendUserMessage(item.chatMessage, item.pastedConfig);

  // Inject Assistant Response
  appendAssistantResponse(item.result);

  els.drawerHistory.classList.add('hidden');
  showToast('Restored conversation from history!', 'success');
}

function clearHistory() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  state.history = [];
  localStorage.removeItem('mikrotik_chatbot_history');
  renderHistoryList();
  showToast(t.historyWipeToast, 'success');
}

function updatePrivacyShieldLabel() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

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
  const prov = state.settings.provider;
  const hasKey = !!state.settings.apiKey;

  if (prov === 'ollama' || prov === 'custom') {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-cyber-emerald rounded-full animate-pulse shadow-emerald-glow';
    els.llmStatusText.textContent = `LAN Active (${prov.toUpperCase()})`;
    els.llmStatusText.className = 'font-bold text-cyber-emerald text-[10px] tracking-wide';
  } else if (hasKey) {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-cyber-emerald rounded-full animate-pulse shadow-emerald-glow';
    els.llmStatusText.textContent = `Secure Cloud Active`;
    els.llmStatusText.className = 'font-bold text-cyber-emerald text-[10px] tracking-wide';
  } else {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-slate-500 rounded-full';
    els.llmStatusText.textContent = 'LLM Offline (Requires Key/API)';
    els.llmStatusText.className = 'font-medium text-slate-400 text-[10px]';
  }
}

// SIMULATE CONNECTION TEST
async function testConnection() {
  const prov = els.settingProvider.value;
  const key = els.settingApiKey.value;
  const model = els.settingModel.value;
  const base = els.settingBaseurl.value;

  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

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

// RESET WORKSPACE
function resetChatWorkspace() {
  els.chatMessagesStream.innerHTML = '';
  els.chatMessagesStream.appendChild(els.panelWelcome);
  els.panelWelcome.classList.remove('hidden');
  state.analysisResult = null;
  state.pastedConfigRaw = '';
  els.pastedConfig.value = '';
  els.chatMessage.value = '';
  state.currentFile = null;
  els.fileInfoBar.classList.add('hidden');
  closeAttachmentDrawer();
  adjustTextAreaHeight();
}

// TEMPLATE LOADING
function loadFirewallTemplate() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  els.pastedConfig.value = `/ip firewall filter\nadd action=accept chain=input comment="defconf: accept established,related" connection-state=established,related\nadd action=drop chain=input comment="defconf: drop invalid" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment="defconf: drop WAN access" in-interface-list=WAN\nadd action=accept chain=forward comment="defconf: accept in-interface=ether1" in-interface=ether1`;
  els.chatMessage.value = "Audita le mie regole di firewall. Ci sono vulnerabilità o porte non protette?";
  openAttachmentDrawer();
  showToast(t.toastTemplateFirewall, 'success');
}

function loadRoutingTemplate() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  els.pastedConfig.value = `/ip route\nadd dst-address=0.0.0.0/0 gateway=192.168.88.1 routing-table=main\n/ip dns\nset allow-remote-requests=yes servers=8.8.8.8,1.1.1.1`;
  els.chatMessage.value = "Why cannot users connect to local addresses, and how should static gateway routes be defined securely?";
  openAttachmentDrawer();
  showToast(t.toastTemplateRouting, 'success');
}

// TOGGLE MODAL VIEWS & RENDERING DIFF / COMMANDS
function switchDiffMode(modeId) {
  state.diffMode = modeId;
  els.diffViewModeSplit.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';
  els.diffViewModeUnified.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';

  if (modeId === 'split') {
    els.diffViewModeSplit.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-cyber-border transition';
  } else {
    els.diffViewModeUnified.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-cyber-border transition';
  }

  if (state.analysisResult) {
    renderDiff(state.pastedConfigRaw, state.analysisResult.correctedConfig || '');
  }
}

function switchCommandMode(modeId) {
  state.commandMode = modeId;
  els.commandViewModeChecklist.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';
  els.commandViewModeRaw.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';

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

// LIGHTWEIGHT LINE DIFF ENGINE
function computeLineDiff(originalText, correctedText) {
  const leftLines = originalText.split('\n');
  const rightLines = correctedText.split('\n');

  const alignedLines = [];
  let i = 0, j = 0;

  while (i < leftLines.length || j < rightLines.length) {
    const leftLine = leftLines[i] !== undefined ? leftLines[i] : null;
    const rightLine = rightLines[j] !== undefined ? rightLines[j] : null;

    if (leftLine === rightLine) {
      if (leftLine !== null) {
        alignedLines.push({ type: 'equal', left: leftLine, right: rightLine });
      }
      i++; j++;
    } else {
      const leftLookahead = leftLines[i + 1] !== undefined ? leftLines[i + 1] : null;
      const rightLookahead = rightLines[j + 1] !== undefined ? rightLines[j + 1] : null;

      if (leftLine !== null && rightLine !== null && leftLine.trim() !== '' && rightLine.trim() !== '' &&
          (leftLine.substring(0, 8) === rightLine.substring(0, 8) || leftLine.includes('interface') && rightLine.includes('interface'))) {
        alignedLines.push({ type: 'modify', left: leftLine, right: rightLine });
        i++; j++;
      } else if (leftLine !== null && rightLookahead === leftLine) {
        alignedLines.push({ type: 'insert', left: '', right: rightLine });
        j++;
      } else if (rightLine !== null && leftLookahead === rightLine) {
        alignedLines.push({ type: 'delete', left: leftLine, right: '' });
        i++;
      } else {
        if (leftLine !== null && rightLine !== null) {
          alignedLines.push({ type: 'modify', left: leftLine, right: rightLine });
          i++; j++;
        } else if (leftLine !== null) {
          alignedLines.push({ type: 'delete', left: leftLine, right: '' });
          i++;
        } else if (rightLine !== null) {
          alignedLines.push({ type: 'insert', left: '', right: rightLine });
          j++;
        }
      }
    }
  }

  return alignedLines;
}

function renderDiff(originalText, correctedText) {
  const tbody = els.diffTableBody;
  tbody.innerHTML = '';

  const alignedLines = computeLineDiff(originalText, correctedText);

  if (state.diffMode === 'split') {
    els.diffSplitHeaders.classList.remove('hidden');
    els.diffUnifiedHeader.classList.add('hidden');

    alignedLines.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-900/60 hover:bg-slate-900/40 text-slate-300';

      const tdLeft = document.createElement('td');
      tdLeft.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs border-r border-slate-900';

      const tdRight = document.createElement('td');
      tdRight.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';

      if (row.type === 'equal') {
        tdLeft.textContent = row.left;
        tdRight.textContent = row.right;
        tdLeft.className += ' text-slate-600';
        tdRight.className += ' text-slate-600';
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
      if (row.type === 'equal') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40 text-slate-500';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';
        td.textContent = `  ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'delete') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-deleted text-cyber-red font-medium';
        td.textContent = `- ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'insert') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-inserted text-cyber-emerald font-medium';
        td.textContent = `+ ${row.right}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'modify') {
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
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

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
    text.className = 'text-xs text-slate-200 font-mono select-text break-all leading-normal';
    text.textContent = line;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        text.className += ' line-through opacity-40';
        item.className = 'p-3 bg-cyber-bg/40 border border-cyber-border rounded-xl flex items-center justify-between space-x-3 opacity-60 transition';
      } else {
        text.className = 'text-xs text-slate-200 font-mono select-text break-all leading-normal';
        item.className = 'p-3 bg-cyber-bg border border-cyber-border rounded-xl flex items-center justify-between space-x-3 hover:border-slate-700 transition';
      }
    });

    left.appendChild(checkbox);
    left.appendChild(text);

    const btnCopy = document.createElement('button');
    btnCopy.className = 'text-[10px] bg-cyber-panel border border-cyber-border hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0 transition active:scale-95';
    btnCopy.textContent = t.copyLabel;

    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(line).then(() => {
        btnCopy.textContent = t.copiedText;
        btnCopy.className = 'text-[10px] bg-emerald-950 border border-cyber-emerald text-cyber-emerald font-bold px-2.5 py-1 rounded-lg shrink-0 transition';
        showToast(t.toastCopySuccess, 'success');
        setTimeout(() => {
          btnCopy.textContent = t.copyLabel;
          btnCopy.className = 'text-[10px] bg-cyber-panel border border-cyber-border hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0';
        }, 1500);
      });
    });

    item.appendChild(left);
    item.appendChild(btnCopy);
    container.appendChild(item);
  });
}

// MARKDOWN RENDERING FOR EXPLANATIONS IN CHAT BUBBLE
function renderMarkdown(text) {
  if (!text) return '';
  let html = text;

  // Escape HTML tags
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore markers
  html = html
    .replace(/&lt;&lt;&lt;EXPLANATION&gt;&gt;&gt;/g, '')
    .replace(/&lt;&lt;&lt;END_EXPLANATION&gt;&gt;&gt;/g, '');

  // Bullet lists
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-4 list-disc text-slate-300">$1</li>');
  html = html.replace(/(<li.*<\/li>)/gs, '<ul class="my-2 space-y-1.5">$1</ul>');

  // Headers (###, ##, #)
  html = html.replace(/^### (.*$)/gim, '<h5 class="text-xs font-black text-white mt-4 mb-2 uppercase tracking-wide">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="text-sm font-bold text-white mt-5 mb-2 border-b border-cyber-border pb-1.5">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="text-base font-bold text-cyber-accent mt-6 mb-3">$1</h3>');

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // Inline code (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-[#0b0f19] text-cyber-accent font-mono text-[11px] px-1.5 py-0.5 rounded border border-cyber-border">$1</code>');

  // Code blocks (with custom styling and copy button)
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, (match, code) => {
    const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);
    // Escape raw code again to be 100% safe
    const escapedCode = code.trim();
    return `
      <div class="relative group/code my-3.5 border border-cyber-border rounded-xl overflow-hidden bg-slate-950 font-mono text-xs select-text">
        <div class="flex items-center justify-between px-4 py-2 bg-cyber-panel/80 border-b border-cyber-border select-none">
          <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">RouterOS Spell</span>
          <button onclick="copySnippetText('${uniqueId}', this)" class="text-[10px] bg-[#1e1b4b] border border-cyber-border hover:bg-indigo-900 text-slate-300 px-2.5 py-1 rounded-md font-bold transition">Copy Code</button>
        </div>
        <pre id="${uniqueId}" class="p-3.5 text-slate-300 overflow-x-auto leading-relaxed select-all">${escapedCode}</pre>
      </div>
    `;
  });

  // Newlines to paragraphs
  html = html.split('\n\n').map(p => {
    const trimmed = p.trim();
    if (trimmed.startsWith('<h') || trimmed.startsWith('<u') || trimmed.startsWith('<div') || trimmed.startsWith('<li')) {
      return p;
    }
    return `<p class="mb-3 text-slate-300 leading-relaxed">${p}</p>`;
  }).join('');

  return html;
}

// Snippet copying logic exposed globally
window.copySnippetText = function(id, btn) {
  const pre = document.getElementById(id);
  if (!pre) return;

  const text = pre.innerText;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = 'Copied!';
    btn.className = 'text-[10px] bg-emerald-950 border border-cyber-emerald text-cyber-emerald px-2.5 py-1 rounded-md font-bold transition';
    showToast('Snippet copied successfully!', 'success');
    setTimeout(() => {
      btn.textContent = orig;
      btn.className = 'text-[10px] bg-[#1e1b4b] border border-cyber-border hover:bg-indigo-900 text-slate-300 px-2.5 py-1 rounded-md font-bold transition';
    }, 1500);
  });
};

// APPEND USER BUBBLE
function appendUserMessage(messageText, pastedConfigText) {
  const stream = els.chatMessagesStream;
  const bubble = document.createElement('div');
  bubble.className = 'flex flex-col space-y-2.5 items-end max-w-3xl ml-auto w-full select-text';

  let attachmentHtml = '';
  if (pastedConfigText) {
    attachmentHtml = `
      <div class="glow-border-purple text-xs rounded-2xl p-3 bg-cyber-panel/85 border border-cyber-border max-w-full font-mono text-[10px] text-slate-400 select-text overflow-x-auto max-h-40 whitespace-pre">
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

  stream.appendChild(bubble);
  scrollStreamToBottom();
}

// APPEND ASSISTANT RESPONSE
function appendAssistantResponse(result) {
  const stream = els.chatMessagesStream;
  const container = document.createElement('div');
  container.className = 'flex flex-col space-y-2.5 items-start max-w-3xl mr-auto w-full select-text';

  const explanationHtml = renderMarkdown(result.explanation || 'No explanation returned.');

  container.innerHTML = `
    <div class="flex items-center space-x-2 text-[10px] text-slate-500 font-semibold select-none">
      <span class="text-cyber-accent">🧙‍♂️ Mik the Winbox Wizard</span>
      <span>•</span>
      <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
    <div class="chat-bubble-assistant text-xs text-slate-300 p-5 rounded-2xl leading-relaxed shadow-xl max-w-full w-full">
      ${explanationHtml}

      <!-- Bottom action overlays -->
      <div class="flex items-center gap-2 pt-4 border-t border-cyber-border mt-4 select-none">
        <button id="btn-show-diff-overlay" class="bg-brand-500 hover:bg-brand-600 border border-brand-100/10 text-white font-bold px-4 py-2 rounded-xl text-[10px] flex items-center gap-1.5 transition active:scale-95 shadow">
          <span>🔎</span> View Config Diff
        </button>
        <button id="btn-show-checklist-overlay" class="bg-[#1e1b4b] hover:bg-indigo-900 border border-cyber-border text-slate-300 hover:text-white font-bold px-4 py-2 rounded-xl text-[10px] flex items-center gap-1.5 transition active:scale-95 shadow">
          <span>📋</span> View Fix Checklist
        </button>
      </div>
    </div>
  `;

  // Bind the buttons inside the bubble
  container.querySelector('#btn-show-diff-overlay').addEventListener('click', () => {
    renderDiff(state.pastedConfigRaw, result.correctedConfig || '');
    els.modalDiff.classList.remove('hidden');
  });

  container.querySelector('#btn-show-checklist-overlay').addEventListener('click', () => {
    renderCommands(result.fixCommands || '');
    els.modalCommands.classList.remove('hidden');
  });

  stream.appendChild(container);
  scrollStreamToBottom();
}

function scrollStreamToBottom() {
  els.chatMessagesStream.scrollTop = els.chatMessagesStream.scrollHeight;
}

// MULTI-STEP PROGRESSIVE PIPELINE SUBMISSION
async function runStepperAndSubmit(submitPayload) {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  // Render progressive stepper
  els.privacyLoader.classList.remove('hidden');
  updateStep(els.stepMask, 'active', t.loaderStep1DescActive);
  updateStep(els.stepTransit, 'pending', t.loaderStep1DescPending);
  updateStep(els.stepRestore, 'pending', t.loaderStep1DescPending);
  updateStep(els.stepDiff, 'pending', t.loaderStep1DescPending);

  setProgressBar(15, '15%');

  // Stage 1: Masking
  await delay(700);
  updateStep(els.stepMask, 'complete', t.loaderStep1DescComplete);
  updateStep(els.stepTransit, 'active', t.loaderStep2DescActive);
  setProgressBar(40, '40%');

  // Stage 2: AI Transit & Call API
  let serverResponseData = null;
  let serverError = null;

  try {
    const fetchPromise = fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitPayload)
    });

    const timeoutPromise = delay(1200); // Minimum feed for stunning visual UI

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
    els.privacyLoader.classList.add('hidden');
    showToast(serverError.message, 'error');
    alert(`Audit Failed: ${serverError.message}`);
    return;
  }

  // Stage 3: Restoration
  updateStep(els.stepTransit, 'complete', t.loaderStep2DescComplete);
  updateStep(els.stepRestore, 'active', t.loaderStep3DescActive);
  setProgressBar(75, '75%');
  await delay(600);

  // Stage 4: Formatting Diff
  updateStep(els.stepRestore, 'complete', t.loaderStep3DescComplete);
  updateStep(els.stepDiff, 'active', t.loaderStep4DescActive);
  setProgressBar(95, '95%');
  await delay(500);

  // Completed
  setProgressBar(100, '100%');
  updateStep(els.stepDiff, 'complete', t.loaderStep4DescComplete);
  await delay(300);

  // Load results into active state
  state.analysisResult = serverResponseData;

  // Clear welcome panel
  els.panelWelcome.classList.add('hidden');

  // Inject User bubble & assistant response
  appendUserMessage(submitPayload.chatMessage, state.pastedConfigRaw);
  appendAssistantResponse(serverResponseData);

  // Hide loader
  els.privacyLoader.classList.add('hidden');
  showToast(t.toastPipelineComplete, 'success');

  // Clear attachment inputs after success to prepare next input cleanly
  els.pastedConfig.value = '';
  state.currentFile = null;
  els.fileInfoBar.classList.add('hidden');
  closeAttachmentDrawer();

  // Save conversation step in history list
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const title = state.currentFile ? state.currentFile.name : `RouterOS Config ${state.history.length + 1}`;

  saveHistoryItem({
    id: Date.now(),
    title,
    timestamp,
    pastedConfig: state.pastedConfigRaw,
    chatMessage: submitPayload.chatMessage || 'Configuration audit request',
    rosVersion: submitPayload.routerOsVersion,
    hardwareModel: submitPayload.hardwareModel,
    result: serverResponseData
  });
}

function updateStep(el, state, text) {
  const indicator = el.querySelector('.step-indicator');
  const stat = el.querySelector('.step-stat');

  els.stepperLogText.textContent = text;

  if (state === 'active') {
    el.className = 'flex items-center justify-between text-slate-200';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-cyan-500/50 text-[10px] font-bold flex items-center justify-center bg-slate-950 text-cyber-accent pulse-ring-active shadow-cyber-glow';
    stat.textContent = 'Active';
    stat.className = 'step-stat text-[10px] font-mono text-cyber-accent';
  } else if (state === 'complete') {
    el.className = 'flex items-center justify-between text-slate-400';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-emerald-500/50 text-[10px] font-bold flex items-center justify-center bg-slate-900 text-cyber-emerald';
    indicator.innerHTML = '✓';
    stat.textContent = 'Completed';
    stat.className = 'step-stat text-[10px] font-mono text-cyber-emerald';
  } else {
    el.className = 'flex items-center justify-between text-slate-600';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-slate-850 text-[10px] font-bold flex items-center justify-center bg-slate-950 text-slate-600';
    stat.textContent = 'Pending';
    stat.className = 'step-stat text-[10px] font-mono text-slate-600';
  }
}

function setProgressBar(pct, text) {
  els.stepperProgressBar.style.width = pct + '%';
  els.stepperPercentage.textContent = text;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// SUBMIT COMPREHENSIVE CONVERSATION CHAT
async function submitChat() {
  const pastedVal = els.pastedConfig.value.trim();
  const chatVal = els.chatMessage.value.trim();

  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  if (!pastedVal && !chatVal) {
    showToast('Please attach a configuration or write a question!', 'error');
    return;
  }

  // Toggle submit buttons state
  els.btnSubmit.disabled = true;
  els.submitIcon.classList.add('hidden');
  els.loadingSpinner.classList.remove('hidden');

  state.pastedConfigRaw = pastedVal;

  const maskOptions = {
    maskIPs: state.settings.maskIPs,
    maskMACs: state.settings.maskMACs,
    maskSecrets: state.settings.maskSecrets,
    maskInterfaces: state.settings.maskInterfaces,
    maskDomains: state.settings.maskDomains,
    maskIdentity: state.settings.maskIdentity
  };

  const body = {
    pastedConfig: pastedVal,
    chatMessage: chatVal,
    provider: state.settings.provider,
    apiKey: state.settings.apiKey,
    baseUrl: state.settings.baseUrl,
    model: state.settings.model,
    systemPrompt: state.settings.prompt,
    language: state.language,
    maskOptions,
    routerOsVersion: els.selectRosVersion.value,
    hardwareModel: els.selectHardware.value
  };

  try {
    await runStepperAndSubmit(body);
    // Clear chat input on successful completion
    els.chatMessage.value = '';
    adjustTextAreaHeight();
  } finally {
    els.btnSubmit.disabled = false;
    els.submitIcon.classList.remove('hidden');
    els.loadingSpinner.classList.add('hidden');
  }
}
