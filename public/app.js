// Main frontend JS for MikroTik Privacy AI Chatbot Assistant

// Professional UI Localization Dictionary
const i18n = {
  en: {
    pasteConfig: 'Paste RouterOS Configuration or Log File',
    clear: 'Clear',
    chatMessage: 'Ask the Assistant / Describe the problem',
    submit: 'Analyze & Fix',
    submitting: 'Analyzing...',
    welcomeTitle: 'Your Auditing Assistant is Ready',
    welcomeDesc: 'Configure your preferred LLM provider in settings, paste your RouterOS /export, log files, or explain your problem, and click "Analyze & Fix".',
    welcomePrivacy: '🛡️ Fully Privacy Guarded: Passwords, IPs, MACs, custom interface names, and identities never leave this machine.',
    diffOriginal: 'Original Config (Redacted Display)',
    diffCorrected: 'Corrected Config (Fully Restored)',
    commandsTip: 'These are RouterOS terminal commands. Paste them directly into your MikroTik CLI window to apply the fix.',
    commandsPlaceholder: '# Commands will appear here after analysis...',
    commandsNoNeed: '# No specific terminal commands needed for this fix.',
    copied: 'Copied!',
    copyText: 'Copy Content',
    settingsLabel: 'Settings',
    placeholderPastedConfig: '# Paste your RouterOS /export config, logs or console errors here...\n# (All IP/MAC addresses, secrets, custom interfaces and identities will be stripped locally before sending to AI, and restored on response!)',
    placeholderChatMessage: "Explain what is broken (e.g., 'My port forwarding is not working' or 'Why cannot I ping internal hosts?')"
  },
  it: {
    pasteConfig: 'Incolla la Configurazione o i Log di RouterOS',
    clear: 'Cancella',
    chatMessage: 'Chiedi all\'Assistente / Descrivi il problema',
    submit: 'Analizza e Correggi',
    submitting: 'Analisi in corso...',
    welcomeTitle: 'Il tuo Assistente per l\'Audit è Pronto',
    welcomeDesc: 'Configura il tuo provider LLM preferito nelle impostazioni, incolla il tuo /export di RouterOS, i file di log o spiega il tuo problema e fai clic su "Analizza e Correggi".',
    welcomePrivacy: '🛡️ Massima Privacy Garantita: password, IP, MAC, nomi di interfacce personalizzate e identità non lasciano mai questa macchina.',
    diffOriginal: 'Config. Originale (Visualizzazione Oscurata)',
    diffCorrected: 'Config. Corretta (Completamente Ripristinata)',
    commandsTip: 'Questi sono comandi del terminale RouterOS. Incollali direttamente nella finestra CLI di MikroTik per applicare la correzione.',
    commandsPlaceholder: '# I comandi appariranno qui dopo l\'analisi...',
    commandsNoNeed: '# Nessun comando specifico del terminale è necessario per questa correzione.',
    copied: 'Copiato!',
    copyText: 'Copia Contenuto',
    settingsLabel: 'Impostazioni',
    placeholderPastedConfig: '# Incolla qui la configurazione /export di RouterOS, i log o gli errori della console...\n# (Tutti gli indirizzi IP/MAC, i segreti, le interfacce personalizzate e le identità saranno rimossi localmente prima dell\'invio all\'IA e ripristinati nella risposta!)',
    placeholderChatMessage: "Spiega cosa non funziona (ad es., 'Il mio port forwarding non funziona' o 'Perché non riesco a pingare gli host interni?')"
  }
};

// State Management
const state = {
  activeTab: 'explanation', // 'explanation' | 'diff' | 'commands'
  language: 'auto', // 'auto' | 'en' | 'it'
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
  pastedConfigRaw: ''
};

