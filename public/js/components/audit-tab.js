const AuditTab = {
  // Localization dictionary (i18n)
  i18n: {
    en: {
      welcomeTitle: 'MikrotikAssistant: The Privacy-First RouterOS Configuration Auditor & Generator',
      welcomeDesc: 'Analyze, secure, and optimize your MikroTik configurations with absolute privacy.',
      welcomePrivacy: "🛡️ Fully Privacy Guarded: Mik's Privacy Shield ensures your passwords, IPs, MACs, custom interface names, and identities never leave this machine.",
      step1Title: 'Paste Config',
      step1Desc: 'Paste your raw RouterOS export or logs safely into the secure attachment drawer.',
      step2Title: 'Local Masking',
      step2Desc: 'Our fully client-side Privacy Shield scrubs all passwords, secrets, IPs, and MACs before any transmission.',
      step3Title: 'Expert Audit',
      step3Desc: 'The system diagnoses vulnerabilities, flags issues, and generates precise corrective RouterOS CLI delta commands.',
      scenariosHeader: 'Quick Start Scenarios',
      scenarioFirewallTitle: 'Audit my Firewall Security',
      scenarioFirewallDesc: 'Pre-fills a basic firewall configuration and requests a vulnerability audit.',
      scenarioVlanTitle: 'Setup a Guest Wi-Fi VLAN',
      scenarioVlanDesc: 'Pre-fills a step-by-step VLAN command generation scenario for VLAN 20.',
      scenarioQueuesTitle: 'Optimize Bandwidth (Queues)',
      scenarioQueuesDesc: 'Pre-fills a template for configuring Simple Queues to manage bandwidth.',
      scenarioPppoeTitle: 'Fix my PPPoE / WAN Routing',
      scenarioPppoeDesc: 'Pre-fills a template to diagnose and correct PPPoE WAN route failures.',
      historyTitle: 'Session History',
      clearHistory: 'Wipe All',
      searchHistoryPlaceholder: 'Search saved audits...',
      historyEmpty: 'No audits saved in this session yet.',
      queueHeader: 'Queue Generator',
      queueTargetName: 'Target Name',
      queueTargetIp: 'Target IP or Address List',
      queueMaxUpload: 'Max Upload (Mbps)',
      queueMaxDownload: 'Max Download (Mbps)',
      queuePriority: 'Priority (1-8)',
      queueGenerateBtn: 'Generate',
      queueOutputTitle: 'Ready CLI Command',
      queueCopyBtn: 'Copy to Terminal',
      queueValidationErr: 'Please fill out all fields first!',
      toastQueueGenerated: 'Simple Queue command generated instantly!',
      copiedText: 'Copied!',
      copyLabel: 'Copy',
      diffOriginalHeader: 'Original Config (Redacted Display)',
      diffCorrectedHeader: 'Corrected Config (Fully Restored)',
      diffUnifiedDesc: 'Unified Diff Legend: <span class="text-red-400">Red Line = Original</span> | <span class="text-emerald-400">Green Line = Corrected</span>',
      commandsTip: 'These are RouterOS terminal commands. Paste them directly into your MikroTik CLI window to apply the fix.',
      commandsChecklistEmpty: '<div class="text-center py-12 text-slate-500 text-xs">No terminal commands generated for this analysis.</div>',
      commandsRawNoNeed: '# No specific terminal commands needed for this fix.',
      loaderTitle: "Mik's Privacy Shield Active",
      loaderStep1Title: 'Redact & Mask Private Context',
      loaderStep1DescActive: 'Scanning configuration for secrets & private subnets...',
      loaderStep1DescComplete: 'Shield locked! Replaced private IPs, passwords, and custom identities locally.',
      loaderStep2Title: 'AI Audit in Safe Sandbox',
      loaderStep2DescActive: 'Sending redacted instructions to secure sandbox...',
      loaderStep2DescComplete: 'Audit successfully compiled by LLM provider.',
      loaderStep3Title: 'De-anonymize Original Records',
      loaderStep3DescActive: 'Rebuilding config mapping: Replacing placeholders with secure originals...',
      loaderStep3DescComplete: 'Original network credentials restored securely in-browser.',
      loaderStep4Title: 'Format Redline Comparison Diff',
      loaderStep4DescActive: 'Rendering dynamic colored line comparisons & fix checklists...',
      loaderStep4DescComplete: 'Analysis pipeline fully executed.'
    },
    it: {
      welcomeTitle: 'MikrotikAssistant: L\'Auditor & Generatore di Configurazioni RouterOS Privato',
      welcomeDesc: 'Analizza, proteggi e ottimizza le tue configurazioni MikroTik in assoluta privacy.',
      welcomePrivacy: '🛡️ Massima Privacy Garantita: lo Scudo di Mik assicura che password, IP, MAC, nomi di interfacce personalizzate e identità non lascino mai questa macchina.',
      step1Title: 'Incolla Config',
      step1Desc: 'Incolla il tuo export RouterOS o log in modo sicuro nel drawer degli allegati.',
      step2Title: 'Mascheramento Locale',
      step2Desc: 'Il nostro scudo privacy lato client cancella password, segreti, IP e MAC prima di ogni trasmissione.',
      step3Title: 'Expert Audit',
      step3Desc: 'Il sistema individua vulnerabilità, segnala problemi e genera comandi RouterOS CLI delta correttivi accurati.',
      scenariosHeader: 'Scenari di Avvio Rapido',
      scenarioFirewallTitle: 'Verifica la Sicurezza del Firewall',
      scenarioFirewallDesc: 'Pre-compila una configurazione firewall di base e richiede un audit di vulnerabilità.',
      scenarioVlanTitle: 'Configura una VLAN Wi-Fi Ospiti',
      scenarioVlanDesc: 'Pre-compila uno scenario di generazione comandi VLAN passo-passo per la VLAN 20.',
      scenarioQueuesTitle: 'Ottimizza la Banda (Queues)',
      scenarioQueuesDesc: 'Pre-compila un modello per configurare le Simple Queues per gestire la banda.',
      scenarioPppoeTitle: 'Risolvi PPPoE / WAN Routing',
      scenarioPppoeDesc: 'Pre-compila un modello per diagnosticare e correggere i problemi di instradamento PPPoE WAN.',
      historyTitle: 'Cronologia Sessione',
      clearHistory: 'Cancella Tutto',
      searchHistoryPlaceholder: 'Cerca gli audit salvati...',
      historyEmpty: 'Nessun audit salvato ancora in questa sessione.',
      queueHeader: 'Generatore di Code (Queue)',
      queueTargetName: 'Nome Target',
      queueTargetIp: 'IP Target o Lista Indirizzi',
      queueMaxUpload: 'Upload Max (Mbps)',
      queueMaxDownload: 'Download Max (Mbps)',
      queuePriority: 'Priorità (1-8)',
      queueGenerateBtn: 'Genera',
      queueOutputTitle: 'Comando CLI Pronto',
      queueCopyBtn: 'Copia per il Terminale',
      queueValidationErr: 'Compila tutti i campi prima!',
      toastQueueGenerated: 'Comando Simple Queue generato istantaneamente!',
      copiedText: 'Copiato!',
      copyLabel: 'Copia',
      diffOriginalHeader: 'Config. Originale (Visualizzazione Oscurata)',
      diffCorrectedHeader: 'Config. Corretta (Completamente Ripristinata)',
      diffUnifiedDesc: 'Legenda Differenze: <span class="text-red-400">Linea Rossa = Originale</span> | <span class="text-emerald-400">Linea Verde = Corretta</span>',
      commandsTip: 'Questi sono comandi del terminale RouterOS. Incollali direttamente nella finestra CLI di MikroTik per applicare la correzione.',
      commandsChecklistEmpty: '<div class="text-center py-12 text-slate-500 text-xs">Nessun comando di terminale generato per questa analisi.</div>',
      commandsRawNoNeed: '# Nessun comando di terminale specifico necessario per questa correzione.',
      loaderTitle: 'Scudo Privacy di Mik Attivo',
      loaderStep1Title: 'Anonimizzazione Contesto Privato',
      loaderStep1DescActive: 'Scansione della configurazione per segreti e sotto-reti private...',
      loaderStep1DescComplete: 'Scudo attivato! Sostituiti IP privati, password e identità personalizzate localmente.',
      loaderStep2Title: 'AI Audit nella Sandbox Sicura',
      loaderStep2DescActive: 'Invio delle istruzioni oscurate alla sandbox sicura...',
      loaderStep2DescComplete: 'Audit compilato con successo dal provider LLM.',
      loaderStep3Title: 'Ripristino Record Originali',
      loaderStep3DescActive: 'Ricostruzione della mappa: Sostituzione dei segnaposto con gli originali sicuri...',
      loaderStep3DescComplete: 'Credenziali di rete originali ripristinate in modo sicuro nel browser.',
      loaderStep4Title: 'Generazione Differenze Redline',
      loaderStep4DescActive: 'Rendering del confronto dinamico a colori e lista comandi di ripristino...',
      loaderStep4DescComplete: 'Pipeline di analisi completamente eseguita.'
    }
  },

  // State Management inside Audit Tab
  state: {
    diffMode: 'split',
    commandMode: 'checklist',
    language: 'auto', // 'auto' | 'en' | 'it'
    currentChatId: null,
    pastedConfigRaw: '',
    history: [],
    currentFile: null,
    isAttachmentDrawerOpen: false,
    isSidebarOpen: true,
    activeSidebarTab: 'history'
  },

  // Get translated texts based on active language
  getT() {
    const currentLang = this.state.language === 'auto' ? 'en' : this.state.language;
    return this.i18n[currentLang] || this.i18n.en;
  },

  // Main render function
  render(container) {
    // Synchronize local state language with AppState preferences if not set
    if (AppState.preferences.language) {
      this.state.language = AppState.preferences.language;
    } else {
      this.state.language = 'auto';
    }

    // Load session history from localStorage
    const savedHistory = localStorage.getItem('mikrotik_chatbot_history');
    if (savedHistory) {
      try {
        this.state.history = JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse chat history:', e);
      }
    }

    const t = this.getT();

    container.innerHTML = `
      <div class="audit-container flex flex-row h-full min-h-0 w-full bg-gray-900 text-gray-100 overflow-hidden relative">

        <!-- MAIN CHAT COLUMN -->
        <div class="flex-1 flex flex-col h-full min-w-0 relative">

          <!-- SUBHEADER -->
          <div class="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-800 shrink-0 select-none">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-bold text-purple-400">🧙‍♂️ Mik the Winbox Wizard</span>
              <span id="llm-status-badge" class="flex items-center space-x-2 text-xs">
                <span id="llm-status-dot" class="w-2.5 h-2.5 bg-gray-500 rounded-full"></span>
                <span id="llm-status-text" class="text-gray-400 font-medium">LLM Offline</span>
              </span>
              <span id="privacy-count-badge" class="text-[10px] bg-purple-900/40 border border-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-semibold">
                🛡️ Privacy Guard: 6/6 Active
              </span>
            </div>
            <div class="flex items-center space-x-2">
              <select id="setting-language-audit" class="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none">
                <option value="auto" ${this.state.language === 'auto' ? 'selected' : ''}>Auto-Detect</option>
                <option value="en" ${this.state.language === 'en' ? 'selected' : ''}>English</option>
                <option value="it" ${this.state.language === 'it' ? 'selected' : ''}>Italiano</option>
              </select>
              <button id="btn-toggle-sidebar" class="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-700 transition" title="Toggle Control Center">
                <svg class="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- DRAG OVERLAY -->
          <div id="global-drag-overlay" class="hidden absolute inset-0 bg-purple-900/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center border-4 border-dashed border-purple-500 m-4 rounded-2xl select-none">
            <span class="text-6xl mb-4">📎</span>
            <h3 class="text-2xl font-bold text-white mb-2" id="ui-drag-title">${t.dragTitle || 'Drop RouterOS Configuration File'}</h3>
            <p class="text-purple-300 text-sm" id="ui-drag-desc">${t.dragDesc || 'Accepts .rsc, .txt, or .log exports'}</p>
          </div>

          <!-- CHAT STREAM OR WELCOME STATE -->
          <div id="chat-messages-stream" class="flex-1 overflow-y-auto p-6 space-y-6">

            <!-- WELCOME SCREEN (Empty State) -->
            <div id="panel-welcome" class="flex flex-col items-center justify-center p-4 max-w-4xl mx-auto py-12 animate-apple-reveal">
              <h2 class="text-2xl font-extrabold text-white text-center mb-2 tracking-tight" id="ui-label-welcome-title">
                ${t.welcomeTitle}
              </h2>
              <p class="text-gray-400 text-sm text-center mb-6 max-w-2xl" id="ui-label-welcome-desc">
                ${t.welcomeDesc}
              </p>
              <div class="bg-purple-950/20 border border-purple-500/20 text-purple-300 text-xs px-5 py-3 rounded-2xl max-w-2xl text-center mb-10 shadow" id="ui-label-welcome-privacy">
                ${t.welcomePrivacy}
              </div>

              <!-- 3-Step Privacy Shield How-it-Works -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12 select-none">
                <div class="bg-gray-800 border border-gray-700/50 p-5 rounded-2xl flex flex-col items-center text-center">
                  <div class="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black mb-3">1</div>
                  <h4 class="font-bold text-sm text-white mb-1" id="ui-step-1-title">${t.step1Title}</h4>
                  <p class="text-xs text-gray-400 leading-relaxed" id="ui-step-1-desc">${t.step1Desc}</p>
                </div>
                <div class="bg-gray-800 border border-gray-700/50 p-5 rounded-2xl flex flex-col items-center text-center">
                  <div class="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black mb-3">2</div>
                  <h4 class="font-bold text-sm text-white mb-1" id="ui-step-2-title">${t.step2Title}</h4>
                  <p class="text-xs text-gray-400 leading-relaxed" id="ui-step-2-desc">${t.step2Desc}</p>
                </div>
                <div class="bg-gray-800 border border-gray-700/50 p-5 rounded-2xl flex flex-col items-center text-center">
                  <div class="w-10 h-10 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black mb-3">3</div>
                  <h4 class="font-bold text-sm text-white mb-1" id="ui-step-3-title">${t.step3Title}</h4>
                  <p class="text-xs text-gray-400 leading-relaxed" id="ui-step-3-desc">${t.step3Desc}</p>
                </div>
              </div>

              <!-- Interactive Scenario Cards -->
              <div class="w-full max-w-3xl">
                <h3 class="text-xs font-black uppercase text-gray-500 tracking-wider mb-4 text-center select-none" id="ui-scenarios-header">
                  ${t.scenariosHeader}
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button id="btn-scenario-firewall" class="group bg-gray-850 hover:bg-gray-800 border border-gray-700/65 hover:border-purple-500/30 p-4 rounded-2xl text-left transition duration-250 active:scale-[0.98] focus:outline-none">
                    <div class="flex items-center space-x-2 mb-1.5">
                      <span class="text-lg">🛡️</span>
                      <h4 class="font-bold text-sm text-white group-hover:text-purple-400 transition" id="ui-scenario-firewall-title">${t.scenarioFirewallTitle}</h4>
                    </div>
                    <p class="text-xs text-gray-400 leading-relaxed" id="ui-scenario-firewall-desc">${t.scenarioFirewallDesc}</p>
                  </button>

                  <button id="btn-scenario-vlan" class="group bg-gray-850 hover:bg-gray-800 border border-gray-700/65 hover:border-purple-500/30 p-4 rounded-2xl text-left transition duration-250 active:scale-[0.98] focus:outline-none">
                    <div class="flex items-center space-x-2 mb-1.5">
                      <span class="text-lg">🕸️</span>
                      <h4 class="font-bold text-sm text-white group-hover:text-purple-400 transition" id="ui-scenario-vlan-title">${t.scenarioVlanTitle}</h4>
                    </div>
                    <p class="text-xs text-gray-400 leading-relaxed" id="ui-scenario-vlan-desc">${t.scenarioVlanDesc}</p>
                  </button>

                  <button id="btn-scenario-queues" class="group bg-gray-850 hover:bg-gray-800 border border-gray-700/65 hover:border-purple-500/30 p-4 rounded-2xl text-left transition duration-250 active:scale-[0.98] focus:outline-none">
                    <div class="flex items-center space-x-2 mb-1.5">
                      <span class="text-lg">🚀</span>
                      <h4 class="font-bold text-sm text-white group-hover:text-purple-400 transition" id="ui-scenario-queues-title">${t.scenarioQueuesTitle}</h4>
                    </div>
                    <p class="text-xs text-gray-400 leading-relaxed" id="ui-scenario-queues-desc">${t.scenarioQueuesDesc}</p>
                  </button>

                  <button id="btn-scenario-pppoe" class="group bg-gray-850 hover:bg-gray-800 border border-gray-700/65 hover:border-purple-500/30 p-4 rounded-2xl text-left transition duration-250 active:scale-[0.98] focus:outline-none">
                    <div class="flex items-center space-x-2 mb-1.5">
                      <span class="text-lg">🔌</span>
                      <h4 class="font-bold text-sm text-white group-hover:text-purple-400 transition" id="ui-scenario-pppoe-title">${t.scenarioPppoeTitle}</h4>
                    </div>
                    <p class="text-xs text-gray-400 leading-relaxed" id="ui-scenario-pppoe-desc">${t.scenarioPppoeDesc}</p>
                  </button>
                </div>
              </div>
            </div>

            <!-- MESSAGES CONTAINER -->
            <div id="chat-messages-container" class="space-y-6"></div>

          </div>

          <!-- SMART CHIPS PANEL -->
          <div id="smart-chips-container" class="hidden px-6 py-2.5 bg-gray-800/40 border-t border-gray-700/50 flex flex-wrap gap-2 animate-apple-reveal select-none"></div>

          <!-- CHAT INPUT & ATTACHMENTS PANEL -->
          <div class="p-6 border-t border-gray-700 bg-gray-800 shrink-0">

            <!-- SUGGESTION CHIPS (Above textarea) -->
            <div id="suggestion-chips-container" class="hidden flex flex-wrap gap-2 mb-3 select-none"></div>

            <!-- FILE INFORMATION BAR -->
            <div id="file-info-bar" class="hidden mb-3 p-3 bg-purple-950/20 border border-purple-500/20 rounded-xl flex items-center justify-between select-none">
              <div class="flex items-center space-x-2.5">
                <span class="text-lg">📎</span>
                <span id="file-name-label" class="text-xs font-bold text-purple-300"></span>
                <span id="file-size-label" class="text-[10px] text-purple-400 font-mono"></span>
              </div>
              <button id="btn-remove-file" class="text-gray-400 hover:text-red-400 transition p-1" title="Remove attachment">✕</button>
            </div>

            <!-- TEXTAREA INPUT WRAPPER -->
            <div class="relative">
              <textarea
                id="chat-message"
                class="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 pr-12 resize-none focus:outline-none focus:border-purple-500 text-sm leading-relaxed placeholder-gray-500 transition-colors"
                rows="1"
                placeholder="Describe your issue, run slash commands (/), or paste RouterOS configs safely..."
              ></textarea>

              <!-- PALETTE: SLASH COMMANDS -->
              <div id="slash-palette" class="hidden absolute bottom-full left-0 mb-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden select-none z-50">
                <div class="px-3.5 py-1.5 bg-gray-900/60 border-b border-gray-700 text-[10px] font-bold uppercase tracking-wider text-purple-400">Slash Commands</div>
                <div class="max-h-48 overflow-y-auto">
                  <div class="slash-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-command="/audit">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">/audit</span>
                    <span class="text-gray-400 text-[10px]">Multi-agent deep dive analysis</span>
                  </div>
                  <div class="slash-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-command="/explain">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">/explain</span>
                    <span class="text-gray-400 text-[10px]">Explain configuration in simple terms</span>
                  </div>
                  <div class="slash-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-command="/queue">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">/queue</span>
                    <span class="text-gray-400 text-[10px]">Open bandwidth queue builder</span>
                  </div>
                </div>
              </div>

              <!-- PALETTE: AT MODIFIERS -->
              <div id="at-palette" class="hidden absolute bottom-full left-0 mb-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden select-none z-50">
                <div class="px-3.5 py-1.5 bg-gray-900/60 border-b border-gray-700 text-[10px] font-bold uppercase tracking-wider text-purple-400">Context Modifiers</div>
                <div class="max-h-48 overflow-y-auto">
                  <div class="at-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-modifier="@strict">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">@strict</span>
                    <span class="text-gray-400 text-[10px]">Output commands only, no talking</span>
                  </div>
                  <div class="at-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-modifier="@beginner">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">@beginner</span>
                    <span class="text-gray-400 text-[10px]">Simple concepts for junior admins</span>
                  </div>
                  <div class="at-item flex items-center justify-between p-2.5 hover:bg-purple-600/10 cursor-pointer text-xs group" data-modifier="@wiki">
                    <span class="font-mono font-bold text-purple-400 group-hover:text-purple-300">@wiki</span>
                    <span class="text-gray-400 text-[10px]">Enforce MikroTik wiki standards</span>
                  </div>
                </div>
              </div>

            </div>

            <!-- ACTION BUTTONS ROW -->
            <div class="flex items-center justify-between mt-3.5 select-none">
              <div class="flex items-center space-x-2.5">
                <!-- Toggle Attachment Drawer button -->
                <button id="btn-toggle-drawer" class="w-11 h-11 rounded-xl bg-gray-700 hover:bg-gray-600 hover:text-white text-gray-300 transition duration-200 flex items-center justify-center focus:outline-none" title="Paste Config Drawer">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                </button>
                <button id="btn-attach-file-upload" class="w-11 h-11 rounded-xl bg-gray-700 hover:bg-gray-600 hover:text-white text-gray-300 transition duration-200 flex items-center justify-center focus:outline-none" title="Upload Config File">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                </button>
                <input type="file" id="file-input" class="hidden" accept=".rsc,.txt,.log">
              </div>

              <!-- Submit button: Fixed size w-11 h-11 with centered layouts to prevent shift -->
              <button id="btn-submit" class="w-11 h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 active:scale-95 flex items-center justify-center focus:outline-none shadow-lg hover:shadow-purple-500/20" title="Submit Audit">
                <!-- Send Icon -->
                <svg id="submit-icon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
                <!-- Loading Spinner (initially hidden) -->
                <svg id="loading-spinner" class="hidden w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <!-- Stop/Abort Icon (initially hidden) -->
                <svg id="stop-icon" class="hidden w-5 h-5 text-red-200" fill="currentColor" viewBox="0 0 20 20">
                  <rect x="4" y="4" width="12" height="12" rx="2" />
                </svg>
              </button>
            </div>

            <!-- COLLAPSIBLE ATTACHMENTS DRAWER -->
            <div id="attachment-drawer" class="hidden mt-4 p-4 bg-gray-900 rounded-xl border border-gray-700 animate-apple-reveal select-none">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-wider" id="ui-label-paste-config">RouterOS Config or Log Export</span>
                <div class="flex space-x-2">
                  <button id="btn-format-config" class="text-[10px] bg-gray-800 hover:bg-gray-700 text-purple-400 px-2 py-1 rounded border border-gray-700 font-bold transition">Format Config</button>
                  <button id="btn-analyze-shadows" class="text-[10px] bg-gray-800 hover:bg-gray-700 text-amber-400 px-2 py-1 rounded border border-gray-700 font-bold transition">Detect Shadows</button>
                  <button id="btn-clear-attachment" class="text-[10px] bg-gray-800 hover:bg-red-950/40 text-red-400 px-2 py-1 rounded border border-gray-700 font-bold transition">Clear</button>
                </div>
              </div>
              <textarea
                id="pasted-config"
                class="w-full h-40 bg-black/60 border border-gray-800 rounded-lg p-3 font-mono text-[11px] leading-normal text-slate-300 placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                placeholder="# Paste a .rsc export configuration here... (All IP/MAC/secrets will be masked locally before sending to AI, and restored instantly!)"
              ></textarea>
              <div id="config-summary-badge" class="hidden mt-2 flex items-center space-x-1.5 text-[10px] bg-purple-950/40 border border-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full w-max font-bold">
                <span id="config-summary-badge-text"></span>
              </div>
            </div>

          </div>
        </div>

        <!-- RIGHT SIDE: COLLAPSIBLE CONTROL CENTER SIDEBAR -->
        <div id="sidebar-control-center" class="w-80 border-l border-gray-700 bg-gray-800 flex flex-col h-full transition-all duration-300 shrink-0 select-none">

          <!-- SIDEBAR TABS HEADER -->
          <div class="grid grid-cols-4 border-b border-gray-700 text-center text-xs bg-gray-900/40 font-bold p-1 shrink-0">
            <button id="sidebar-tab-history" class="py-2 rounded-lg text-purple-400 bg-gray-800 border border-gray-700 transition" title="Audit History">📜</button>
            <button id="sidebar-tab-queues" class="py-2 rounded-lg text-gray-400 hover:text-white transition" title="Queue Generator">📈</button>
            <button id="sidebar-tab-context" class="py-2 rounded-lg text-gray-400 hover:text-white transition" title="Context Selector">⚙️</button>
            <button id="sidebar-tab-preferences" class="py-2 rounded-lg text-gray-400 hover:text-white transition" title="Privacy Settings">🛡️</button>
          </div>

          <!-- SIDEBAR TAB CONTENTS CONTAINER -->
          <div class="flex-1 overflow-y-auto p-4 min-h-0">

            <!-- HISTORY TAB -->
            <div id="sidebar-section-history" class="flex flex-col h-full min-h-0">
              <div class="flex items-center justify-between mb-3 shrink-0">
                <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400" id="ui-label-history-title">${t.historyTitle}</h3>
                <button id="btn-clear-history" class="text-[10px] bg-red-950/40 hover:bg-red-900/30 text-red-400 px-2 py-0.5 border border-red-500/20 rounded font-bold transition">${t.clearHistory}</button>
              </div>
              <input
                id="search-history"
                type="text"
                placeholder="${t.searchHistoryPlaceholder}"
                class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-purple-500 shrink-0"
              >
              <div id="history-items-container" class="flex-1 overflow-y-auto space-y-2 mt-3 pr-1 min-h-0">
                <div id="ui-history-empty" class="text-center py-8 text-gray-500 text-xs font-medium">${t.historyEmpty}</div>
              </div>
            </div>

            <!-- QUEUE GENERATOR TAB -->
            <div id="sidebar-section-queues" class="hidden space-y-4">
              <h3 id="ui-queue-header" class="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 border-b border-gray-700 pb-2">
                <span>🚀</span> ${t.queueHeader}
              </h3>
              <div class="space-y-3">
                <div>
                  <label id="ui-label-queue-name" class="block text-[10px] font-black uppercase text-gray-500 mb-1">${t.queueTargetName}</label>
                  <input id="queue-target-name" type="text" placeholder="Guest-WiFi" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
                </div>
                <div>
                  <label id="ui-label-queue-ip" class="block text-[10px] font-black uppercase text-gray-500 mb-1">${t.queueTargetIp}</label>
                  <input id="queue-target-ip" type="text" placeholder="192.168.20.0/24" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-2.5">
                  <div>
                    <label id="ui-label-queue-upload" class="block text-[10px] font-black uppercase text-gray-500 mb-1">${t.queueMaxUpload}</label>
                    <input id="queue-max-upload" type="number" placeholder="10" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono">
                  </div>
                  <div>
                    <label id="ui-label-queue-download" class="block text-[10px] font-black uppercase text-gray-500 mb-1">${t.queueMaxDownload}</label>
                    <input id="queue-max-download" type="number" placeholder="10" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono">
                  </div>
                </div>
                <div>
                  <label id="ui-label-queue-priority" class="block text-[10px] font-black uppercase text-gray-500 mb-1">${t.queuePriority}</label>
                  <select id="queue-priority" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-mono">
                    <option value="1">1 (Highest)</option>
                    <option value="4">4 (Normal)</option>
                    <option value="8" selected>8 (Lowest)</option>
                  </select>
                </div>
                <button id="btn-queue-generate" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-xs transition active:scale-95 shadow-lg">${t.queueGenerateBtn}</button>

                <!-- QUEUE READY OUTPUT -->
                <div id="queue-code-output-container" class="hidden space-y-2 border-t border-gray-700 pt-3">
                  <span id="ui-queue-output-title" class="block text-[10px] font-black uppercase text-gray-500">${t.queueOutputTitle}</span>
                  <div class="p-2.5 rounded-lg bg-black/60 border border-gray-800 text-[11px] font-mono select-all text-slate-300 break-all" id="queue-code-block"></div>
                  <button id="btn-queue-copy" class="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-1.5 rounded border border-gray-600 text-[11px] transition active:scale-95 flex items-center justify-center space-x-1">
                    <span>📋</span> <span id="ui-label-queue-copy-btn">${t.queueCopyBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- CONTEXT SELECTOR TAB -->
            <div id="sidebar-section-context" class="hidden space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-700 pb-2">🌐 RouterOS Context</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-[10px] font-black uppercase text-gray-500 mb-1">RouterOS Version</label>
                  <select id="select-ros-version" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
                    <option value="auto" selected>Auto-Detect / Infer</option>
                    <option value="v7">v7 (Latest release)</option>
                    <option value="v6">v6 (Legacy release)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-black uppercase text-gray-500 mb-1">Hardware Model / Arch</label>
                  <select id="select-hardware" class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500">
                    <option value="auto" selected>Auto-Detect / Infer</option>
                    <option value="RB5009">RB5009 (ARM64 / WiFiWave2)</option>
                    <option value="hEX S">hEX S (MMIPS / HW Offload)</option>
                    <option value="CCR2004">CCR2004 (ARM64 / High-Perf)</option>
                    <option value="CHR">CHR (Cloud Hosted Router / x86)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- PRIVACY SHIELDS TAB -->
            <div id="sidebar-section-preferences" class="hidden space-y-4">
              <h3 class="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-700 pb-2">🛡️ Client Privacy Shields</h3>
              <div class="space-y-3">

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-ips-title" class="block text-[11px] font-bold text-white">${t.settingsMaskIpsTitle || 'Mask IP Addresses'}</label>
                    <span id="ui-mask-ips-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskIpsDesc || 'Scans IPv4/6; maps to placeholders'}</span>
                  </div>
                  <input type="checkbox" id="mask-ips" class="accent-purple-500 mt-1" checked>
                </div>

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-macs-title" class="block text-[11px] font-bold text-white">${t.settingsMaskMacsTitle || 'Mask MAC Hardware ID'}</label>
                    <span id="ui-mask-macs-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskMacsDesc || 'Hides physical hex hardware interfaces'}</span>
                  </div>
                  <input type="checkbox" id="mask-macs" class="accent-purple-500 mt-1" checked>
                </div>

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-secrets-title" class="block text-[11px] font-bold text-white">${t.settingsMaskSecretsTitle || 'Mask Keys & Secrets'}</label>
                    <span id="ui-mask-secrets-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskSecretsDesc || 'Hides security-profiles, passwords, pre-shared keys'}</span>
                  </div>
                  <input type="checkbox" id="mask-secrets" class="accent-purple-500 mt-1" checked>
                </div>

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-interfaces-title" class="block text-[11px] font-bold text-white">${t.settingsMaskInterfacesTitle || 'Mask Custom Interfaces'}</label>
                    <span id="ui-mask-interfaces-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskInterfacesDesc || 'Keeps standard names, masks custom'}</span>
                  </div>
                  <input type="checkbox" id="mask-interfaces" class="accent-purple-500 mt-1" checked>
                </div>

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-domains-title" class="block text-[11px] font-bold text-white">${t.settingsMaskDomainsTitle || 'Mask Domain Names'}</label>
                    <span id="ui-mask-domains-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskDomainsDesc || 'Hides external server addresses & DDNS urls'}</span>
                  </div>
                  <input type="checkbox" id="mask-domains" class="accent-purple-500 mt-1" checked>
                </div>

                <div class="flex items-start justify-between">
                  <div>
                    <label id="ui-mask-identity-title" class="block text-[11px] font-bold text-white">${t.settingsMaskIdentityTitle || 'Mask Router system identity'}</label>
                    <span id="ui-mask-identity-desc" class="text-[9px] text-gray-400 leading-normal">${t.settingsMaskIdentityDesc || 'Redacts custom system labels or hardware handles'}</span>
                  </div>
                  <input type="checkbox" id="mask-identity" class="accent-purple-500 mt-1" checked>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>

      <!-- VISUAL DIFF VIEWER MODAL -->
      <div id="modal-diff" class="hidden fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none">
        <div class="bg-gray-800 border border-gray-700 rounded-2xl max-w-6xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-apple-reveal">
          <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/60">
            <h3 class="text-sm font-extrabold text-white uppercase tracking-wider">Visual Config Diff</h3>
            <button id="btn-close-diff" class="text-gray-400 hover:text-white text-2xl font-bold transition">×</button>
          </div>
          <div class="p-4 bg-gray-800/40 border-b border-gray-700/50 flex items-center justify-between">
            <div class="flex space-x-2">
              <button id="diff-view-mode-split" class="px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-purple-400 border border-purple-500/30 transition">Split</button>
              <button id="diff-view-mode-unified" class="px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition">Unified</button>
            </div>
            <div id="ui-label-diff-unified-desc" class="text-[10px] text-gray-400">${t.diffUnifiedDesc}</div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-950 font-mono text-xs">
            <table class="w-full border-collapse">
              <thead id="diff-split-headers">
                <tr class="border-b border-gray-800 text-gray-500 font-bold text-[10px] uppercase">
                  <th id="ui-label-diff-original" class="w-1/2 text-left p-2 border-r border-gray-800">${t.diffOriginalHeader}</th>
                  <th id="ui-label-diff-corrected" class="w-1/2 text-left p-2">${t.diffCorrectedHeader}</th>
                </tr>
              </thead>
              <thead id="diff-unified-header" class="hidden">
                <tr class="border-b border-gray-800 text-gray-500 font-bold text-[10px] uppercase">
                  <th class="text-left p-2">Unified Comparison Lines</th>
                </tr>
              </thead>
              <tbody id="diff-table-body" class="select-text"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- FIX CHECKLIST MODAL -->
      <div id="modal-commands" class="hidden fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6 select-none">
        <div class="bg-gray-800 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl animate-apple-reveal">
          <div class="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900/60">
            <h3 class="text-sm font-extrabold text-white uppercase tracking-wider">Interactive Fix Checklist</h3>
            <button id="btn-close-commands" class="text-gray-400 hover:text-white text-2xl font-bold transition">×</button>
          </div>
          <div class="p-4 bg-gray-850 border-b border-gray-700/50 flex items-center justify-between">
            <div class="flex space-x-2">
              <button id="command-view-mode-checklist" class="px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-emerald-400 border border-emerald-500/30 transition">Checklist</button>
              <button id="command-view-mode-raw" class="px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition">Raw Terminal</button>
            </div>
            <div id="ui-label-commands-tip" class="text-[10px] text-gray-400">${t.commandsTip}</div>
          </div>
          <div class="flex-1 overflow-y-auto p-5 min-h-0">
            <!-- CHECKLIST INTERACTIVE CONTAINER -->
            <div id="commands-checklist-container" class="space-y-2.5"></div>
            <!-- RAW CODE CONTAINER -->
            <div id="commands-raw-container" class="hidden h-full">
              <pre class="bg-black/50 border border-gray-800 rounded-xl p-4 font-mono text-xs overflow-x-auto text-slate-300 select-all" id="commands-block"></pre>
            </div>
          </div>
        </div>
      </div>
    `;

    // Attach immediate DOM nodes references for easy access
    this.bindDOMReferences();

    // Set up event listeners
    this.setupEventListeners();

    // Trigger stateful view syncs on render
    this.updateLLMStatusBadge();
    this.updatePrivacyShieldCountLabel();
    this.renderHistoryList();
  },

  bindDOMReferences() {
    this.els = {
      pastedConfig: document.getElementById('pasted-config'),
      chatMessage: document.getElementById('chat-message'),
      btnSubmit: document.getElementById('btn-submit'),
      loadingSpinner: document.getElementById('loading-spinner'),
      submitIcon: document.getElementById('submit-icon'),
      stopIcon: document.getElementById('stop-icon'),

      btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
      sidebarControlCenter: document.getElementById('sidebar-control-center'),

      sidebarTabHistory: document.getElementById('sidebar-tab-history'),
      sidebarTabContext: document.getElementById('sidebar-tab-context'),
      sidebarTabPreferences: document.getElementById('sidebar-tab-preferences'),
      sidebarTabQueues: document.getElementById('sidebar-tab-queues'),
      sidebarSectionHistory: document.getElementById('sidebar-section-history'),
      sidebarSectionContext: document.getElementById('sidebar-section-context'),
      sidebarSectionPreferences: document.getElementById('sidebar-section-preferences'),
      sidebarSectionQueues: document.getElementById('sidebar-section-queues'),

      queueTargetName: document.getElementById('queue-target-name'),
      queueTargetIp: document.getElementById('queue-target-ip'),
      queueMaxUpload: document.getElementById('queue-max-upload'),
      queueMaxDownload: document.getElementById('queue-max-download'),
      queuePriority: document.getElementById('queue-priority'),
      btnQueueGenerate: document.getElementById('btn-queue-generate'),
      queueCodeOutputContainer: document.getElementById('queue-code-output-container'),
      queueCodeBlock: document.getElementById('queue-code-block'),
      btnQueueCopy: document.getElementById('btn-queue-copy'),

      btnClearHistory: document.getElementById('btn-clear-history'),
      searchHistory: document.getElementById('search-history'),
      historyItemsContainer: document.getElementById('history-items-container'),

      fileInfoBar: document.getElementById('file-info-bar'),
      fileNameLabel: document.getElementById('file-name-label'),
      fileSizeLabel: document.getElementById('file-size-label'),
      btnRemoveFile: document.getElementById('btn-remove-file'),
      fileInput: document.getElementById('file-input'),

      attachmentDrawer: document.getElementById('attachment-drawer'),
      btnToggleDrawer: document.getElementById('btn-toggle-drawer'),
      btnClearAttachment: document.getElementById('btn-clear-attachment'),
      btnFormatConfig: document.getElementById('btn-format-config'),
      btnAnalyzeShadows: document.getElementById('btn-analyze-shadows'),
      configSummaryBadge: document.getElementById('config-summary-badge'),
      configSummaryBadgeText: document.getElementById('config-summary-badge-text'),
      smartChipsContainer: document.getElementById('smart-chips-container'),

      chatMessagesStream: document.getElementById('chat-messages-stream'),
      chatMessagesContainer: document.getElementById('chat-messages-container'),

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
      btnScenarioFirewall: document.getElementById('btn-scenario-firewall'),
      btnScenarioVlan: document.getElementById('btn-scenario-vlan'),
      btnScenarioQueues: document.getElementById('btn-scenario-queues'),
      btnScenarioPppoe: document.getElementById('btn-scenario-pppoe'),

      maskIPs: document.getElementById('mask-ips'),
      maskMACs: document.getElementById('mask-macs'),
      maskSecrets: document.getElementById('mask-secrets'),
      maskInterfaces: document.getElementById('mask-interfaces'),
      maskDomains: document.getElementById('mask-domains'),
      maskIdentity: document.getElementById('mask-identity'),

      llmStatusDot: document.getElementById('llm-status-dot'),
      llmStatusText: document.getElementById('llm-status-text'),
      privacyCount: document.getElementById('privacy-count'),
      globalDragOverlay: document.getElementById('global-drag-overlay'),
      settingLanguageAudit: document.getElementById('setting-language-audit')
    };
  },

  // Wires all DOM event listeners
  setupEventListeners() {
    // 1. Sidebar Control Center Tabs
    if (this.els.sidebarTabHistory) this.els.sidebarTabHistory.addEventListener('click', () => this.handleSidebarTabSwitch('history'));
    if (this.els.sidebarTabQueues) this.els.sidebarTabQueues.addEventListener('click', () => this.handleSidebarTabSwitch('queues'));
    if (this.els.sidebarTabContext) this.els.sidebarTabContext.addEventListener('click', () => this.handleSidebarTabSwitch('context'));
    if (this.els.sidebarTabPreferences) this.els.sidebarTabPreferences.addEventListener('click', () => this.handleSidebarTabSwitch('preferences'));

    // 2. Sidebar Toggle Button
    if (this.els.btnToggleSidebar) {
      this.els.btnToggleSidebar.addEventListener('click', () => {
        this.state.isSidebarOpen = !this.state.isSidebarOpen;
        this.syncSidebarState();
      });
    }

    // 3. Language Selector
    if (this.els.settingLanguageAudit) {
      this.els.settingLanguageAudit.addEventListener('change', (e) => {
        this.handleLanguageChange(e.target.value);
      });
    }

    // 4. Queue Generator
    if (this.els.btnQueueGenerate) {
      this.els.btnQueueGenerate.addEventListener('click', () => this.handleQueueGeneration());
    }
    if (this.els.btnQueueCopy) {
      this.els.btnQueueCopy.addEventListener('click', () => this.handleQueueCopy());
    }

    // 5. Drag and Drop Overlay & File Inputs
    this.handleDragAndDrop();
    if (this.els.btnAttachFileUpload) {
      this.els.btnAttachFileUpload.addEventListener('click', () => {
        this.els.fileInput.click();
      });
    }
    if (this.els.fileInput) {
      this.els.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.handleUploadedFile(e.target.files[0]);
        }
      });
    }
    if (this.els.btnRemoveFile) {
      this.els.btnRemoveFile.addEventListener('click', () => this.removeAttachedFile());
    }

    // 6. Attachment Drawer & Helpers
    if (this.els.btnToggleDrawer) {
      this.els.btnToggleDrawer.addEventListener('click', () => this.toggleAttachmentDrawer());
    }
    if (this.els.btnClearAttachment) {
      this.els.btnClearAttachment.addEventListener('click', () => this.clearAttachment());
    }
    if (this.els.btnFormatConfig) {
      this.els.btnFormatConfig.addEventListener('click', () => this.handleFormatConfig());
    }
    if (this.els.btnAnalyzeShadows) {
      this.els.btnAnalyzeShadows.addEventListener('click', () => this.analyzeFirewallShadows());
    }
    if (this.els.pastedConfig) {
      this.els.pastedConfig.addEventListener('input', () => this.updateConfigAnalysisUI());
      this.els.pastedConfig.addEventListener('paste', () => {
        setTimeout(() => this.updateConfigAnalysisUI(), 50);
      });
    }

    // 7. Chat Inputs & Textarea Actions
    if (this.els.chatMessage) {
      this.els.chatMessage.addEventListener('input', (e) => {
        this.adjustTextAreaHeight();
        this.handleIntentDetection();
        this.handleCommandPalette(e);
      });
      this.els.chatMessage.addEventListener('keydown', (e) => {
        this.handleCommandPalette(e);
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.submitChat();
        }
      });
      this.els.chatMessage.addEventListener('paste', (e) => {
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        if (pastedText && typeof window.isValidRouterOsConfig === 'function' && window.isValidRouterOsConfig(pastedText)) {
          e.preventDefault();
          this.els.pastedConfig.value = pastedText;
          this.openAttachmentDrawer();
          this.updateConfigAnalysisUI();
          this.showToast('Smart Paste: Valid RouterOS config detected and attached!', 'success');
        } else {
          setTimeout(() => this.handleIntentDetection(), 50);
        }
      });
    }
    if (this.els.btnSubmit) {
      this.els.btnSubmit.addEventListener('click', () => this.submitChat());
    }

    // 8. Scenario Quick Action Cards
    if (this.els.btnScenarioFirewall) {
      this.els.btnScenarioFirewall.addEventListener('click', () => this.loadScenario('firewall'));
    }
    if (this.els.btnScenarioVlan) {
      this.els.btnScenarioVlan.addEventListener('click', () => this.loadScenario('vlan'));
    }
    if (this.els.btnScenarioQueues) {
      this.els.btnScenarioQueues.addEventListener('click', () => this.loadScenario('queues'));
    }
    if (this.els.btnScenarioPppoe) {
      this.els.btnScenarioPppoe.addEventListener('click', () => this.loadScenario('pppoe'));
    }

    // 9. Privacy Shields Switches Toggles
    [this.els.maskIPs, this.els.maskMACs, this.els.maskSecrets, this.els.maskInterfaces, this.els.maskDomains, this.els.maskIdentity].forEach(el => {
      if (el) {
        el.addEventListener('change', () => this.updatePrivacyShieldCountLabel());
      }
    });

    // 10. Modals Close triggers
    if (this.els.btnCloseDiff) {
      this.els.btnCloseDiff.addEventListener('click', () => {
        this.els.modalDiff.classList.add('hidden');
      });
    }
    if (this.els.btnCloseCommands) {
      this.els.btnCloseCommands.addEventListener('click', () => {
        this.els.modalCommands.classList.add('hidden');
      });
    }
    [this.els.modalDiff, this.els.modalCommands].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.classList.add('hidden');
        });
      }
    });

    // 11. Modal toggles
    if (this.els.diffViewModeSplit) {
      this.els.diffViewModeSplit.addEventListener('click', () => this.switchDiffMode('split'));
    }
    if (this.els.diffViewModeUnified) {
      this.els.diffViewModeUnified.addEventListener('click', () => this.switchDiffMode('unified'));
    }
    if (this.els.commandViewModeChecklist) {
      this.els.commandViewModeChecklist.addEventListener('click', () => this.switchCommandMode('checklist'));
    }
    if (this.els.commandViewModeRaw) {
      this.els.commandViewModeRaw.addEventListener('click', () => this.switchCommandMode('raw'));
    }

    // 12. History Section Search & Clean
    if (this.els.searchHistory) {
      this.els.searchHistory.addEventListener('input', (e) => {
        this.searchHistory(e.target.value);
      });
    }
    if (this.els.btnClearHistory) {
      this.els.btnClearHistory.addEventListener('click', () => this.clearHistoryAll());
    }

    // Wire global/window hooks to match back snippets button events
    window.copySnippetText = (id, btn) => this.copySnippetText(id, btn);
  },

  // Switch sidebar Control Center tabs
  handleSidebarTabSwitch(tabId) {
    this.state.activeSidebarTab = tabId;

    // Reset visual tabs active/inactive styles
    const tabs = [this.els.sidebarTabHistory, this.els.sidebarTabQueues, this.els.sidebarTabContext, this.els.sidebarTabPreferences];
    tabs.forEach(el => {
      if (el) {
        el.className = 'py-2 rounded-lg text-gray-400 hover:text-white transition';
      }
    });

    // Hide all sections
    this.els.sidebarSectionHistory.classList.add('hidden');
    this.els.sidebarSectionQueues.classList.add('hidden');
    this.els.sidebarSectionContext.classList.add('hidden');
    this.els.sidebarSectionPreferences.classList.add('hidden');

    let activeBtn = this.els.sidebarTabHistory;
    let activeSection = this.els.sidebarSectionHistory;

    if (tabId === 'history') {
      activeBtn = this.els.sidebarTabHistory;
      activeSection = this.els.sidebarSectionHistory;
    } else if (tabId === 'queues') {
      activeBtn = this.els.sidebarTabQueues;
      activeSection = this.els.sidebarSectionQueues;
    } else if (tabId === 'context') {
      activeBtn = this.els.sidebarTabContext;
      activeSection = this.els.sidebarSectionContext;
    } else if (tabId === 'preferences') {
      activeBtn = this.els.sidebarTabPreferences;
      activeSection = this.els.sidebarSectionPreferences;
    }

    if (activeBtn) {
      activeBtn.className = 'py-2 rounded-lg text-purple-400 bg-gray-800 border border-gray-700 transition';
    }
    if (activeSection) {
      activeSection.classList.remove('hidden');
    }
  },

  // Slide-out Control Center sidebar collapsible toggler
  syncSidebarState() {
    const el = this.els.sidebarControlCenter;
    if (!el) return;
    if (this.state.isSidebarOpen) {
      el.classList.remove('w-0', 'border-l-0', 'opacity-0');
      el.classList.add('w-80', 'border-l');
    } else {
      el.classList.remove('w-80', 'border-l');
      el.classList.add('w-0', 'border-l-0', 'opacity-0');
    }
  },

  // Dynamic localization change
  handleLanguageChange(lang) {
    this.state.language = lang;
    AppState.preferences.language = lang;
    AppState.save();
    localStorage.setItem('mikrotik_chatbot_language', lang);

    // Dynamic UI reload: re-render layout wrapper to preserve chat history if loaded, or do quick full re-render
    const mainContent = document.getElementById('main-content');
    this.render(mainContent);
  },

  // Simple Queue command generator logic
  handleQueueGeneration() {
    const name = this.els.queueTargetName.value.trim();
    const target = this.els.queueTargetIp.value.trim();
    const upload = this.els.queueMaxUpload.value.trim();
    const download = this.els.queueMaxDownload.value.trim();
    const priority = this.els.queuePriority.value;

    const t = this.getT();

    if (!name || !target || !upload || !download) {
      this.showToast(t.queueValidationErr, 'error');
      return;
    }

    const cmd = `/queue simple add name="${name}" target="${target}" max-limit="${upload}M/${download}M" priority=${priority}`;
    if (this.els.queueCodeBlock) {
      this.els.queueCodeBlock.textContent = cmd;
    }
    if (this.els.queueCodeOutputContainer) {
      this.els.queueCodeOutputContainer.classList.remove('hidden');
    }
    this.showToast(t.toastQueueGenerated, 'success');
  },

  // Copy Simple Queue terminal block
  handleQueueCopy() {
    const cmd = this.els.queueCodeBlock ? this.els.queueCodeBlock.textContent : '';
    if (!cmd) return;

    const t = this.getT();
    navigator.clipboard.writeText(cmd).then(() => {
      const btnLabel = document.getElementById('ui-label-queue-copy-btn');
      const origText = btnLabel ? btnLabel.textContent : 'Copy to Terminal';

      if (btnLabel) btnLabel.textContent = t.copiedText;
      this.showToast(t.copiedText, 'success');

      setTimeout(() => {
        if (btnLabel) btnLabel.textContent = origText;
      }, 1500);
    });
  },

  // Setup Drag and Drop event monitors
  handleDragAndDrop() {
    const overlay = this.els.globalDragOverlay;
    if (!overlay) return;

    window.addEventListener('dragenter', (e) => {
      e.preventDefault();
      overlay.classList.remove('hidden');
    });

    overlay.addEventListener('dragover', (e) => e.preventDefault());
    overlay.addEventListener('dragleave', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
    });

    overlay.addEventListener('drop', (e) => {
      e.preventDefault();
      overlay.classList.add('hidden');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.handleUploadedFile(e.dataTransfer.files[0]);
      }
    });
  },

  // Attached files handler
  handleUploadedFile(file) {
    const validExtensions = ['.rsc', '.txt', '.log'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!validExtensions.includes(ext) && file.type !== 'text/plain') {
      this.showToast('Only text, .rsc, or .log files are supported!', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.state.currentFile = file;
      this.els.pastedConfig.value = e.target.result;
      this.els.fileNameLabel.textContent = file.name;
      this.els.fileSizeLabel.textContent = (file.size / 1024).toFixed(1) + ' KB';
      this.els.fileInfoBar.classList.remove('hidden');
      this.openAttachmentDrawer();
      this.updateConfigAnalysisUI();
      this.showToast('File uploaded successfully!', 'success');
    };
    reader.readAsText(file);
  },

  // Clears file uploads from the attachment context
  removeAttachedFile() {
    this.state.currentFile = null;
    this.els.pastedConfig.value = '';
    this.els.fileInfoBar.classList.add('hidden');
    this.els.fileInput.value = '';
    this.updateConfigAnalysisUI();
  },

  // Pasted config attachment drawer
  toggleAttachmentDrawer() {
    if (this.state.isAttachmentDrawerOpen) {
      this.closeAttachmentDrawer();
    } else {
      this.openAttachmentDrawer();
    }
  },

  openAttachmentDrawer() {
    this.state.isAttachmentDrawerOpen = true;
    this.els.attachmentDrawer.classList.remove('hidden');
    this.els.btnToggleDrawer.classList.add('bg-purple-900/40', 'text-purple-400', 'border', 'border-purple-500/30');
  },

  closeAttachmentDrawer() {
    this.state.isAttachmentDrawerOpen = false;
    this.els.attachmentDrawer.classList.add('hidden');
    this.els.btnToggleDrawer.classList.remove('bg-purple-900/40', 'text-purple-400', 'border', 'border-purple-500/30');
  },

  clearAttachment() {
    this.els.pastedConfig.value = '';
    this.removeAttachedFile();
    this.closeAttachmentDrawer();
  },

  // Formats pasted RouterOS configuration code
  handleFormatConfig() {
    const code = this.els.pastedConfig.value;
    if (!code) {
      this.showToast('Nothing to format!', 'info');
      return;
    }
    if (typeof window.formatRouterOsConfig === 'function') {
      const formatted = window.formatRouterOsConfig(code);
      this.els.pastedConfig.value = formatted;
      this.showToast('Indented and formatted RouterOS config!', 'success');
      this.updateConfigAnalysisUI();
    }
  },

  // Analyzes configuration context in active attachment area
  updateConfigAnalysisUI() {
    const code = this.els.pastedConfig.value.trim();
    if (code && typeof window.isValidRouterOsConfig === 'function' && window.isValidRouterOsConfig(code)) {
      const summary = window.detectConfigSummary(code);
      if (this.els.configSummaryBadge && this.els.configSummaryBadgeText) {
        this.els.configSummaryBadgeText.textContent = summary;
        this.els.configSummaryBadge.classList.remove('hidden');
      }
      this.generateSuggestionChips(code);
    } else {
      if (this.els.configSummaryBadge) {
        this.els.configSummaryBadge.classList.add('hidden');
      }
      if (this.els.suggestionChipsContainer) {
        this.els.suggestionChipsContainer.classList.add('hidden');
        this.els.suggestionChipsContainer.innerHTML = '';
      }
    }
  },

  // Generates suggestion chips based on features detected in attached config
  generateSuggestionChips(configText) {
    if (!this.els.suggestionChipsContainer) return;
    const chips = [];

    if (configText.includes('vlan-filtering=yes') || configText.includes('/interface bridge vlan')) {
      chips.push({ label: '🛡️ Check VLAN Security', query: 'Check if my VLAN security config is correct and if there are any isolated ports leaking.' });
    }
    if (configText.includes('/ip firewall filter')) {
      chips.push({ label: '🛡️ Audit Firewall Rules', query: 'Audit my firewall rules. Are they in the correct order (e.g. drop invalid before accept) and secure?' });
    }
    if (configText.includes('/ip firewall nat')) {
      chips.push({ label: '🔍 Check Masquerade Rules', query: 'Check if there are any redundant or duplicate NAT masquerade rules in this configuration.' });
    }
    if (configText.includes('/ip dhcp-server') || configText.includes('/ip dns')) {
      chips.push({ label: '🌐 Check DNS & DHCP', query: 'Verify if DNS remote requests are configured safely and check the DHCP server config.' });
    }

    if (chips.length === 0) {
      chips.push({ label: '🚀 Audit Configuration', query: 'Please perform a comprehensive best-practice security audit of this RouterOS configuration.' });
    }

    this.els.suggestionChipsContainer.innerHTML = '';
    chips.forEach(chip => {
      const btn = document.createElement('button');
      btn.className = 'px-3 py-1.5 bg-purple-950/20 text-purple-400 border border-purple-500/20 hover:bg-purple-900/30 rounded-full text-xs font-semibold transition active:scale-95 focus:outline-none';
      btn.textContent = chip.label;
      btn.addEventListener('click', () => {
        this.els.chatMessage.value = chip.query;
        this.adjustTextAreaHeight();
        this.submitChat();
      });
      this.els.suggestionChipsContainer.appendChild(btn);
    });

    this.els.suggestionChipsContainer.classList.remove('hidden');
  },

  // Auto adjusting text heights
  adjustTextAreaHeight() {
    const txt = this.els.chatMessage;
    if (!txt) return;
    txt.style.height = '38px';
    txt.style.height = Math.max(38, Math.min(txt.scrollHeight, 128)) + 'px';
  },

  // Intent Detection for smart chips
  handleIntentDetection() {
    const text = this.els.chatMessage.value;
    const keywords = ['/interface bridge', '/ip firewall filter', '/ip firewall nat', '/ip route', '/interface vlan', '/ip dhcp-server'];
    const hasKeyword = keywords.some(kw => text.toLowerCase().includes(kw));

    if (text.length > 300 || hasKeyword) {
      this.renderSmartChips();
    } else {
      this.hideSmartChips();
    }
  },

  renderSmartChips() {
    if (!this.els.smartChipsContainer) return;
    this.els.smartChipsContainer.innerHTML = '';

    const chips = [
      {
        label: '🌐 Analisi Multi-Agente Completa',
        action: () => {
          this.hideSmartChips();
          window.isOrchestratorMode = true;
          const val = this.els.chatMessage.value.trim();
          this.els.chatMessage.value = val ? `[DEEP_DIVE] ${val}` : `[DEEP_DIVE] Analizza questa configurazione in modalità Deep Dive.`;
          this.adjustTextAreaHeight();
          this.submitChat();
        }
      },
      {
        label: '🛡️ Audit Sicurezza Firewall',
        action: () => {
          this.hideSmartChips();
          const val = this.els.chatMessage.value.trim();
          this.els.chatMessage.value = val ? `[FIREWALL_AUDIT] ${val}` : `[FIREWALL_AUDIT] Effettua un audit di sicurezza completo del firewall.`;
          this.adjustTextAreaHeight();
        }
      },
      {
        label: '🗺️ Mappa Topologia VLAN',
        action: () => {
          this.hideSmartChips();
          const val = this.els.chatMessage.value.trim();
          this.els.chatMessage.value = val ? `[VLAN_TOPOLOGY] ${val}` : `[VLAN_TOPOLOGY] Mostra la mappa della topologia VLAN di questa configurazione.`;
          this.adjustTextAreaHeight();
        }
      }
    ];

    chips.forEach(data => {
      const btn = document.createElement('button');
      btn.className = 'px-3 py-1.5 text-xs font-medium rounded-full bg-purple-950/20 text-purple-400 border border-purple-500/20 hover:bg-purple-900/30 transition cursor-pointer';
      btn.textContent = data.label;
      btn.addEventListener('click', data.action);
      this.els.smartChipsContainer.appendChild(btn);
    });
    this.els.smartChipsContainer.classList.remove('hidden');
  },

  hideSmartChips() {
    if (this.els.smartChipsContainer) {
      this.els.smartChipsContainer.classList.add('hidden');
      this.els.smartChipsContainer.innerHTML = '';
    }
  },

  // Slash (/) and At (@) Command Palettes Toggle
  handleCommandPalette(e) {
    const txt = this.els.chatMessage;
    if (!txt) return;

    const val = txt.value;
    const cursorPos = txt.selectionStart;
    const textBefore = val.substring(0, cursorPos);

    // Slash Palette
    const slashMatch = textBefore.match(/(?:^|\s)\/(\w*)$/);
    if (slashMatch) {
      this.showSlashPalette(slashMatch[1].toLowerCase());
    } else {
      this.hideSlashPalette();
    }

    // At Palette
    const atMatch = textBefore.match(/(?:^|\s)@(\w*)$/);
    if (atMatch) {
      this.showAtPalette(atMatch[1].toLowerCase());
    } else {
      this.hideAtPalette();
    }
  },

  showSlashPalette(query) {
    const pal = this.els.slashPalette;
    if (!pal) return;
    pal.classList.remove('hidden');

    let visibleCount = 0;
    const items = pal.querySelectorAll('.slash-item');
    items.forEach(item => {
      const cmd = item.dataset.command.toLowerCase();
      if (cmd.includes(query)) {
        item.style.display = 'flex';
        visibleCount++;
        // Wire unique click once
        if (!item.dataset.wired) {
          item.dataset.wired = "true";
          item.addEventListener('click', () => {
            const command = item.dataset.command;
            const fullVal = this.els.chatMessage.value;
            const idx = this.els.chatMessage.selectionStart;
            const before = fullVal.substring(0, idx);
            const after = fullVal.substring(idx);
            const lastSlash = before.lastIndexOf('/');
            const updated = before.substring(0, lastSlash) + command + ' ' + after;
            this.els.chatMessage.value = updated;
            this.els.chatMessage.focus();
            this.hideSlashPalette();
            if (command === '/audit') {
              window.isOrchestratorMode = true;
            } else if (command === '/queue') {
              this.handleSidebarTabSwitch('queues');
              this.state.isSidebarOpen = true;
              this.syncSidebarState();
              setTimeout(() => this.els.queueTargetName.focus(), 150);
            }
          });
        }
      } else {
        item.style.display = 'none';
      }
    });

    if (visibleCount === 0) pal.classList.add('hidden');
  },

  hideSlashPalette() {
    if (this.els.slashPalette) this.els.slashPalette.classList.add('hidden');
  },

  showAtPalette(query) {
    const pal = this.els.atPalette;
    if (!pal) return;
    pal.classList.remove('hidden');

    let visibleCount = 0;
    const items = pal.querySelectorAll('.at-item');
    items.forEach(item => {
      const modifier = item.dataset.modifier.toLowerCase();
      if (modifier.includes(query)) {
        item.style.display = 'flex';
        visibleCount++;
        if (!item.dataset.wired) {
          item.dataset.wired = "true";
          item.addEventListener('click', () => {
            const mod = item.dataset.modifier;
            const fullVal = this.els.chatMessage.value;
            const idx = this.els.chatMessage.selectionStart;
            const before = fullVal.substring(0, idx);
            const after = fullVal.substring(idx);
            const lastAt = before.lastIndexOf('@');
            const updated = before.substring(0, lastAt) + mod + ' ' + after;
            this.els.chatMessage.value = updated;
            this.els.chatMessage.focus();
            this.hideAtPalette();
          });
        }
      } else {
        item.style.display = 'none';
      }
    });

    if (visibleCount === 0) pal.classList.add('hidden');
  },

  hideAtPalette() {
    if (this.els.atPalette) this.els.atPalette.classList.add('hidden');
  },

  // Sync privacy shields badge count
  updatePrivacyShieldCountLabel() {
    let active = 0;
    if (this.els.maskIPs && this.els.maskIPs.checked) active++;
    if (this.els.maskMACs && this.els.maskMACs.checked) active++;
    if (this.els.maskSecrets && this.els.maskSecrets.checked) active++;
    if (this.els.maskInterfaces && this.els.maskInterfaces.checked) active++;
    if (this.els.maskDomains && this.els.maskDomains.checked) active++;
    if (this.els.maskIdentity && this.els.maskIdentity.checked) active++;

    const badge = document.getElementById('privacy-count-badge');
    if (badge) {
      badge.textContent = `🛡️ Privacy Guard: ${active}/6 Active`;
    }
  },

  // Syncs LLM online badges based on Preferences
  updateLLMStatusBadge() {
    const provider = AppState.preferences.llmProvider;
    const hasKey = !!AppState.preferences.apiKey;

    const dot = this.els.llmStatusDot;
    const label = this.els.llmStatusText;
    if (!dot || !label) return;

    if (provider === 'ollama' || provider === 'custom') {
      dot.className = 'w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse';
      label.textContent = `LAN Active (${provider.toUpperCase()})`;
      label.className = 'text-green-400 font-bold text-xs';
    } else if (hasKey) {
      dot.className = 'w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse';
      label.textContent = `Secure Cloud Active`;
      label.className = 'text-green-400 font-bold text-xs';
    } else {
      dot.className = 'w-2.5 h-2.5 bg-gray-500 rounded-full';
      label.textContent = 'LLM Offline';
      label.className = 'text-gray-400 font-medium text-xs';
    }
  },

  // Load scenarios templates
  loadScenario(type) {
    const isIt = this.state.language === 'it';
    if (type === 'firewall') {
      this.els.pastedConfig.value = `/ip firewall filter\nadd action=accept chain=input comment="defconf: accept established,related" connection-state=established,related\nadd action=drop chain=input comment="defconf: drop invalid" connection-state=invalid\nadd action=accept chain=input protocol=icmp\nadd action=drop chain=input comment="defconf: drop WAN access" in-interface-list=WAN\nadd action=accept chain=forward comment="defconf: accept in-interface=ether1" in-interface=ether1`;
      this.els.chatMessage.value = isIt ? "Audita le mie regole di firewall. Ci sono vulnerabilità o regole ombreggiate?" : "Please audit my firewall configuration and perform a vulnerability/security check on it.";
      this.openAttachmentDrawer();
      this.adjustTextAreaHeight();
      this.showToast(isIt ? 'Configurazione firewall caricata!' : 'Firewall configuration pre-filled!', 'success');
    } else if (type === 'vlan') {
      this.els.chatMessage.value = isIt ? "Come posso configurare una VLAN Wi-Fi ospiti (VLAN ID: 20) passo-passo con i relativi comandi RouterOS?" : "How do I configure a Guest Wi-Fi VLAN (VLAN ID: 20) step-by-step? Please generate the correct RouterOS commands.";
      this.adjustTextAreaHeight();
      this.showToast(isIt ? 'Modello VLAN ospiti caricato!' : 'Guest Wi-Fi VLAN prompt loaded!', 'success');
    } else if (type === 'queues') {
      this.els.chatMessage.value = isIt ? "Spiegami come posso ottimizzare la banda per diversi dispositivi e creare Simple Queues su MikroTik." : "Explain how I can optimize bandwidth for different devices and set up Simple Queues on MikroTik.";
      this.adjustTextAreaHeight();
      this.showToast(isIt ? 'Modello Simple Queues caricato!' : 'Simple Queues template loaded!', 'success');
    } else if (type === 'pppoe') {
      this.els.chatMessage.value = isIt ? "Aiutami a diagnosticare e correggere i problemi di instradamento con PPPoE sulla mia interfaccia WAN MikroTik." : "Help me diagnose and fix PPPoE / WAN Routing issues on my MikroTik router.";
      this.adjustTextAreaHeight();
      this.showToast(isIt ? 'Modello instradamento PPPoE caricato!' : 'PPPoE / WAN Routing template loaded!', 'success');
    }
  },

  // Toast notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-gray-900 border-gray-700 text-gray-100';

    if (type === 'success') {
      toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-emerald-950 border-emerald-500 text-emerald-200';
      toast.innerHTML = `<span>🟢</span> <span class="text-xs font-semibold">${message}</span>`;
    } else if (type === 'error') {
      toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-red-950 border-red-500 text-red-200';
      toast.innerHTML = `<span>🔴</span> <span class="text-xs font-semibold">${message}</span>`;
    } else {
      toast.innerHTML = `<span>🔵</span> <span class="text-xs font-semibold">${message}</span>`;
    }

    // Append to body if toast-container is missing
    let target = container || document.getElementById('app');
    if (!target) target = document.body;
    target.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Renders chat history items
  renderHistoryList(filterQuery = '') {
    const container = this.els.historyItemsContainer;
    if (!container) return;

    const t = this.getT();
    container.innerHTML = '';

    const query = filterQuery.toLowerCase().trim();
    const filtered = this.state.history.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const msgMatch = item.messages && item.messages.some(m => m.chatMessage && m.chatMessage.toLowerCase().includes(query));
      return titleMatch || msgMatch;
    });

    if (this.state.history.length === 0) {
      container.innerHTML = `<div id="ui-history-empty" class="text-center py-8 text-gray-500 text-xs font-medium">${t.historyEmpty}</div>`;
      return;
    }
    if (filtered.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-gray-500 text-xs font-medium">No matches found.</div>`;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'group relative p-2.5 bg-gray-900 border border-gray-700/60 rounded-xl cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition duration-200 active:scale-95 flex flex-col';

      const dBtn = document.createElement('button');
      dBtn.className = 'absolute top-2.5 right-2.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 hover:bg-red-500/10 rounded';
      dBtn.innerHTML = `
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      `;
      dBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.deleteHistoryItem(item.id);
      });

      const firstMsg = item.messages && item.messages[0] ? item.messages[0].chatMessage : '';

      card.innerHTML = `
        <div class="flex items-center justify-between pr-6 mb-1">
          <span class="text-xs font-bold text-white truncate max-w-[140px]">${item.title}</span>
          <span class="text-[9px] text-gray-500 font-mono">${item.timestamp}</span>
        </div>
        <p class="text-[10px] text-gray-400 line-clamp-1 leading-relaxed">${firstMsg || '(No description)'}</p>
      `;
      card.appendChild(dBtn);
      card.addEventListener('click', () => this.restoreConversation(item));
      container.appendChild(card);
    });
  },

  searchHistory(query) {
    this.renderHistoryList(query);
  },

  deleteHistoryItem(id) {
    this.state.history = this.state.history.filter(h => h.id !== id);
    localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(this.state.history));
    if (this.state.currentChatId === id) {
      this.resetChatSession();
    }
    this.renderHistoryList();
  },

  clearHistoryAll() {
    this.state.history = [];
    localStorage.removeItem('mikrotik_chatbot_history');
    this.resetChatSession();
    this.renderHistoryList();
    this.showToast('All conversation history cleared!', 'success');
  },

  resetChatSession() {
    this.state.currentChatId = null;
    this.state.pastedConfigRaw = '';
    this.els.chatMessagesContainer.innerHTML = '';
    this.els.panelWelcome.classList.remove('hidden');
    this.els.chatMessage.value = '';
    this.adjustTextAreaHeight();
    this.removeAttachedFile();
  },

  // Restore history turns
  restoreConversation(item) {
    this.els.chatMessagesContainer.innerHTML = '';
    this.els.panelWelcome.classList.add('hidden');

    this.state.currentChatId = item.id;
    this.state.pastedConfigRaw = '';

    if (item.rosVersion) this.els.selectRosVersion.value = item.rosVersion;
    if (item.hardwareModel) this.els.selectHardware.value = item.hardwareModel;

    if (item.messages && item.messages.length > 0) {
      item.messages.forEach(msg => {
        this.appendUserMessageBubble(msg.chatMessage, msg.pastedConfig);
        this.appendAssistantResponseBubble(msg.result);
      });
    }

    this.showToast('Conversation restored successfully!', 'success');
  },

  // Abortable custom delay helper
  delay(ms, signal) {
    return new Promise((resolve, reject) => {
      if (signal && signal.aborted) {
        return reject(new DOMException('Aborted', 'AbortError'));
      }
      const timer = setTimeout(() => {
        if (signal) signal.removeEventListener('abort', onAbort);
        resolve();
      }, ms);
      function onAbort() {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      }
      if (signal) signal.addEventListener('abort', onAbort);
    });
  },

  // Centralized button state manager
  setButtonState(state) {
    const btn = this.els.btnSubmit;
    const sIcon = this.els.submitIcon;
    const spinner = this.els.loadingSpinner;
    const stopIcon = this.els.stopIcon;
    if (!btn) return;

    if (state === 'loading') {
      sIcon.classList.add('hidden');
      spinner.classList.remove('hidden');
      stopIcon.classList.add('hidden'); // Wait, let's keep spinner or show stopIcon as required
      // "The chat submission button (btn-submit) and attachment button (btn-toggle-drawer) utilize fixed sizing (w-11 h-11)
      // with centered flex layouts to guarantee perfect vertical alignment and prevent any shift or offset issues when toggling between normal and stop/cancel states."
      // Let's show stopIcon instead of spinner so they can click it to abort!
      spinner.classList.add('hidden');
      stopIcon.classList.remove('hidden');
    } else {
      sIcon.classList.remove('hidden');
      spinner.classList.add('hidden');
      stopIcon.classList.add('hidden');
    }
  },

  // Chat Submission Controller
  async submitChat() {
    if (this.activeAbortController) {
      this.activeAbortController.abort();
      return;
    }

    const pastedVal = this.els.pastedConfig.value.trim();
    const chatVal = this.els.chatMessage.value.trim();

    if (!pastedVal && !chatVal) {
      this.showToast('Please attach a configuration or write a question!', 'error');
      return;
    }

    // Save values for potential restoration
    const savedChatMessage = this.els.chatMessage.value;
    const savedPastedConfig = this.els.pastedConfig.value;
    const savedCurrentFile = this.state.currentFile;
    const savedFileName = this.els.fileNameLabel.textContent;
    const savedFileSize = this.els.fileSizeLabel.textContent;
    const savedIsFileBarVisible = !this.els.fileInfoBar.classList.contains('hidden');

    // Clear inputs immediately
    this.els.chatMessage.value = '';
    this.adjustTextAreaHeight();
    this.els.pastedConfig.value = '';
    this.state.currentFile = null;
    this.els.fileInfoBar.classList.add('hidden');
    this.closeAttachmentDrawer();
    this.updateConfigAnalysisUI();

    // Setup active abort controller and button state
    this.activeAbortController = new AbortController();
    this.setButtonState('loading');

    this.state.pastedConfigRaw = pastedVal;

    const maskOptions = {
      maskIPs: this.els.maskIPs.checked,
      maskMACs: this.els.maskMACs.checked,
      maskSecrets: this.els.maskSecrets.checked,
      maskInterfaces: this.els.maskInterfaces.checked,
      maskDomains: this.els.maskDomains.checked,
      maskIdentity: this.els.maskIdentity.checked
    };

    let chatHistory = [];
    const currentChatId = this.state.currentChatId;
    if (currentChatId) {
      const activeChat = this.state.history.find(h => h.id === currentChatId);
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

    const isOrchestrator = !!(window.isOrchestratorMode || (chatVal && chatVal.includes('[DEEP_DIVE]')));

    const body = {
      pastedConfig: pastedVal,
      chatMessage: chatVal,
      chatHistory,
      provider: AppState.preferences.llmProvider,
      apiKey: AppState.preferences.apiKey,
      baseUrl: AppState.preferences.baseUrl || '',
      model: AppState.preferences.model,
      systemPrompt: AppState.preferences.prompt || '',
      language: this.state.language,
      maskOptions,
      routerOsVersion: this.els.selectRosVersion.value,
      hardwareModel: this.els.selectHardware.value,
      mode: isOrchestrator ? 'orchestrator' : 'standard'
    };

    // Reset orchestrator mode flag
    window.isOrchestratorMode = false;

    try {
      await this.runStepperAndSubmit(body, this.activeAbortController.signal, false);
    } catch (err) {
      if (err.name === 'AbortError') {
        // Restore inputs on cancel/stop
        if (savedChatMessage) {
          this.els.chatMessage.value = savedChatMessage;
          this.adjustTextAreaHeight();
        }
        if (savedPastedConfig) {
          this.els.pastedConfig.value = savedPastedConfig;
        }
        if (savedCurrentFile) {
          this.state.currentFile = savedCurrentFile;
        }
        if (savedIsFileBarVisible) {
          this.els.fileNameLabel.textContent = savedFileName;
          this.els.fileSizeLabel.textContent = savedFileSize;
          this.els.fileInfoBar.classList.remove('hidden');
          this.openAttachmentDrawer();
          this.updateConfigAnalysisUI();
        }
        this.showToast('Request stopped. Inputs restored!', 'info');
      }
    } finally {
      this.activeAbortController = null;
      this.setButtonState('send');
    }
  },

  // Progressive 4-stage pipeline stepper loader and submission
  async runStepperAndSubmit(submitPayload, signal, isRetry = false) {
    const t = this.getT();

    const loaderCard = document.createElement('div');
    loaderCard.id = 'inline-loader-card';
    loaderCard.className = 'flex flex-col space-y-3.5 items-start max-w-2xl mr-auto w-full select-none p-5 bg-gray-800 border border-purple-500/30 rounded-2xl shadow shadow-purple-500/10 animate-pulse';

    loaderCard.innerHTML = `
      <!-- Header -->
      <div class="flex items-center space-x-2.5">
        <div class="relative w-7 h-7 flex items-center justify-center shrink-0">
          <div class="absolute inset-0 border-2 border-dashed border-purple-500/50 rounded-lg animate-[spin_4s_linear_infinite]"></div>
          <div class="w-4 h-4 rounded bg-purple-500 text-white flex items-center justify-center border border-white/10">
            <svg class="w-2.5 h-2.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider">${t.loaderTitle}</h4>
          <p class="text-[9px] text-gray-400">Executing safe de-identification network audit...</p>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-gray-950 rounded-full h-2.5 border border-gray-700 overflow-hidden relative">
        <div id="inline-loader-progress-bar" class="bg-purple-500 h-full w-[0%] transition-all duration-300"></div>
      </div>
      <div class="flex justify-between w-full text-[10px] font-bold text-gray-500">
        <span id="inline-loader-log-text">${t.loaderStep1DescActive}</span>
        <span id="inline-loader-percentage" class="text-purple-400 font-mono">0%</span>
      </div>

      <!-- Steps -->
      <div class="w-full space-y-2 border-t border-gray-700/50 pt-3 text-[11px] font-medium">
        <div id="inline-step-mask" class="flex items-center justify-between text-gray-200">
          <div class="flex items-center space-x-2.5">
            <div class="step-indicator w-4 h-4 rounded-full border border-purple-500/50 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-purple-400">1</div>
            <span>${t.loaderStep1Title}</span>
          </div>
          <span class="step-stat text-[10px] font-mono text-purple-400">Active</span>
        </div>

        <div id="inline-step-transit" class="flex items-center justify-between text-gray-600">
          <div class="flex items-center space-x-2.5">
            <div class="step-indicator w-4 h-4 rounded-full border border-gray-750 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-gray-600">2</div>
            <span>${t.loaderStep2Title}</span>
          </div>
          <span class="step-stat text-[10px] font-mono text-gray-600">Pending</span>
        </div>

        <div id="inline-step-restore" class="flex items-center justify-between text-gray-600">
          <div class="flex items-center space-x-2.5">
            <div class="step-indicator w-4 h-4 rounded-full border border-gray-750 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-gray-600">3</div>
            <span>${t.loaderStep3Title}</span>
          </div>
          <span class="step-stat text-[10px] font-mono text-gray-600">Pending</span>
        </div>

        <div id="inline-step-diff" class="flex items-center justify-between text-gray-600">
          <div class="flex items-center space-x-2.5">
            <div class="step-indicator w-4 h-4 rounded-full border border-gray-750 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-gray-600">4</div>
            <span>${t.loaderStep4Title}</span>
          </div>
          <span class="step-stat text-[10px] font-mono text-gray-600">Pending</span>
        </div>
      </div>
    `;

    // Append User message (Skip if retry as it already exists in message stream)
    if (!isRetry) {
      this.appendUserMessageBubble(submitPayload.chatMessage, this.state.pastedConfigRaw);
    }

    const activeContainer = this.els.chatMessagesContainer;
    this.els.panelWelcome.classList.add('hidden');
    activeContainer.appendChild(loaderCard);
    this.scrollStreamToBottom();

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
        el.className = 'flex items-center justify-between text-gray-200';
        indicator.className = 'step-indicator w-4 h-4 rounded-full border border-purple-500/50 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-purple-400';
        stat.textContent = 'Active';
        stat.className = 'step-stat text-[10px] font-mono text-purple-400';
      } else if (stepState === 'complete') {
        el.className = 'flex items-center justify-between text-gray-400';
        indicator.className = 'step-indicator w-4 h-4 rounded-full border border-emerald-500/50 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-emerald-400';
        indicator.innerHTML = '✓';
        stat.textContent = 'Completed';
        stat.className = 'step-stat text-[10px] font-mono text-emerald-400';
      } else {
        el.className = 'flex items-center justify-between text-gray-650';
        indicator.className = 'step-indicator w-4 h-4 rounded-full border border-gray-750 text-[9px] font-bold flex items-center justify-center bg-gray-900 text-gray-600';
        stat.textContent = 'Pending';
        stat.className = 'step-stat text-[10px] font-mono text-gray-600';
      }
    }

    let currentProgress = 0;
    let targetProgress = 15;
    let progressInterval = null;

    function setInlineProgressBar(pct, text) {
      if (inlineProgressBar) inlineProgressBar.style.width = pct + '%';
      if (inlinePercentage) inlinePercentage.textContent = text;
    }

    // Ticker to smoothly advance currentProgress towards targetProgress
    progressInterval = setInterval(() => {
      if (signal && signal.aborted) {
        clearInterval(progressInterval);
        return;
      }
      if (currentProgress < targetProgress) {
        currentProgress += Math.min(1.5, targetProgress - currentProgress);
        setInlineProgressBar(Math.round(currentProgress), `${Math.round(currentProgress)}%`);
      } else if (targetProgress === 80) {
        // Creep extremely slowly towards 80% during AI transit so it never freezes
        currentProgress += (80 - currentProgress) * 0.025;
        setInlineProgressBar(Math.round(currentProgress), `${Math.round(currentProgress)}%`);
      }
    }, 100);

    let serverResponseData = null;
    let serverError = null;

    try {
      // Stage 1: Masking
      await this.delay(700, signal);
      updateInlineStep(inlineStepMask, 'complete', t.loaderStep1DescComplete);
      updateInlineStep(inlineStepTransit, 'active', t.loaderStep2DescActive);
      targetProgress = 80;

      // Stage 2: AI Transit & Call API
      const fetchPromise = fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitPayload),
        signal: signal
      });

      const timeoutPromise = this.delay(1200, signal);
      const [res] = await Promise.all([fetchPromise, timeoutPromise]);

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      serverResponseData = await res.json();

      // Stage 3: Restoration
      updateInlineStep(inlineStepTransit, 'complete', t.loaderStep2DescComplete);
      updateInlineStep(inlineStepRestore, 'active', t.loaderStep3DescActive);
      targetProgress = 95;
      await this.delay(600, signal);

      // Stage 4: Formatting Diff
      updateInlineStep(inlineStepRestore, 'complete', t.loaderStep3DescComplete);
      updateInlineStep(inlineStepDiff, 'active', t.loaderStep4DescActive);
      targetProgress = 100;
      await this.delay(500, signal);

      // Completed
      updateInlineStep(inlineStepDiff, 'complete', t.loaderStep4DescComplete);
      await this.delay(300, signal);

    } catch (err) {
      serverError = err;
    } finally {
      if (progressInterval) clearInterval(progressInterval);
    }

    if (serverError) {
      loaderCard.remove();
      if (serverError.name === 'AbortError') {
        throw serverError;
      }
      this.showToast(serverError.message, 'error');
      this.appendInlineErrorCard(serverError.message, () => {
        this.retryChat(submitPayload);
      });
      return;
    }

    // Remove loading card
    loaderCard.remove();

    // Append assistant bubble
    this.appendAssistantResponseBubble(serverResponseData);
    this.showToast('Auditing pipeline complete!', 'success');

    // Save conversation step in history list
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let title = `RouterOS Config ${this.state.history.length + 1}`;
    const currentChatId = this.state.currentChatId;

    if (currentChatId) {
      const existing = this.state.history.find(h => h.id === currentChatId);
      if (existing) title = existing.title;
    } else if (this.state.currentFile) {
      title = this.state.currentFile.name;
    }

    this.saveHistoryItem({
      id: currentChatId || Date.now(),
      title,
      timestamp,
      rosVersion: submitPayload.routerOsVersion,
      hardwareModel: submitPayload.hardwareModel,
      messages: [{
        chatMessage: submitPayload.chatMessage || 'Configuration audit request',
        pastedConfig: this.state.pastedConfigRaw,
        result: serverResponseData
      }]
    });
  },

  async retryChat(submitPayload) {
    this.activeAbortController = new AbortController();
    this.setButtonState('loading');
    try {
      await this.runStepperAndSubmit(submitPayload, this.activeAbortController.signal, true);
    } catch (err) {
      if (err.name === 'AbortError') this.showToast('Retry stopped.', 'info');
    } finally {
      this.activeAbortController = null;
      this.setButtonState('send');
    }
  },

  // Save conversation log
  saveHistoryItem(item) {
    const activeChatId = this.state.currentChatId;
    if (activeChatId) {
      const idx = this.state.history.findIndex(h => h.id === activeChatId);
      if (idx !== -1) {
        this.state.history[idx].messages.push(...item.messages);
        this.state.history[idx].timestamp = item.timestamp;
        const updated = this.state.history.splice(idx, 1)[0];
        this.state.history.unshift(updated);
        localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(this.state.history));
        this.renderHistoryList();
        return;
      }
    }

    this.state.currentChatId = item.id;
    this.state.history.unshift(item);
    if (this.state.history.length > 25) this.state.history.pop();
    localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(this.state.history));
    this.renderHistoryList();
  },

  // Exec shadow detector
  async analyzeFirewallShadows() {
    const pastedVal = this.els.pastedConfig.value.trim();
    if (!pastedVal) {
      this.showToast('Please attach or paste a RouterOS configuration export first!', 'error');
      return;
    }

    this.activeAbortController = new AbortController();
    this.setButtonState('loading');

    const maskOptions = {
      maskIPs: this.els.maskIPs.checked,
      maskMACs: this.els.maskMACs.checked,
      maskSecrets: this.els.maskSecrets.checked,
      maskInterfaces: this.els.maskInterfaces.checked,
      maskDomains: this.els.maskDomains.checked,
      maskIdentity: this.els.maskIdentity.checked
    };

    const body = {
      pastedConfig: pastedVal,
      provider: AppState.preferences.llmProvider,
      apiKey: AppState.preferences.apiKey,
      baseUrl: AppState.preferences.baseUrl || '',
      model: AppState.preferences.model,
      language: this.state.language,
      maskOptions,
      routerOsVersion: this.els.selectRosVersion.value,
      hardwareModel: this.els.selectHardware.value
    };

    const loaderCard = document.createElement('div');
    loaderCard.id = 'inline-loader-card';
    loaderCard.className = 'flex flex-col space-y-3.5 items-start max-w-2xl mr-auto w-full select-none p-5 bg-gray-800 border border-purple-500/30 rounded-2xl shadow animate-pulse';

    loaderCard.innerHTML = `
      <div class="flex items-center space-x-2.5">
        <div class="relative w-7 h-7 flex items-center justify-center shrink-0">
          <div class="absolute inset-0 border-2 border-dashed border-purple-500/50 rounded-lg animate-[spin_4s_linear_infinite]"></div>
          <div class="w-4 h-4 rounded bg-purple-500 text-white flex items-center justify-center border border-white/10">
            <svg class="w-2.5 h-2.5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
        <div>
          <h4 class="text-xs font-black text-white uppercase tracking-wider">Firewall Shadow Detector</h4>
          <p class="text-[9px] text-gray-400">Executing deep rule-dependency mapping...</p>
        </div>
      </div>
      <div class="w-full bg-gray-950 rounded-full h-2.5 border border-gray-700 overflow-hidden relative">
        <div id="inline-loader-progress-bar" class="bg-purple-500 h-full w-[0%] transition-all duration-300"></div>
      </div>
      <div class="flex justify-between w-full text-[10px] font-bold text-gray-500">
        <span id="inline-loader-log-text">Analyzing rule sequence ordering...</span>
        <span id="inline-loader-percentage" class="text-purple-400 font-mono">0%</span>
      </div>
    `;

    this.appendUserMessageBubble("Analyze Firewall Shadows", pastedVal);

    const activeContainer = this.els.chatMessagesContainer;
    this.els.panelWelcome.classList.add('hidden');
    activeContainer.appendChild(loaderCard);
    this.scrollStreamToBottom();

    const inlineProgressBar = loaderCard.querySelector('#inline-loader-progress-bar');
    const inlineLogText = loaderCard.querySelector('#inline-loader-log-text');
    const inlinePercentage = loaderCard.querySelector('#inline-loader-percentage');

    let currentProgress = 0;
    let targetProgress = 30;
    let progressInterval = setInterval(() => {
      if (this.activeAbortController.signal.aborted) {
        clearInterval(progressInterval);
        return;
      }
      if (currentProgress < targetProgress) {
        currentProgress += Math.min(2, targetProgress - currentProgress);
        if (inlineProgressBar) inlineProgressBar.style.width = currentProgress + '%';
        if (inlinePercentage) inlinePercentage.textContent = Math.round(currentProgress) + '%';
      } else if (targetProgress === 85) {
        currentProgress += (85 - currentProgress) * 0.02;
        if (inlineProgressBar) inlineProgressBar.style.width = currentProgress + '%';
        if (inlinePercentage) inlinePercentage.textContent = Math.round(currentProgress) + '%';
      }
    }, 100);

    try {
      await this.delay(500, this.activeAbortController.signal);
      if (inlineLogText) inlineLogText.textContent = "Dispatched query to secure sandbox...";
      targetProgress = 85;

      const res = await fetch('/api/analyze-shadows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: this.activeAbortController.signal
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || `Server error ${res.status}`);
      }

      const data = await res.json();

      clearInterval(progressInterval);
      if (inlineProgressBar) inlineProgressBar.style.width = '100%';
      if (inlinePercentage) inlinePercentage.textContent = '100%';
      if (inlineLogText) inlineLogText.textContent = "Formatting visualization cards...";
      await this.delay(300, this.activeAbortController.signal);

      loaderCard.remove();
      this.renderShadowDetectorResults(data);

      // Save turn to history
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let title = `Firewall Shadows ${this.state.history.length + 1}`;
      const currentChatId = this.state.currentChatId;

      this.saveHistoryItem({
        id: currentChatId || Date.now(),
        title,
        timestamp,
        rosVersion: this.els.selectRosVersion.value,
        hardwareModel: this.els.selectHardware.value,
        messages: [{
          chatMessage: "Analyze Firewall Shadows",
          pastedConfig: pastedVal,
          result: {
            explanation: data.explanation,
            shadowDetectorResult: data
          }
        }]
      });

    } catch (err) {
      clearInterval(progressInterval);
      loaderCard.remove();
      if (err.name === 'AbortError') {
        this.showToast('Shadow analysis stopped.', 'info');
        return;
      }
      this.showToast(err.message, 'error');
      this.appendInlineErrorCard(err.message, () => this.analyzeFirewallShadows());
    } finally {
      this.activeAbortController = null;
      this.setButtonState('send');
    }
  },

  // Inline retry exception card
  appendInlineErrorCard(errorMessage, retryCallback) {
    const container = this.els.chatMessagesContainer;
    const card = document.createElement('div');
    card.className = 'flex flex-col space-y-3 p-5 rounded-2xl bg-red-950/40 border border-red-500/30 text-xs text-red-200 w-full max-w-2xl animate-apple-reveal';

    card.innerHTML = `
      <div class="flex items-start space-x-3">
        <span class="text-base select-none">💥</span>
        <div class="flex-1 space-y-1">
          <h4 class="font-bold uppercase tracking-wider text-red-400">Analysis Pipeline Failed</h4>
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
    this.scrollStreamToBottom();
  },

  // Bubble Appenders
  appendUserMessageBubble(messageText, pastedConfigText) {
    const container = this.els.chatMessagesContainer;
    const bubble = document.createElement('div');
    bubble.className = 'flex flex-col space-y-2.5 items-end max-w-3xl ml-auto w-full select-text animate-apple-reveal';

    let attachmentHtml = '';
    if (pastedConfigText) {
      attachmentHtml = `
        <div class="text-xs rounded-2xl p-3 bg-gray-800 border border-gray-700 max-w-full font-mono text-[10px] text-gray-400 select-text overflow-x-auto max-h-40 whitespace-pre">
          <span class="block text-[9px] font-black uppercase text-purple-400 tracking-wider mb-1 select-none">📎 Attached RSC Export</span>
          <span>${pastedConfigText.trim()}</span>
        </div>
      `;
    }

    bubble.innerHTML = `
      <div class="flex items-center space-x-2 text-[10px] text-gray-500 font-semibold select-none">
        <span>You</span>
        <span>•</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="bg-purple-600 text-white text-xs p-4 rounded-2xl leading-relaxed shadow-lg max-w-full">
        ${messageText || 'Analyze attached configuration.'}
      </div>
      ${attachmentHtml}
    `;

    container.appendChild(bubble);
    this.scrollStreamToBottom();
  },

  appendAssistantResponseBubble(result) {
    if (result && result.shadowDetectorResult) {
      this.renderShadowDetectorResults(result.shadowDetectorResult);
      return;
    }
    if (result && result.isOrchestrator === true) {
      this.appendOrchestratorResponse(result);
      return;
    }

    const container = this.els.chatMessagesContainer;
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col space-y-2.5 items-start max-w-3xl mr-auto w-full select-text animate-apple-reveal';

    const parsed = this.parseAIResponse(result.rawResponse || result.explanation || '');
    if (parsed.explanation) result.explanation = parsed.explanation;
    if (parsed.fixCommands) result.fixCommands = parsed.fixCommands;
    if (parsed.correctedConfig) result.correctedConfig = parsed.correctedConfig;

    if (result.explanation) result.explanation = result.explanation.replace(/\\n/g, '\n');
    if (result.fixCommands) result.fixCommands = result.fixCommands.replace(/\\n/g, '\n');
    if (result.correctedConfig) result.correctedConfig = result.correctedConfig.replace(/\\n/g, '\n');

    // Progressive HTML rendering of explanations using legacy markdown parser
    let explanationHtml = '';
    if (typeof window.renderMarkdown === 'function') {
      explanationHtml = window.renderMarkdown(result.explanation || 'No explanation returned.');
    } else {
      explanationHtml = result.explanation || 'No explanation returned.';
    }

    const pasted = this.state.pastedConfigRaw;
    const hasDiff = result.correctedConfig && result.correctedConfig.trim().length > 0 &&
                    pasted && pasted.trim().length > 0 &&
                    result.correctedConfig.trim() !== pasted.trim();

    const rawLines = result.fixCommands ? result.fixCommands.split('\n') : [];
    const hasCommands = rawLines.map(line => line.trim()).some(line => line.length > 0 && !line.startsWith('#'));
    const hasCorrectedConfig = result.correctedConfig && result.correctedConfig.trim().length > 0;

    let extractedCommands = '';
    if (typeof window.extractRouterOsCommands === 'function') {
      extractedCommands = window.extractRouterOsCommands(result.explanation || '');
    }
    const hasExtracted = extractedCommands.trim().length > 0;

    // VLAN Topology Extraction Section
    let vlanHtml = '';
    let parsedVlan = [];
    if (typeof window.parseVlanConfig === 'function' && typeof window.generateVlanMermaidGraph === 'function') {
      try {
        parsedVlan = window.parseVlanConfig(result.correctedConfig || pasted || '');
        if (parsedVlan && parsedVlan.length > 0) {
          vlanHtml = `
            <div class="mt-4 p-4 bg-gray-950 border border-purple-500/20 rounded-2xl w-full vlan-topology-section select-none">
              <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-800">
                <div class="flex items-center gap-2">
                  <span class="text-sm">🕸️</span>
                  <span class="text-xs font-black uppercase tracking-wider text-white">Bridge VLAN Topology</span>
                </div>
                <button class="interactive-map-btn bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-medium transition active:scale-95">Interactive Map</button>
              </div>
              <p class="text-[10px] text-gray-500 mb-3">Dynamically extracted from active Bridge & Port configurations.</p>
              <div class="mermaid-diagram-container overflow-x-auto bg-gray-900 rounded-xl p-3 border border-gray-800 flex justify-center">
                <div class="mermaid w-full text-center">${window.generateVlanMermaidGraph(parsedVlan)}</div>
              </div>
            </div>
          `;
        }
      } catch (err) {
        console.warn('VLAN map generator failed:', err);
      }
    }

    let actionButtonsHtml = '';
    if (hasDiff || hasCommands || hasCorrectedConfig || hasExtracted) {
      actionButtonsHtml = `
        <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-700/50 select-none">
          ${hasDiff ? `
          <button id="btn-show-diff" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50">
            <span>🔍</span> Diff
          </button>
          ` : ''}
          ${hasCommands ? `
          <button id="btn-show-checklist" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600/50 hover:border-gray-500">
            <span>📋</span> Checklist
          </button>
          ` : ''}
          ${hasCorrectedConfig ? `
          <button id="btn-download-rsc" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50">
            <span>💾</span> <span class="rsc-btn-label">.rsc</span>
          </button>
          ` : ''}
          ${hasCorrectedConfig ? `
          <button class="btn-action bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600/30" data-action="send-to-build">🛠️ Send to Builder</button>
          ` : ''}
          ${hasExtracted || hasCommands ? `
          <button id="btn-copy-commands" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50">
            <span>📋</span> Copy
          </button>
          ` : ''}
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="flex items-center space-x-2 text-[10px] text-gray-500 font-semibold select-none">
        <span class="text-purple-400">🧙‍♂️ Mik the Winbox Wizard</span>
        <span>•</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="chat-bubble-assistant text-xs text-gray-300 bg-gray-800 border border-gray-700 p-5 rounded-2xl leading-relaxed shadow-xl max-w-full w-full">
        <div class="prose prose-invert max-w-none">${explanationHtml}</div>
        ${vlanHtml}
        ${actionButtonsHtml}
      </div>
    `;

    // Hook Interactive Map click handler
    const interactiveMapBtn = wrapper.querySelector('.interactive-map-btn');
    if (interactiveMapBtn) {
      interactiveMapBtn.addEventListener('click', () => this.openInteractiveMapModal(parsedVlan));
    }

    // Hook modal triggers
    const btnShowDiff = wrapper.querySelector('#btn-show-diff');
    if (btnShowDiff) {
      btnShowDiff.addEventListener('click', () => {
        this.renderDiff(result.maskedOriginalConfig || pasted || '', result.maskedCorrectedConfig || result.correctedConfig || '');
        this.els.modalDiff.classList.remove('hidden');
      });
    }
    const btnShowChecklist = wrapper.querySelector('#btn-show-checklist');
    if (btnShowChecklist) {
      btnShowChecklist.addEventListener('click', () => {
        this.renderChecklistCommands(result.fixCommands || '');
        this.els.modalCommands.classList.remove('hidden');
      });
    }
    const btnDownloadRsc = wrapper.querySelector('#btn-download-rsc');
    if (btnDownloadRsc) {
      btnDownloadRsc.addEventListener('click', () => {
        this.downloadAsRscFile(result.correctedConfig || '');
      });
    }
    const btnCopyCommands = wrapper.querySelector('#btn-copy-commands');
    if (btnCopyCommands) {
      btnCopyCommands.addEventListener('click', () => {
        const textToCopy = hasExtracted ? extractedCommands : result.fixCommands;
        navigator.clipboard.writeText(textToCopy).then(() => {
          this.showToast('Fix commands copied to clipboard!', 'success');
        });
      });
    }

    const btnSendToBuild = wrapper.querySelector('[data-action="send-to-build"]');
    if (btnSendToBuild) {
      btnSendToBuild.addEventListener('click', () => {
        AppState.setCurrentTab('build');
        Router.renderCurrentTab();
        Router.updateActiveTab('build');

        setTimeout(() => {
          if (BuildTab && BuildTab.receiveFromAudit) {
            BuildTab.receiveFromAudit(result.correctedConfig);
          }
        }, 100);
      });
    }

    container.appendChild(wrapper);
    this.scrollStreamToBottom();

    // Trigger mermaid rendering safely
    setTimeout(() => {
      if (typeof window.renderMermaidGraphs === 'function') window.renderMermaidGraphs(wrapper);
    }, 50);
  },

  // Renders Orchestrator multi-agent logs payload
  appendOrchestratorResponse(result) {
    const container = this.els.chatMessagesContainer;
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col space-y-4 items-start max-w-3xl mr-auto w-full select-text animate-apple-reveal';

    const execSummaryHtml = typeof window.renderMarkdown === 'function' ? window.renderMarkdown(result.executiveSummary || '') : result.executiveSummary || '';

    let agentCardsHtml = '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4 w-full">';
    if (result.agentCards && Array.isArray(result.agentCards)) {
      result.agentCards.forEach(agent => {
        const icon = agent.role === 'security' ? '🛡️' : (agent.role === 'vlan' ? '🗺️' : '🌐');
        const agentContentHtml = typeof window.renderMarkdown === 'function' ? window.renderMarkdown(agent.content || '') : agent.content || '';
        agentCardsHtml += `
          <div class="bg-gray-900 border border-gray-700/60 rounded-xl p-4 flex flex-col space-y-2">
            <div class="flex items-center space-x-2 border-b border-gray-700/40 pb-2 mb-2 select-none">
              <span class="text-base">${icon}</span>
              <span class="font-bold text-xs uppercase tracking-wider text-white">${agent.title || 'Agent'}</span>
            </div>
            <div class="text-[11px] leading-relaxed text-gray-300 overflow-y-auto max-h-60 select-text">
              ${agentContentHtml}
            </div>
          </div>
        `;
      });
    }
    agentCardsHtml += '</div>';

    const uniqueId = 'orchestrator-unified-script-' + Math.random().toString(36).substr(2, 9);
    const unifiedFixScriptText = result.unifiedFixScript || '';

    const unifiedScriptHtml = `
      <div class="relative group/code my-4 border border-gray-700 rounded-xl overflow-hidden bg-gray-950 shadow-lg select-text w-full">
        <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 select-none">
          <div class="flex items-center space-x-1.5 text-gray-400 font-sans text-xs font-semibold">
            <span>🛠️ Unified Fix Script (Copy All)</span>
          </div>
          <button onclick="copySnippetText('${uniqueId}', this)" class="text-gray-400 hover:text-white transition flex items-center focus:outline-none p-1 rounded-md hover:bg-gray-800">
            <svg class="w-4 h-4 copy-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <svg class="w-4 h-4 check-icon hidden text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        <pre id="${uniqueId}" class="p-4 text-gray-300 overflow-x-auto leading-relaxed select-all font-mono text-[12px] bg-gray-950">${unifiedFixScriptText.trim()}</pre>
      </div>
    `;

    const pasted = this.state.pastedConfigRaw;
    const hasDiff = result.correctedConfig && result.correctedConfig.trim().length > 0 &&
                    pasted && pasted.trim().length > 0 &&
                    result.correctedConfig.trim() !== pasted.trim();
    const hasCorrectedConfig = result.correctedConfig && result.correctedConfig.trim().length > 0;

    let actionButtonsHtml = '';
    if (hasDiff || hasCorrectedConfig) {
      actionButtonsHtml = `
        <div class="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-750 select-none w-full">
          ${hasDiff ? `
          <button id="btn-orch-show-diff" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:border-purple-400/50">
            <span>🔍</span> Diff
          </button>
          ` : ''}
          ${hasCorrectedConfig ? `
          <button id="btn-orch-download-rsc" class="px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-all bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50">
            <span>💾</span> <span class="rsc-btn-label">.rsc</span>
          </button>
          ` : ''}
          ${hasCorrectedConfig ? `
          <button class="btn-action bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs hover:bg-blue-600/30" data-action="send-to-build">🛠️ Send to Builder</button>
          ` : ''}
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="flex items-center space-x-2 text-[10px] text-gray-500 font-semibold select-none">
        <span class="text-purple-400 font-bold">🧠 Multi-Agent Orchestrator</span>
        <span>•</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="chat-bubble-assistant text-xs text-gray-300 bg-gray-800 border border-gray-700 p-5 rounded-2xl leading-relaxed shadow-xl max-w-full w-full flex flex-col">
        <!-- Executive Summary -->
        <div class="bg-purple-950/20 border border-purple-500/20 rounded-xl p-4 w-full mb-4">
          <h3 class="text-sm font-bold text-purple-400 mb-2 flex items-center gap-1.5 select-none">
            <span>🧠</span> Orchestrator Summary
          </h3>
          <div class="text-xs leading-relaxed text-gray-300 select-text">${execSummaryHtml}</div>
        </div>

        <!-- Agent Cards Grid -->
        ${agentCardsHtml}

        <!-- Unified Fix Script -->
        ${unifiedScriptHtml}

        <!-- Bottom action buttons -->
        ${actionButtonsHtml}
      </div>
    `;

    // Modal triggers
    const btnDiff = wrapper.querySelector('#btn-orch-show-diff');
    if (btnDiff) {
      btnDiff.addEventListener('click', () => {
        this.renderDiff(result.maskedOriginalConfig || pasted || '', result.maskedCorrectedConfig || result.correctedConfig || '');
        this.els.modalDiff.classList.remove('hidden');
      });
    }
    const btnDownloadRsc = wrapper.querySelector('#btn-orch-download-rsc');
    if (btnDownloadRsc) {
      btnDownloadRsc.addEventListener('click', () => {
        this.downloadAsRscFile(result.correctedConfig || '');
      });
    }

    const btnOrchSendToBuild = wrapper.querySelector('[data-action="send-to-build"]');
    if (btnOrchSendToBuild) {
      btnOrchSendToBuild.addEventListener('click', () => {
        AppState.setCurrentTab('build');
        Router.renderCurrentTab();
        Router.updateActiveTab('build');

        setTimeout(() => {
          if (BuildTab && BuildTab.receiveFromAudit) {
            BuildTab.receiveFromAudit(result.correctedConfig);
          }
        }, 100);
      });
    }

    container.appendChild(wrapper);
    this.scrollStreamToBottom();
  },

  // Renders Firewall Shadow Detector outcomes
  renderShadowDetectorResults(data) {
    const container = this.els.chatMessagesContainer;
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col space-y-2.5 items-start max-w-3xl mr-auto w-full select-text animate-apple-reveal';

    let explanationHtml = '';
    if (typeof window.renderMarkdown === 'function') {
      explanationHtml = window.renderMarkdown(data.explanation || 'No explanations found.');
    } else {
      explanationHtml = data.explanation || 'No explanations found.';
    }

    const shadowRules = data.shadowRules || [];
    let cardsHtml = '';

    if (shadowRules.length === 0) {
      cardsHtml = `
        <div class="mt-4 p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 text-emerald-200 w-full flex items-center space-x-3 shadow-emerald-glow select-none">
          <span class="text-xl">🛡️</span>
          <div>
            <h4 class="font-bold text-xs uppercase tracking-wide text-emerald-400">Perfect Rule Sequencing Detected</h4>
            <p class="text-[11px] leading-relaxed font-medium mt-1">Excellent! No shadowed or redundant firewall filter or NAT rules were detected. Your traffic ordering is secure and clean.</p>
          </div>
        </div>
      `;
    } else {
      cardsHtml = '<div class="space-y-3.5 w-full mt-4">';
      shadowRules.forEach((rule, idx) => {
        cardsHtml += `
          <div class="p-4 rounded-xl border border-gray-700 bg-gray-900 flex flex-col space-y-3 shadow-lg select-text">
            <div class="flex items-center justify-between pb-2 border-b border-gray-800 select-none">
              <span class="px-2 py-0.5 text-[9px] bg-red-500/15 text-red-400 font-extrabold uppercase rounded-full">Shadowed Rule #${idx + 1}</span>
              <span class="text-[10px] text-gray-500 font-bold">Rule Sequence Conflict</span>
            </div>

            <div class="space-y-2">
              <div class="flex flex-col space-y-1">
                <span class="text-[10px] uppercase font-black tracking-wider text-red-400 select-none">🔴 The Shadowed Rule (Will never be hit)</span>
                <div class="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 text-red-300 font-mono text-[11px] leading-normal break-all select-all">
                  ${rule.shadowedRule}
                </div>
              </div>

              <div class="flex flex-col space-y-1">
                <span class="text-[10px] uppercase font-black tracking-wider text-amber-400 select-none">🟡 Rule Causing the Shadow (Precedes & blocks)</span>
                <div class="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300 font-mono text-[11px] leading-normal break-all select-all">
                  ${rule.causingRule}
                </div>
              </div>

              <div class="flex flex-col space-y-1 pt-1">
                <span class="text-[10px] uppercase font-black tracking-wider text-purple-400 select-none">🟢 Recommended Rule Alignment</span>
                <div class="p-2.5 rounded-lg bg-purple-950/20 border border-purple-500/20 text-purple-200 font-bold text-xs leading-relaxed select-all">
                  ${rule.fix}
                </div>
              </div>
            </div>
          </div>
        `;
      });
      cardsHtml += '</div>';
    }

    wrapper.innerHTML = `
      <div class="flex items-center space-x-2 text-[10px] text-gray-500 font-semibold select-none">
        <span class="text-purple-400">🧙‍♂️ Mik the Winbox Wizard</span>
        <span>•</span>
        <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="chat-bubble-assistant text-xs text-gray-300 bg-gray-800 border border-gray-700 p-5 rounded-2xl leading-relaxed shadow-xl max-w-full w-full">
        <div class="mb-4 pb-3 border-b border-gray-700/50 flex items-center space-x-2 select-none">
          <span class="text-lg">🛡️</span>
          <h3 class="text-xs font-black uppercase tracking-wider text-purple-400">Firewall Shadow Detector Analysis</h3>
        </div>
        <div class="prose prose-invert max-w-none">${explanationHtml}</div>
        ${cardsHtml}
      </div>
    `;

    container.appendChild(wrapper);
    this.scrollStreamToBottom();
  },

  // Parses AI tag blocks
  parseAIResponse(rawText) {
    if (!rawText) return { explanation: '', fixCommands: '', correctedConfig: '' };
    let text = rawText.replace(/\\n/g, '\n');

    const fixRegex = /<<+FIX_COMMANDS>>+([\s\S]*?)<<+END_FIX_COMMANDS>>+/i;
    const configRegex = /<<+CORRECTED_CONFIG>>+([\s\S]*?)<<+END_CORRECTED_CONFIG>>+/i;
    const explanationRegex = /<<+EXPLANATION>>+([\s\S]*?)<<+END_EXPLANATION>>+/i;

    let fixCommands = '';
    let correctedConfig = '';
    let explanation = '';

    const fixMatch = fixRegex.exec(text);
    if (fixMatch) fixCommands = fixMatch[1].trim();

    const configMatch = configRegex.exec(text);
    if (configMatch) correctedConfig = configMatch[1].trim();

    const explanationMatch = explanationRegex.exec(text);
    if (explanationMatch) {
      explanation = explanationMatch[1].trim();
    } else {
      explanation = text;
    }

    explanation = explanation
      .replace(fixRegex, '')
      .replace(configRegex, '')
      .replace(explanationRegex, '')
      .replace(/<<+EXPLANATION>>+/gi, '')
      .replace(/<<+END_EXPLANATION>>+/gi, '')
      .replace(/<<+CORRECTED_CONFIG>>+/gi, '')
      .replace(/<<+END_CORRECTED_CONFIG>>+/gi, '')
      .replace(/<<+FIX_COMMANDS>>+/gi, '')
      .replace(/<<+END_FIX_COMMANDS>>+/gi, '')
      .trim();

    return { explanation, fixCommands, correctedConfig };
  },

  // Scroll utilities
  scrollStreamToBottom() {
    if (this.els.chatMessagesStream) {
      this.els.chatMessagesStream.scrollTop = this.els.chatMessagesStream.scrollHeight;
    }
  },

  // Global snippet copy handler
  copySnippetText(id, btn) {
    const pre = document.getElementById(id);
    if (!pre) return;

    navigator.clipboard.writeText(pre.innerText).then(() => {
      const copyIcon = btn.querySelector('.copy-icon');
      const checkIcon = btn.querySelector('.check-icon');

      if (copyIcon && checkIcon) {
        copyIcon.classList.add('hidden');
        checkIcon.classList.remove('hidden');
        this.showToast('Snippet copied successfully!', 'success');
        setTimeout(() => {
          copyIcon.classList.remove('hidden');
          checkIcon.classList.add('hidden');
        }, 2000);
      }
    });
  },

  // RSC download wrapper
  downloadAsRscFile(correctedConfig) {
    if (!correctedConfig || correctedConfig.trim().length === 0) {
      this.showToast('Cannot export an empty configuration!', 'error');
      return;
    }

    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const now = new Date();
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const rosVersion = this.els.selectRosVersion.value !== 'auto' ? this.els.selectRosVersion.value : 'v7';
    const model = this.els.selectHardware.value !== 'auto' ? this.els.selectHardware.value : 'MikroTik Router';

    let header = `# ${month}/${day}/${year} ${hours}:${minutes}:${seconds} by RouterOS ${rosVersion}\n`;
    header += `#\n`;
    header += `# model = ${model}\n`;
    header += `# generated by Mik the Winbox Wizard\n\n`;

    let cleanConfig = correctedConfig.trim();
    const headerRegex = /^#\s+[a-z]{3}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2}\s+by\s+RouterOS[\s\S]*?\n\n/i;
    if (headerRegex.test(cleanConfig)) {
      cleanConfig = cleanConfig.replace(headerRegex, '');
    }

    const fileContent = header + cleanConfig;
    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;

    const sanitizedModel = model.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    a.download = `mik_${sanitizedModel}_config.rsc`;

    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);

    this.showToast('RSC file downloaded successfully!', 'success');
  },

  // Renders visual side-by-side or unified diff comparison
  renderDiff(originalText, correctedText) {
    const tbody = this.els.diffTableBody;
    if (!tbody) return;
    tbody.innerHTML = '';

    const mode = this.state.diffMode;

    if (typeof Diff === 'undefined') {
      tbody.innerHTML = `<tr><td class="p-4 text-red-400">Error: Diff library is not loaded.</td></tr>`;
      return;
    }

    const changes = Diff.diffLines(originalText || '', correctedText || '');
    const lines = [];
    changes.forEach(change => {
      const changeLines = change.value.split('\n');
      if (changeLines[changeLines.length - 1] === '') {
        changeLines.pop();
      }
      changeLines.forEach(line => {
        lines.push({
          text: line,
          added: change.added || false,
          removed: change.removed || false
        });
      });
    });

    if (mode === 'split') {
      this.els.diffSplitHeaders.classList.remove('hidden');
      this.els.diffUnifiedHeader.classList.add('hidden');

      const leftSide = [];
      const rightSide = [];

      let idx = 0;
      while (idx < lines.length) {
        const current = lines[idx];
        if (!current.added && !current.removed) {
          leftSide.push({ text: current.text, type: 'equal' });
          rightSide.push({ text: current.text, type: 'equal' });
          idx++;
        } else {
          const removals = [];
          const additions = [];
          while (idx < lines.length && (lines[idx].removed || lines[idx].added)) {
            if (lines[idx].removed) {
              removals.push(lines[idx].text);
            } else {
              additions.push(lines[idx].text);
            }
            idx++;
          }
          const maxLen = Math.max(removals.length, additions.length);
          for (let i = 0; i < maxLen; i++) {
            leftSide.push(removals[i] !== undefined ? { text: removals[i], type: 'delete' } : null);
            rightSide.push(additions[i] !== undefined ? { text: additions[i], type: 'insert' } : null);
          }
        }
      }

      for (let i = 0; i < leftSide.length; i++) {
        const left = leftSide[i];
        const right = rightSide[i];

        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-900/60 hover:bg-gray-900/40 text-gray-300';

        const tdLeft = document.createElement('td');
        tdLeft.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs border-r border-gray-900';

        const tdRight = document.createElement('td');
        tdRight.className = 'w-1/2 p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';

        if (left && right && left.type === 'equal') {
          tdLeft.textContent = left.text;
          tdRight.textContent = right.text;
          tdLeft.className += ' text-gray-500';
          tdRight.className += ' text-gray-500';
        } else {
          if (left) {
            tdLeft.className += ' bg-red-950/20 text-red-400 font-medium';
            tdLeft.textContent = left.text;
          } else {
            tdLeft.textContent = '';
          }

          if (right) {
            tdRight.className += ' bg-emerald-950/20 text-emerald-400 font-medium';
            tdRight.textContent = right.text;
          } else {
            tdRight.textContent = '';
          }
        }

        tr.appendChild(tdLeft);
        tr.appendChild(tdRight);
        tbody.appendChild(tr);
      }
    } else {
      // Unified mode
      this.els.diffSplitHeaders.classList.add('hidden');
      this.els.diffUnifiedHeader.classList.remove('hidden');

      lines.forEach((line) => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-gray-900 hover:bg-gray-900/40';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';

        if (!line.added && !line.removed) {
          tr.className += ' text-gray-500';
          td.textContent = `  ${line.text}`;
        } else if (line.removed) {
          td.className += ' bg-red-950/20 text-red-400 font-medium';
          td.textContent = `- ${line.text}`;
        } else if (line.added) {
          td.className += ' bg-emerald-950/20 text-emerald-400 font-medium';
          td.textContent = `+ ${line.text}`;
        }

        tr.appendChild(td);
        tbody.appendChild(tr);
      });
    }
  },

  // Switch visual comparison diff styles
  switchDiffMode(mode) {
    this.state.diffMode = mode;
    this.els.diffViewModeSplit.className = 'px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition';
    this.els.diffViewModeUnified.className = 'px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition';

    if (mode === 'split') {
      this.els.diffViewModeSplit.className = 'px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-purple-400 border border-purple-500/30 transition';
    } else {
      this.els.diffViewModeUnified.className = 'px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-purple-400 border border-purple-500/30 transition';
    }

    // Trigger re-render of diff
    const activeChat = this.state.history.find(h => h.id === this.state.currentChatId);
    if (activeChat && activeChat.messages && activeChat.messages.length > 0) {
      const lastMsg = activeChat.messages[activeChat.messages.length - 1];
      if (lastMsg && lastMsg.result) {
        this.renderDiff(
          lastMsg.result.maskedOriginalConfig || this.state.pastedConfigRaw || '',
          lastMsg.result.maskedCorrectedConfig || lastMsg.result.correctedConfig || ''
        );
      }
    }
  },

  // Renders interactive delta command checklist modal
  renderChecklistCommands(fixCommands) {
    const t = this.getT();
    if (this.els.commandsBlock) {
      this.els.commandsBlock.textContent = fixCommands || t.commandsRawNoNeed;
    }

    const container = this.els.commandsChecklistContainer;
    if (!container) return;
    container.innerHTML = '';

    const lines = fixCommands ? fixCommands.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !l.startsWith('#')) : [];

    if (lines.length === 0) {
      container.innerHTML = t.commandsChecklistEmpty;
      return;
    }

    lines.forEach(line => {
      const item = document.createElement('div');
      item.className = 'p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between space-x-3 hover:border-gray-700 transition duration-200';

      const left = document.createElement('div');
      left.className = 'flex items-start space-x-3 select-none flex-1 overflow-hidden';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'mt-1 h-4 w-4 rounded shrink-0 cursor-pointer accent-purple-500';

      const text = document.createElement('code');
      text.className = 'text-xs text-gray-200 font-mono select-text break-all leading-normal';
      text.textContent = line;

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          text.className += ' line-through opacity-40';
          item.className = 'p-3 bg-gray-950/40 border border-gray-900 rounded-xl flex items-center justify-between space-x-3 opacity-60 transition';
        } else {
          text.className = 'text-xs text-gray-200 font-mono select-text break-all leading-normal';
          item.className = 'p-3 bg-gray-900 border border-gray-800 rounded-xl flex items-center justify-between space-x-3 hover:border-gray-700 transition';
        }
      });

      left.appendChild(checkbox);
      left.appendChild(text);

      const btnCopy = document.createElement('button');
      btnCopy.className = 'text-[10px] bg-gray-800 border border-gray-750 hover:bg-gray-750 text-gray-300 font-bold px-2.5 py-1 rounded-lg shrink-0 transition active:scale-95';
      btnCopy.textContent = t.copyLabel;

      btnCopy.addEventListener('click', () => {
        navigator.clipboard.writeText(line).then(() => {
          btnCopy.textContent = t.copiedText;
          btnCopy.className = 'text-[10px] bg-emerald-950 border border-emerald-500 text-emerald-400 font-bold px-2.5 py-1 rounded-lg shrink-0 transition';
          this.showToast('Command copied!', 'success');
          setTimeout(() => {
            btnCopy.textContent = t.copyLabel;
            btnCopy.className = 'text-[10px] bg-gray-800 border border-gray-750 hover:bg-gray-750 text-gray-300 font-bold px-2.5 py-1 rounded-lg shrink-0';
          }, 1500);
        });
      });

      item.appendChild(left);
      item.appendChild(btnCopy);
      container.appendChild(item);
    });
  },

  // Toggle checklist modes
  switchCommandMode(mode) {
    this.state.commandMode = mode;
    this.els.commandViewModeChecklist.className = 'px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition';
    this.els.commandViewModeRaw.className = 'px-3 py-1.5 text-xs font-bold rounded text-slate-400 hover:text-white transition';

    if (mode === 'checklist') {
      this.els.commandViewModeChecklist.className = 'px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-emerald-400 border border-emerald-500/30 transition';
      this.els.commandsChecklistContainer.classList.remove('hidden');
      this.els.commandsRawContainer.classList.add('hidden');
    } else {
      this.els.commandViewModeRaw.className = 'px-3 py-1.5 text-xs font-bold rounded bg-slate-700 text-emerald-400 border border-emerald-500/30 transition';
      this.els.commandsChecklistContainer.classList.add('hidden');
      this.els.commandsRawContainer.classList.remove('hidden');
    }
  },

  // Launches an interactive full screen overlay map of VLAN layout
  openInteractiveMapModal(parsedVlan) {
    if (!parsedVlan || parsedVlan.length === 0) {
      alert('No topology graph available');
      return;
    }

    if (typeof window.generateVlanMermaidGraph !== 'function') return;
    const graphCode = window.generateVlanMermaidGraph(parsedVlan);

    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 backdrop-blur-sm select-none';
    modal.id = 'topology-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-gray-900 border border-gray-800 rounded-2xl p-8 w-[90vw] h-[85vh] flex flex-col overflow-hidden relative shadow-2xl';

    const header = document.createElement('div');
    header.className = 'flex items-center justify-between mb-6 shrink-0';
    header.innerHTML = `
      <h3 class="text-xl font-bold text-white uppercase tracking-wider">VLAN Topology - Interactive Map</h3>
      <button class="text-gray-400 hover:text-white text-3xl font-bold transition focus:outline-none" id="close-modal-topology">×</button>
    `;

    modalContent.appendChild(header);

    const mermaidDiv = document.createElement('div');
    mermaidDiv.className = 'mermaid';
    mermaidDiv.textContent = graphCode;

    const targetWrapper = document.createElement('div');
    targetWrapper.className = 'flex-1 w-full relative';
    targetWrapper.appendChild(mermaidDiv);
    modalContent.appendChild(targetWrapper);

    modal.appendChild(modalContent);

    // ESC close binding
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', onEsc);
      }
    };
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        document.removeEventListener('keydown', onEsc);
      }
    });
    document.addEventListener('keydown', onEsc);

    document.body.appendChild(modal);

    document.getElementById('close-modal-topology').addEventListener('click', () => {
      modal.remove();
      document.removeEventListener('keydown', onEsc);
    });

    // Re-render Mermaid in fullscreen with tall dimension (600px+)
    setTimeout(() => {
      if (typeof window.renderMermaidGraphs === 'function') {
        window.renderMermaidGraphs(targetWrapper);
        const container = targetWrapper.querySelector('.mermaid-container');
        if (container) {
          container.style.height = '100%';
          container.style.border = 'none';
          container.style.backgroundColor = 'transparent';
        }
      }
    }, 50);
  }
};