// UI Elements
const els = {
  pastedConfig: document.getElementById('pasted-config'),
  chatMessage: document.getElementById('chat-message'),
  btnSubmit: document.getElementById('btn-submit'),
  loadingSpinner: document.getElementById('loading-spinner'),

  // Tabs
  tabExplanation: document.getElementById('tab-explanation'),
  tabDiff: document.getElementById('tab-diff'),
  tabCommands: document.getElementById('tab-commands'),

  // Tab Content Panels
  panelWelcome: document.getElementById('panel-welcome'),
  contentExplanation: document.getElementById('content-explanation'),
  contentDiff: document.getElementById('content-diff'),
  contentCommands: document.getElementById('content-commands'),
  diffTableBody: document.getElementById('diff-table-body'),
  commandsBlock: document.getElementById('commands-block'),

  // Actions
  btnCopyTab: document.getElementById('btn-copy-tab'),
  btnCopyText: document.getElementById('btn-copy-text'),
  btnClearAll: document.getElementById('btn-clear-all'),
  btnQuickFirewall: document.getElementById('btn-quick-firewall'),
  btnQuickRouting: document.getElementById('btn-quick-routing'),

  // Settings Modal
  btnSettings: document.getElementById('btn-settings'),
  modalSettings: document.getElementById('modal-settings'),
  btnCloseSettings: document.getElementById('btn-close-settings'),
  btnSaveSettings: document.getElementById('btn-save-settings'),
  btnTestConnection: document.getElementById('btn-test-connection'),
  testSpinner: document.getElementById('test-spinner'),
  testResult: document.getElementById('test-result'),

  // Settings Fields
  settingProvider: document.getElementById('setting-provider'),
  settingModel: document.getElementById('setting-model'),
  settingApiKey: document.getElementById('setting-apikey'),
  settingBaseurl: document.getElementById('setting-baseurl'),
  settingPrompt: document.getElementById('setting-prompt'),
  settingLanguage: document.getElementById('setting-language'),

  // Translatable Elements
  uiLabelPasteConfig: document.getElementById('ui-label-paste-config'),
  uiLabelClear: document.getElementById('ui-label-clear'),
  uiLabelChatMessage: document.getElementById('ui-label-chat-message'),
  uiLabelSubmit: document.getElementById('ui-label-submit'),
  uiLabelWelcomeTitle: document.getElementById('ui-label-welcome-title'),
  uiLabelWelcomeDesc: document.getElementById('ui-label-welcome-desc'),
  uiLabelWelcomePrivacy: document.getElementById('ui-label-welcome-privacy'),
  uiLabelDiffOriginal: document.getElementById('ui-label-diff-original'),
  uiLabelDiffCorrected: document.getElementById('ui-label-diff-corrected'),
  uiLabelCommandsTip: document.getElementById('ui-label-commands-tip'),
  uiLabelSettings: document.getElementById('ui-label-settings'),

  // Settings Toggles
  maskIPs: document.getElementById('mask-ips'),
  maskMACs: document.getElementById('mask-macs'),
  maskSecrets: document.getElementById('mask-secrets'),
  maskInterfaces: document.getElementById('mask-interfaces'),
  maskDomains: document.getElementById('mask-domains'),
  maskIdentity: document.getElementById('mask-identity'),

  // Statuses
  llmStatus: document.getElementById('llm-status'),
  llmStatusDot: document.getElementById('llm-status-dot'),
  llmStatusText: document.getElementById('llm-status-text'),
  privacyCount: document.getElementById('privacy-count')
};

// Dynamic UI Translation / Localization Function
function updateUILanguage() {
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  if (els.uiLabelPasteConfig) els.uiLabelPasteConfig.childNodes[2].textContent = ` ${t.pasteConfig}`;
  if (els.uiLabelClear) els.uiLabelClear.textContent = t.clear;
  if (els.uiLabelChatMessage) els.uiLabelChatMessage.childNodes[2].textContent = ` ${t.chatMessage}`;
  if (els.uiLabelSubmit) els.uiLabelSubmit.textContent = t.submit;
  if (els.uiLabelWelcomeTitle) els.uiLabelWelcomeTitle.textContent = t.welcomeTitle;
  if (els.uiLabelWelcomeDesc) els.uiLabelWelcomeDesc.innerHTML = t.welcomeDesc.replace('"Analyze & Fix"', `<strong class="text-brand-400">"${t.submit}"</strong>`);
  if (els.uiLabelWelcomePrivacy) els.uiLabelWelcomePrivacy.textContent = t.welcomePrivacy;
  if (els.uiLabelDiffOriginal) els.uiLabelDiffOriginal.textContent = t.diffOriginal;
  if (els.uiLabelDiffCorrected) els.uiLabelDiffCorrected.textContent = t.diffCorrected;
  if (els.uiLabelCommandsTip) els.uiLabelCommandsTip.childNodes[2].textContent = ` ${t.commandsTip}`;
  if (els.uiLabelSettings) els.uiLabelSettings.textContent = t.settingsLabel;

  // Placeholder updates
  if (els.pastedConfig) els.pastedConfig.placeholder = t.placeholderPastedConfig;
  if (els.chatMessage) els.chatMessage.placeholder = t.placeholderChatMessage;

  // Copy button content
  if (els.btnCopyText) els.btnCopyText.textContent = t.copyText;

  // Commands empty state if not analyzed
  if (!state.analysisResult && els.commandsBlock) {
    els.commandsBlock.textContent = t.commandsPlaceholder;
  }
}

// Initial setup on DOM Load
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  setupEventListeners();
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
  updateUILanguage();
});

// Load Settings from LocalStorage
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
    // Sensible defaults based on provider
    updateModelDefaults(state.settings.provider);
  }

  // Load selected language if saved
  const savedLang = localStorage.getItem('mikrotik_chatbot_language');
  if (savedLang) {
    state.language = savedLang;
  }
  if (els.settingLanguage) {
    els.settingLanguage.value = state.language;
  }

  // Populate UI settings inputs
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

// Save Settings to LocalStorage
function saveSettings() {
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
}

// Update model field placeholder based on provider selection
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

// Event Listeners setup
function setupEventListeners() {
  // Settings modal toggle
  els.btnSettings.addEventListener('click', () => {
    loadSettings(); // re-sync with stored
    els.modalSettings.classList.remove('hidden');
    els.testResult.textContent = '';
  });

  els.btnCloseSettings.addEventListener('click', () => {
    els.modalSettings.classList.add('hidden');
  });

  els.modalSettings.addEventListener('click', (e) => {
    if (e.target === els.modalSettings) {
      els.modalSettings.classList.add('hidden');
    }
  });

  els.settingProvider.addEventListener('change', () => {
    updateModelDefaults(els.settingProvider.value);
  });

  els.btnSaveSettings.addEventListener('click', () => {
    saveSettings();
    els.modalSettings.classList.add('hidden');
  });

  // Toggles inside settings refresh counts instantly
  [els.maskIPs, els.maskMACs, els.maskSecrets, els.maskInterfaces, els.maskDomains, els.maskIdentity].forEach(el => {
    el.addEventListener('change', updatePrivacyShieldLabel);
  });

  // Connection testing
  els.btnTestConnection.addEventListener('click', testConnection);

  // Tabs navigation
  els.tabExplanation.addEventListener('click', () => switchTab('explanation'));
  els.tabDiff.addEventListener('click', () => switchTab('diff'));
  els.tabCommands.addEventListener('click', () => switchTab('commands'));

  // Quick Templates
  els.btnQuickFirewall.addEventListener('click', loadFirewallTemplate);
  els.btnQuickRouting.addEventListener('click', loadRoutingTemplate);
  els.btnClearAll.addEventListener('click', clearAll);

  // Copy Tab content
  els.btnCopyTab.addEventListener('click', copyActiveTabContent);

  // Core Submit
  els.btnSubmit.addEventListener('click', submitChat);

  // Language selection change
  if (els.settingLanguage) {
    els.settingLanguage.addEventListener('change', () => {
      state.language = els.settingLanguage.value;
      localStorage.setItem('mikrotik_chatbot_language', state.language);
      updateUILanguage();
    });
  }
}

// Update Privacy Shield status subtitle/counts
function updatePrivacyShieldLabel() {
  const activeToggles = [];
  if (els.maskIPs.checked) activeToggles.push('IPs');
  if (els.maskMACs.checked) activeToggles.push('MACs');
  if (els.maskSecrets.checked) activeToggles.push('Passwords');
  if (els.maskInterfaces.checked) activeToggles.push('Interfaces');
  if (els.maskDomains.checked) activeToggles.push('Domains');
  if (els.maskIdentity.checked) activeToggles.push('Identity');

  if (activeToggles.length === 0) {
    els.privacyCount.innerHTML = '🛡️ <span class="text-red-400">All masking disabled</span>';
  } else if (activeToggles.length === 6) {
    els.privacyCount.innerHTML = '🛡️ <strong>Extreme Privacy Guard</strong> (6/6 Toggles on)';
  } else {
    els.privacyCount.innerHTML = `🛡️ Masking active: ${activeToggles.join(', ')}`;
  }
}

// Update top badge with selected LLM name
function updateLLMStatusBadge() {
  const provName = {
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    openrouter: 'OpenRouter',
    ollama: 'Local Ollama',
    custom: 'Custom LLM'
  }[state.settings.provider] || 'LLM';

  if (state.settings.provider === 'openai' || state.settings.provider === 'openrouter' || state.settings.provider === 'anthropic') {
    if (state.settings.apiKey) {
      els.llmStatusDot.className = 'w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse';
      els.llmStatusText.textContent = `${provName} (${state.settings.model || 'Default'})`;
    } else {
      els.llmStatusDot.className = 'w-2.5 h-2.5 bg-amber-500 rounded-full';
      els.llmStatusText.textContent = `${provName} (Key Missing)`;
    }
  } else {
    // Local / LAN LLM
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-emerald-400 rounded-full';
    els.llmStatusText.textContent = `${provName} (${state.settings.model || 'Local'})`;
  }
}

// Test connection handler
async function testConnection() {
  els.btnTestConnection.disabled = true;
  els.testSpinner.classList.remove('hidden');
  els.testResult.textContent = 'Contacting LLM...';
  els.testResult.className = 'text-xs font-medium text-gray-400';

  const body = {
    provider: els.settingProvider.value,
    apiKey: els.settingApiKey.value,
    baseUrl: els.settingBaseurl.value,
    model: els.settingModel.value
  };

  try {
    const res = await fetch('/api/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (data.success) {
      els.testResult.textContent = '✅ Connection successful!';
      els.testResult.className = 'text-xs font-medium text-emerald-400';
    } else {
      els.testResult.textContent = `❌ Failed: ${data.error || 'Unknown response'}`;
      els.testResult.className = 'text-xs font-medium text-red-400';
    }
  } catch (err) {
    els.testResult.textContent = `❌ Network Error: ${err.message}`;
    els.testResult.className = 'text-xs font-medium text-red-400';
  } finally {
    els.btnTestConnection.disabled = false;
    els.testSpinner.classList.add('hidden');
  }
}

// Switching tab visuals & display
function switchTab(tabId) {
  state.activeTab = tabId;

  // Update button visuals
  [els.tabExplanation, els.tabDiff, els.tabCommands].forEach(tabBtn => {
    tabBtn.className = 'tab-btn px-4 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white transition';
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.className = 'tab-btn active px-4 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white transition';
  }

  // Update panels visibility
  els.panelWelcome.classList.add('hidden');
  els.contentExplanation.classList.add('hidden');
  els.contentDiff.classList.add('hidden');
  els.contentCommands.classList.add('hidden');

  if (state.analysisResult) {
    if (tabId === 'explanation') {
      els.contentExplanation.classList.remove('hidden');
    } else if (tabId === 'diff') {
      els.contentDiff.classList.remove('hidden');
    } else if (tabId === 'commands') {
      els.contentCommands.classList.remove('hidden');
    }
  } else {
    els.panelWelcome.classList.remove('hidden');
  }
}

// Copy content from active tab to clipboard
function copyActiveTabContent() {
  let textToCopy = '';
  if (!state.analysisResult) return;

  if (state.activeTab === 'explanation') {
    textToCopy = els.contentExplanation.innerText;
  } else if (state.activeTab === 'commands') {
    textToCopy = els.commandsBlock.innerText;
  } else if (state.activeTab === 'diff') {
    // Copy the corrected config side of the diff
    textToCopy = state.analysisResult.correctedConfig || '';
  }

  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      els.btnCopyText.textContent = t.copied;
      setTimeout(() => {
        els.btnCopyText.textContent = t.copyText;
      }, 2000);
    }).catch(err => {
      console.error('Clipboard copy failed', err);
    });
  }
}

// Clear input & output fields
function clearAll() {
  els.pastedConfig.value = '';
  els.chatMessage.value = '';
  state.analysisResult = null;
  state.pastedConfigRaw = '';
  els.diffTableBody.innerHTML = '';
  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;
  els.commandsBlock.textContent = t.commandsPlaceholder;
  els.contentExplanation.innerHTML = '';
  switchTab('explanation');
}

// Templates loading
function loadFirewallTemplate() {
  els.pastedConfig.value = `/ip firewall filter
add action=accept chain=input comment="defconf: accept established,related,untracked" connection-state=established,related,untracked
add action=drop chain=input comment="defconf: drop invalid" connection-state=invalid
add action=accept chain=input comment="defconf: accept ICMP" protocol=icmp
add action=drop chain=input comment="drop everything else"
add action=accept chain=forward comment="defconf: accept in ipsec policy" ipsec-policy=in,ipsec
add action=accept chain=forward comment="defconf: accept out ipsec policy" ipsec-policy=out,ipsec
add action=accept chain=forward comment="defconf: accept established,related,untracked" connection-state=established,related,untracked
add action=drop chain=forward comment="defconf: drop invalid" connection-state=invalid
# CUSTOM PORT FORWARD
/ip firewall nat
add action=masquerade chain=srcnat comment="defconf: masquerade" out-interface=ether1-wan
add action=dst-nat chain=dstnat dst-port=80 protocol=tcp to-addresses=192.168.88.220 to-ports=80`;

  els.chatMessage.value = "Why cannot users from the internet access my web server at 192.168.88.220? I added the dstnat rule for port 80, but it is not loading.";
  switchTab('explanation');
}

function loadRoutingTemplate() {
  els.pastedConfig.value = `/ip address
add address=192.168.1.10/24 interface=ether1-wan network=192.168.1.0
add address=192.168.88.1/24 interface=bridge-lan network=192.168.88.0

/ip route
add disabled=no distance=1 dst-address=0.0.0.0/0 gateway=192.168.88.254 vrf-interface=bridge-lan

/ip dns
set allow-remote-requests=yes servers=8.8.8.8`;

  els.chatMessage.value = "We have zero internet access on our office network. Clients cannot ping outside or resolve domain names. Here is our setup.";
  switchTab('explanation');
}

// Compute the dynamic line-by-line colored diff alignment (LCS + Post Grouping)
function computeLineDiff(originalText, correctedText) {
  const leftLines = originalText.split('\n');
  const rightLines = correctedText.split('\n');

  // DP memo table
  const dp = Array(leftLines.length + 1).fill(null).map(() => Array(rightLines.length + 1).fill(0));

  for (let i = 1; i <= leftLines.length; i++) {
    for (let j = 1; j <= rightLines.length; j++) {
      if (leftLines[i-1].trim() === rightLines[j-1].trim()) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }

  const diffResult = [];
  let i = leftLines.length;
  let j = rightLines.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && leftLines[i-1].trim() === rightLines[j-1].trim()) {
      diffResult.unshift({
        type: 'equal',
        left: leftLines[i-1],
        right: rightLines[j-1]
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      diffResult.unshift({
        type: 'insert',
        left: '',
        right: rightLines[j-1]
      });
      j--;
    } else {
      diffResult.unshift({
        type: 'delete',
        left: leftLines[i-1],
        right: ''
      });
      i--;
    }
  }

  // Post-grouping loop to combine adjacent deletions and insertions into 'modify' rows
  const aligned = [];
  for (let k = 0; k < diffResult.length; k++) {
    const current = diffResult[k];
    const last = aligned[aligned.length - 1];

    if (last && last.type === 'delete' && current.type === 'insert') {
      last.type = 'modify';
      last.right = current.right;
    } else {
      aligned.push({ ...current });
    }
  }

  return aligned;
}

// Render computed diff inside side-by-side tables
function renderDiff(originalText, correctedText) {
  const alignedLines = computeLineDiff(originalText, correctedText);
  const tbody = els.diffTableBody;
  tbody.innerHTML = '';

  alignedLines.forEach((row, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-900 hover:bg-gray-900/20 text-gray-300';

    const tdLeft = document.createElement('td');
    tdLeft.className = 'w-1/2 p-2 align-top whitespace-pre-wrap border-r border-gray-900 break-all';

    const tdRight = document.createElement('td');
    tdRight.className = 'w-1/2 p-2 align-top whitespace-pre-wrap break-all';

    // Apply color highlights based on modification types
    if (row.type === 'equal') {
      tdLeft.textContent = row.left;
      tdRight.textContent = row.right;
    } else if (row.type === 'delete') {
      tdLeft.className += ' diff-deleted text-red-400 font-medium';
      tdLeft.textContent = row.left;
      tdRight.className += ' bg-gray-950/60';
      tdRight.textContent = '';
    } else if (row.type === 'insert') {
      tdLeft.className += ' bg-gray-950/60';
      tdLeft.textContent = '';
      tdRight.className += ' diff-inserted text-emerald-400 font-medium';
      tdRight.textContent = row.right;
    } else if (row.type === 'modify') {
      tdLeft.className += ' diff-modified-left text-amber-500';
      tdLeft.textContent = row.left;
      tdRight.className += ' diff-modified-right text-emerald-400 font-medium';
      tdRight.textContent = row.right;
    }

    tr.appendChild(tdLeft);
    tr.appendChild(tdRight);
    tbody.appendChild(tr);
  });
}

// Simple Markdown renderer helper for clean display in explanation tab
function renderMarkdown(text) {
  if (!text) return '';
  let html = text;

  // Escape HTML tags to prevent injections but keep paragraphs
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Restore the safe markers so they are not broken if rendered
  html = html
    .replace(/&lt;&lt;&lt;EXPLANATION&gt;&gt;&gt;/g, '')
    .replace(/&lt;&lt;&lt;END_EXPLANATION&gt;&gt;&gt;/g, '');

  // Bullet lists
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<li class="ml-4 list-disc text-gray-300">$1</li>');
  html = html.replace(/(<li.*<\/li>)/gs, '<ul class="my-2 space-y-1">$1</ul>');

  // Headers (###, ##, #)
  html = html.replace(/^### (.*$)/gim, '<h5 class="text-sm font-bold text-white mt-4 mb-2 uppercase tracking-wide">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="text-base font-bold text-white mt-5 mb-2 border-b border-gray-800 pb-1">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="text-lg font-bold text-brand-400 mt-6 mb-3">$1</h3>');

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // Inline code (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-gray-950 text-brand-300 font-mono text-xs px-1.5 py-0.5 rounded border border-gray-800">$1</code>');

  // Code blocks (```lang ... ```)
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, '<pre class="bg-gray-950 text-gray-300 font-mono text-xs p-3.5 rounded-xl border border-gray-800 my-3 overflow-x-auto select-all">$1</pre>');

  // Newlines to paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<u') || p.trim().startsWith('<pre')) {
      return p;
    }
    return `<p class="mb-3 text-gray-300 leading-relaxed">${p}</p>`;
  }).join('');

  return html;
}

// Submit pasted config & message to server
async function submitChat() {
  const pastedVal = els.pastedConfig.value.trim();
  const chatVal = els.chatMessage.value.trim();

  const currentLang = state.language === 'auto' ? 'en' : state.language;
  const t = i18n[currentLang] || i18n.en;

  if (!pastedVal && !chatVal) {
    if (state.language === 'it') {
      alert('Incolla la configurazione/i log di RouterOS o inserisci una domanda!');
    } else {
      alert('Please paste some RouterOS logs/configs or enter a question!');
    }
    return;
  }

  // Set visual loading state
  els.btnSubmit.disabled = true;
  if (els.uiLabelSubmit) els.uiLabelSubmit.textContent = t.submitting;
  els.loadingSpinner.classList.remove('hidden');

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
    maskOptions
  };

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || `Server returned ${res.status}`);
    }

    const data = await res.json();

    // Store result
    state.analysisResult = data;
    state.pastedConfigRaw = pastedVal;

    // 1. Populate Explanation (Markdown style)
    els.contentExplanation.innerHTML = renderMarkdown(data.explanation || 'No explanation provided.');

    // 2. Populate and compute Diff View
    const originalDisplay = pastedVal || '(No configuration pasted)';
    const correctedDisplay = data.correctedConfig || '(No corrections needed)';
    renderDiff(originalDisplay, correctedDisplay);

    // 3. Populate CLI terminal commands
    els.commandsBlock.textContent = data.fixCommands || t.commandsNoNeed;

    // Switch to Explanation view
    switchTab('explanation');

  } catch (err) {
    console.error('Submission failed', err);
    if (state.language === 'it') {
      alert(`Errore: ${err.message}\n\nVerifica la configurazione del provider LLM e le chiavi nelle Impostazioni.`);
    } else {
      alert(`Error: ${err.message}\n\nPlease check your LLM configuration and keys in Settings.`);
    }
  } finally {
    els.btnSubmit.disabled = false;
    if (els.uiLabelSubmit) els.uiLabelSubmit.textContent = t.submit;
    els.loadingSpinner.classList.add('hidden');
  }
}
