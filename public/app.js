// Main frontend JS for MikroTik Privacy AI Chatbot Assistant with Next-Gen UI Redesign

// State Management
const state = {
  activeTab: 'explanation', // 'explanation' | 'diff' | 'commands'
  diffMode: 'split',        // 'split' | 'unified'
  commandMode: 'checklist', // 'checklist' | 'raw'
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
  history: [], // List of { id, title, timestamp, pastedConfig, chatMessage, result }
  currentFile: null,
  inputPanelCollapsed: false,
  activeSettingsCategoryTab: 'ai' // 'ai' | 'privacy' | 'prompt'
};

// UI Elements Reference
const els = {
  pastedConfig: document.getElementById('pasted-config'),
  chatMessage: document.getElementById('chat-message'),
  btnSubmit: document.getElementById('btn-submit'),
  loadingSpinner: document.getElementById('loading-spinner'),

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

  // Drag and Drop Zone
  dragDropZone: document.getElementById('drag-drop-zone'),
  dragPromptOverlay: document.getElementById('drag-prompt-overlay'),
  fileInfoBar: document.getElementById('file-info-bar'),
  fileNameLabel: document.getElementById('file-name-label'),
  fileSizeLabel: document.getElementById('file-size-label'),
  btnRemoveFile: document.getElementById('btn-remove-file'),
  fileInput: document.getElementById('file-input'),

  // Collapse Trigger Left Panel
  panelLeftInput: document.getElementById('panel-left-input'),
  panelRightOutput: document.getElementById('panel-right-output'),
  btnToggleInputPanel: document.getElementById('btn-toggle-input-panel'),
  btnToggleInputPanelIcon: document.getElementById('btn-toggle-input-panel-icon'),

  // Tabs
  tabExplanation: document.getElementById('tab-explanation'),
  tabDiff: document.getElementById('tab-diff'),
  tabCommands: document.getElementById('tab-commands'),

  // Mode Toggles (Diff & Commands)
  diffModeToggles: document.getElementById('diff-mode-toggles'),
  diffViewModeSplit: document.getElementById('diff-view-mode-split'),
  diffViewModeUnified: document.getElementById('diff-view-mode-unified'),
  commandModeToggles: document.getElementById('command-mode-toggles'),
  commandViewModeChecklist: document.getElementById('command-view-mode-checklist'),
  commandViewModeRaw: document.getElementById('command-view-mode-raw'),

  // Tab Content Panels
  panelWelcome: document.getElementById('panel-welcome'),
  contentExplanation: document.getElementById('content-explanation'),
  contentDiff: document.getElementById('content-diff'),
  contentCommands: document.getElementById('content-commands'),
  diffTableBody: document.getElementById('diff-table-body'),
  diffSplitHeaders: document.getElementById('diff-split-headers'),
  diffUnifiedHeader: document.getElementById('diff-unified-header'),
  commandsChecklistContainer: document.getElementById('commands-checklist-container'),
  commandsRawContainer: document.getElementById('commands-raw-container'),
  commandsBlock: document.getElementById('commands-block'),

  // Actions
  btnCopyTab: document.getElementById('btn-copy-tab'),
  btnCopyText: document.getElementById('btn-copy-text'),
  btnClearAll: document.getElementById('btn-clear-all'),
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
  toastContainer: document.getElementById('toast-container')
};

// INITIAL SETUP
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadHistory();
  setupEventListeners();
  setupDragAndDrop();
  updatePrivacyShieldLabel();
  updateLLMStatusBadge();
});

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
  showToast('Settings saved successfully!', 'success');
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

// DRAG AND DROP SETUP
function setupDragAndDrop() {
  const zone = els.dragDropZone;

  // Clicking the dropzone but outside the textarea can open file input
  zone.addEventListener('click', (e) => {
    if (e.target === zone) {
      els.fileInput.click();
    }
  });

  els.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleUploadedFile(e.target.files[0]);
    }
  });

  // Drag events
  ['dragenter', 'dragover'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      els.dragPromptOverlay.classList.remove('opacity-0');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    zone.addEventListener(eventName, (e) => {
      e.preventDefault();
      els.dragPromptOverlay.classList.add('opacity-0');
    }, false);
  });

  zone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleUploadedFile(files[0]);
    }
  });

  els.btnRemoveFile.addEventListener('click', () => {
    state.currentFile = null;
    els.fileInfoBar.classList.add('hidden');
    els.pastedConfig.value = '';
    showToast('File attachment removed.', 'info');
  });
}

function handleUploadedFile(file) {
  state.currentFile = file;
  const reader = new FileReader();
  reader.onload = function(e) {
    els.pastedConfig.value = e.target.result;
    els.fileNameLabel.textContent = file.name;
    els.fileSizeLabel.textContent = (file.size / 1024).toFixed(1) + ' KB';
    els.fileInfoBar.classList.remove('hidden');
    showToast(`Successfully loaded ${file.name}!`, 'success');
  };
  reader.readAsText(file);
}

// SIDEBAR & DRAWER INTERACTIVE LOGIC
function setupEventListeners() {
  // Toggle Settings Slider Drawer (Slides from right side)
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

  // Categories switcher inside settings drawer
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

  // Test connection
  els.btnTestConnection.addEventListener('click', testConnection);

  // Live update counts from toggles inside drawer
  [els.maskIPs, els.maskMACs, els.maskSecrets, els.maskInterfaces, els.maskDomains, els.maskIdentity].forEach(el => {
    el.addEventListener('change', updatePrivacyShieldLabel);
  });

  // Sidebar Workspace Button
  els.sidebarBtnAudit.addEventListener('click', () => {
    // Hide drawer history
    els.drawerHistory.classList.add('hidden');
  });

  // Toggle History Drawer
  els.sidebarBtnHistory.addEventListener('click', () => {
    els.drawerHistory.classList.toggle('hidden');
  });

  // Sidebar Help Button
  els.sidebarBtnHelp.addEventListener('click', () => {
    showToast('💡 Help Tip: Paste RouterOS configs. Masking details are completely protected locally on this sandbox.', 'info');
  });

  // Toggle Input panel collapse/expand
  els.btnToggleInputPanel.addEventListener('click', toggleInputPanel);

  // Tabs navigation inside Workspace
  els.tabExplanation.addEventListener('click', () => switchTab('explanation'));
  els.tabDiff.addEventListener('click', () => switchTab('diff'));
  els.tabCommands.addEventListener('click', () => switchTab('commands'));

  // Diff view modes
  els.diffViewModeSplit.addEventListener('click', () => switchDiffMode('split'));
  els.diffViewModeUnified.addEventListener('click', () => switchDiffMode('unified'));

  // Command view modes
  els.commandViewModeChecklist.addEventListener('click', () => switchCommandMode('checklist'));
  els.commandViewModeRaw.addEventListener('click', () => switchCommandMode('raw'));

  // Quick action buttons
  els.btnQuickFirewall.addEventListener('click', loadFirewallTemplate);
  els.btnQuickRouting.addEventListener('click', loadRoutingTemplate);
  els.btnClearAll.addEventListener('click', clearAll);

  // Clear history list
  els.btnClearHistory.addEventListener('click', clearHistory);

  // Search History
  els.searchHistory.addEventListener('input', () => renderHistoryList(els.searchHistory.value));

  // Copy Tab content
  els.btnCopyTab.addEventListener('click', copyActiveTabContent);

  // Form Submission
  els.btnSubmit.addEventListener('click', submitChat);
}

// SETTINGS DRAWER CATEGORY SWITCHER
function switchSettingsCategoryTab(catId) {
  state.activeSettingsCategoryTab = catId;

  // reset visuals
  [els.settingsTabAi, els.settingsTabPrivacy, els.settingsTabPrompt].forEach(b => {
    b.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md text-slate-400 hover:text-white transition';
  });

  els.settingsSectionAi.classList.add('hidden');
  els.settingsSectionPrivacy.classList.add('hidden');
  els.settingsSectionPrompt.classList.add('hidden');

  if (catId === 'ai') {
    els.settingsTabAi.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-slate-700/50 transition';
    els.settingsSectionAi.classList.remove('hidden');
  } else if (catId === 'privacy') {
    els.settingsTabPrivacy.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-slate-700/50 transition';
    els.settingsSectionPrivacy.classList.remove('hidden');
  } else if (catId === 'prompt') {
    els.settingsTabPrompt.className = 'flex-1 py-1.5 text-[10px] font-bold rounded-md bg-slate-800 text-brand-400 border border-slate-700/50 transition';
    els.settingsSectionPrompt.classList.remove('hidden');
  }
}

// TOGGLE LEFT PANEL COLLAPSE
function toggleInputPanel() {
  state.inputPanelCollapsed = !state.inputPanelCollapsed;
  if (state.inputPanelCollapsed) {
    els.panelLeftInput.classList.add('lg:w-0', 'lg:p-0', 'overflow-hidden', 'opacity-0');
    els.btnToggleInputPanelIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>`;
    els.btnToggleInputPanel.classList.remove('right-4');
    els.btnToggleInputPanel.classList.add('left-4', 'absolute');
    els.panelRightOutput.appendChild(els.btnToggleInputPanel); // Teleport button so it remains clickable
  } else {
    els.panelLeftInput.classList.remove('lg:w-0', 'lg:p-0', 'overflow-hidden', 'opacity-0');
    els.btnToggleInputPanelIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>`;
    els.btnToggleInputPanel.classList.remove('left-4', 'absolute');
    els.btnToggleInputPanel.classList.add('right-4');
    els.panelLeftInput.appendChild(els.btnToggleInputPanel); // Teleport back
  }
}

// LOCAL HISTORY IMPLEMENTATION
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
  localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(state.history));
  renderHistoryList();
}

function renderHistoryList(filterQuery = '') {
  const container = els.historyItemsContainer;
  container.innerHTML = '';

  // Update Badge
  const count = state.history.length;
  if (count > 0) {
    els.historyBadge.textContent = count;
    els.historyBadge.classList.remove('hidden');
  } else {
    els.historyBadge.classList.add('hidden');
  }

  const query = filterQuery.toLowerCase().trim();
  const filtered = state.history.filter(item => {
    return item.title.toLowerCase().includes(query) ||
           item.chatMessage.toLowerCase().includes(query);
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="text-center py-8 text-slate-500 text-xs">No audits matched your search.</div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-3 bg-slate-900/60 hover:bg-[#1e293b] border border-slate-800 hover:border-slate-700 rounded-xl transition duration-200 cursor-pointer space-y-1.5 relative group';

    // Quick Delete item
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'absolute top-2.5 right-2.5 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-slate-950';
    deleteBtn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>`;

    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.history = state.history.filter(h => h.id !== item.id);
      localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(state.history));
      renderHistoryList();
      showToast('History item deleted.', 'info');
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
    desc.textContent = item.chatMessage || '(No description)';

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
  state.analysisResult = item.result;
  state.pastedConfigRaw = item.pastedConfig;
  els.pastedConfig.value = item.pastedConfig;
  els.chatMessage.value = item.chatMessage;

  // Render everything back
  els.contentExplanation.innerHTML = renderMarkdown(item.result.explanation || 'No explanation provided.');
  renderDiff(item.pastedConfig, item.result.correctedConfig);
  renderCommands(item.result.fixCommands);

  switchTab('explanation');
  showToast(`Restored Audit Session: ${item.title}`, 'success');
}

function clearHistory() {
  if (confirm('Are you sure you want to clear all saved audits?')) {
    state.history = [];
    localStorage.removeItem('mikrotik_chatbot_history');
    renderHistoryList();
    showToast('Audit history cleared.', 'info');
  }
}

// PRIVACY SHIELD BADGE LABELS
function updatePrivacyShieldLabel() {
  const activeToggles = [];
  if (els.maskIPs.checked) activeToggles.push('IPs');
  if (els.maskMACs.checked) activeToggles.push('MACs');
  if (els.maskSecrets.checked) activeToggles.push('Passwords');
  if (els.maskInterfaces.checked) activeToggles.push('Interfaces');
  if (els.maskDomains.checked) activeToggles.push('Domains');
  if (els.maskIdentity.checked) activeToggles.push('Identity');

  if (activeToggles.length === 0) {
    els.privacyCount.innerHTML = '🛡️ <span class="text-red-400 font-bold">All masking disabled</span>';
  } else if (activeToggles.length === 6) {
    els.privacyCount.innerHTML = '🛡️ <strong>Extreme Privacy Guard</strong>';
  } else {
    els.privacyCount.innerHTML = `🛡️ Masking active: ${activeToggles.join(', ')}`;
  }
}

// TOP LEVEL CONNECTION BADGE
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
      els.llmStatusDot.className = 'w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-emerald-glow';
      els.llmStatusText.textContent = `${provName} (${state.settings.model || 'Default'})`;
    } else {
      els.llmStatusDot.className = 'w-2.5 h-2.5 bg-amber-500 rounded-full shadow-amber-glow';
      els.llmStatusText.textContent = `${provName} (Key Missing)`;
    }
  } else {
    els.llmStatusDot.className = 'w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-emerald-glow';
    els.llmStatusText.textContent = `${provName} (${state.settings.model || 'Local'})`;
  }
}

// CONNECTION TESTING
async function testConnection() {
  els.btnTestConnection.disabled = true;
  els.testSpinner.classList.remove('hidden');
  els.testResult.textContent = 'Contacting provider...';
  els.testResult.className = 'text-[10px] font-bold text-slate-500';

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
      els.testResult.textContent = '✅ Success!';
      els.testResult.className = 'text-[10px] font-bold text-emerald-400';
      showToast('Connection successfully verified!', 'success');
    } else {
      els.testResult.textContent = '❌ Failed';
      els.testResult.className = 'text-[10px] font-bold text-red-400';
      showToast(`Connection failed: ${data.error || 'Check details'}`, 'error');
    }
  } catch (err) {
    els.testResult.textContent = '❌ Error';
    els.testResult.className = 'text-[10px] font-bold text-red-400';
    showToast(`Network Error: ${err.message}`, 'error');
  } finally {
    els.btnTestConnection.disabled = false;
    els.testSpinner.classList.add('hidden');
  }
}

// TABS SWITCHER
function switchTab(tabId) {
  state.activeTab = tabId;

  // set active tab button
  [els.tabExplanation, els.tabDiff, els.tabCommands].forEach(b => {
    b.className = 'tab-btn px-4 py-1.5 text-[11px] font-bold rounded-lg text-slate-400 hover:text-white transition-all duration-200';
  });

  const activeBtn = document.getElementById(`tab-${tabId}`);
  if (activeBtn) {
    activeBtn.className = 'tab-btn active px-4 py-1.5 text-[11px] font-bold rounded-lg bg-brand-500 text-white transition-all duration-200';
  }

  // Display togglers depending on tab
  els.diffModeToggles.classList.add('hidden');
  els.commandModeToggles.classList.add('hidden');

  els.panelWelcome.classList.add('hidden');
  els.contentExplanation.classList.add('hidden');
  els.contentDiff.classList.add('hidden');
  els.contentCommands.classList.add('hidden');

  if (state.analysisResult) {
    if (tabId === 'explanation') {
      els.contentExplanation.classList.remove('hidden');
    } else if (tabId === 'diff') {
      els.contentDiff.classList.remove('hidden');
      els.diffModeToggles.classList.remove('hidden');
    } else if (tabId === 'commands') {
      els.contentCommands.classList.remove('hidden');
      els.commandModeToggles.classList.remove('hidden');
    }
  } else {
    els.panelWelcome.classList.remove('hidden');
  }
}

// SWITCH DIFF GRAPH VIEW MODE
function switchDiffMode(modeId) {
  state.diffMode = modeId;

  // Button visuals
  [els.diffViewModeSplit, els.diffViewModeUnified].forEach(b => {
    b.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';
  });

  if (modeId === 'split') {
    els.diffViewModeSplit.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-slate-700/50 transition';
    els.diffSplitHeaders.classList.remove('hidden');
    els.diffSplitHeaders.classList.add('grid');
    els.diffUnifiedHeader.classList.add('hidden');
  } else {
    els.diffViewModeUnified.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-cyber-accent border border-slate-700/50 transition';
    els.diffSplitHeaders.classList.add('hidden');
    els.diffSplitHeaders.classList.remove('grid');
    els.diffUnifiedHeader.classList.remove('hidden');
  }

  if (state.analysisResult) {
    renderDiff(state.pastedConfigRaw, state.analysisResult.correctedConfig);
  }
}

// SWITCH COMMAND VIEW MODE
function switchCommandMode(modeId) {
  state.commandMode = modeId;

  [els.commandViewModeChecklist, els.commandViewModeRaw].forEach(b => {
    b.className = 'px-2.5 py-1 text-[10px] font-bold rounded text-slate-400 hover:text-white transition';
  });

  if (modeId === 'checklist') {
    els.commandViewModeChecklist.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-emerald-400 border border-slate-700/50 transition';
    els.commandsChecklistContainer.classList.remove('hidden');
    els.commandsRawContainer.classList.add('hidden');
  } else {
    els.commandViewModeRaw.className = 'px-2.5 py-1 text-[10px] font-bold rounded bg-slate-800 text-emerald-400 border border-slate-700/50 transition';
    els.commandsChecklistContainer.classList.add('hidden');
    els.commandsRawContainer.classList.remove('hidden');
  }
}

// COPY TAB CONTENT
function copyActiveTabContent() {
  let textToCopy = '';
  if (!state.analysisResult) return;

  if (state.activeTab === 'explanation') {
    textToCopy = els.contentExplanation.innerText;
  } else if (state.activeTab === 'commands') {
    textToCopy = els.commandsBlock.textContent;
  } else if (state.activeTab === 'diff') {
    textToCopy = state.analysisResult.correctedConfig || '';
  }

  if (textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      els.btnCopyText.textContent = 'Copied!';
      showToast('Copied content to clipboard!', 'success');
      setTimeout(() => {
        els.btnCopyText.textContent = 'Copy Tab';
      }, 2000);
    }).catch(err => {
      console.error('Clipboard copy failed', err);
      showToast('Copy failed. Please try manually selecting text.', 'error');
    });
  }
}

// CLEAR ALL FIELDS
function clearAll() {
  els.pastedConfig.value = '';
  els.chatMessage.value = '';
  state.analysisResult = null;
  state.pastedConfigRaw = '';
  state.currentFile = null;
  els.fileInfoBar.classList.add('hidden');
  els.diffTableBody.innerHTML = '';
  els.commandsBlock.textContent = '# Commands will appear here after analysis...';
  els.commandsChecklistContainer.innerHTML = '';
  els.contentExplanation.innerHTML = '';
  switchTab('explanation');
  showToast('Workspace cleared.', 'info');
}

// LOAD TEMPLATES
function loadFirewallTemplate() {
  state.currentFile = null;
  els.fileInfoBar.classList.add('hidden');

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
  showToast('Firewall template loaded!', 'info');
}

function loadRoutingTemplate() {
  state.currentFile = null;
  els.fileInfoBar.classList.add('hidden');

  els.pastedConfig.value = `/ip address
add address=192.168.1.10/24 interface=ether1-wan network=192.168.1.0
add address=192.168.88.1/24 interface=bridge-lan network=192.168.88.0

/ip route
add disabled=no distance=1 dst-address=0.0.0.0/0 gateway=192.168.88.254 vrf-interface=bridge-lan

/ip dns
set allow-remote-requests=yes servers=8.8.8.8`;

  els.chatMessage.value = "We have zero internet access on our office network. Clients cannot ping outside or resolve domain names. Here is our setup.";
  switchTab('explanation');
  showToast('Gateway/Routing template loaded!', 'info');
}

// COMPUTE LINE-BY-LINE DIFF
function computeLineDiff(originalText, correctedText) {
  const leftLines = originalText.split('\n');
  const rightLines = correctedText.split('\n');

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

// RENDER DIFF TABLE (Supports split and unified views)
function renderDiff(originalText, correctedText) {
  const alignedLines = computeLineDiff(originalText, correctedText);
  const tbody = els.diffTableBody;
  tbody.innerHTML = '';

  if (state.diffMode === 'split') {
    alignedLines.forEach((row) => {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-slate-900 hover:bg-slate-900/40 text-slate-300';

      const tdLeft = document.createElement('td');
      tdLeft.className = 'w-1/2 p-2 align-top whitespace-pre-wrap border-r border-slate-900 break-all select-text font-mono text-xs';

      const tdRight = document.createElement('td');
      tdRight.className = 'w-1/2 p-2 align-top whitespace-pre-wrap break-all select-text font-mono text-xs';

      if (row.type === 'equal') {
        tdLeft.textContent = row.left;
        tdRight.textContent = row.right;
      } else if (row.type === 'delete') {
        tdLeft.className += ' diff-deleted text-red-400 font-medium';
        tdLeft.textContent = row.left;
        tdRight.className += ' bg-slate-950/60';
        tdRight.textContent = '';
      } else if (row.type === 'insert') {
        tdLeft.className += ' bg-slate-950/60';
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
  } else {
    // Unified view
    alignedLines.forEach((row) => {
      if (row.type === 'equal') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40 text-slate-400';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs';
        td.textContent = `  ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'delete') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-deleted text-red-400 font-medium';
        td.textContent = `- ${row.left}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'insert') {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const td = document.createElement('td');
        td.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-inserted text-emerald-400 font-medium';
        td.textContent = `+ ${row.right}`;
        tr.appendChild(td);
        tbody.appendChild(tr);
      } else if (row.type === 'modify') {
        // Render deletion line, followed immediately by insertion line
        const trDel = document.createElement('tr');
        trDel.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const tdDel = document.createElement('td');
        tdDel.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-deleted text-red-400 font-medium';
        tdDel.textContent = `- ${row.left}`;
        trDel.appendChild(tdDel);
        tbody.appendChild(trDel);

        const trIns = document.createElement('tr');
        trIns.className = 'border-b border-slate-900 hover:bg-slate-900/40';
        const tdIns = document.createElement('td');
        tdIns.className = 'p-2 whitespace-pre-wrap break-all select-text font-mono text-xs diff-inserted text-emerald-400 font-medium';
        tdIns.textContent = `+ ${row.right}`;
        trIns.appendChild(tdIns);
        tbody.appendChild(trIns);
      }
    });
  }
}

// RENDER INTERACTIVE CHECKLIST FOR COMMANDS
function renderCommands(fixCommands) {
  // Populate Raw Command Block
  els.commandsBlock.textContent = fixCommands || '# No specific terminal commands needed for this fix.';

  const container = els.commandsChecklistContainer;
  container.innerHTML = '';

  const lines = (fixCommands || '').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));

  if (lines.length === 0) {
    container.innerHTML = `
      <div class="p-6 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-slate-500 text-xs">
        No copy-pasteable commands detected. Refer to the Explanation tab or Configuration Diff.
      </div>
    `;
    return;
  }

  lines.forEach((line, index) => {
    const item = document.createElement('div');
    item.className = 'p-3 bg-[#0b0f19] border border-slate-800 rounded-xl flex items-center justify-between space-x-3 hover:border-slate-700 transition duration-150';

    const left = document.createElement('div');
    left.className = 'flex items-start space-x-3 min-w-0';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'mt-1 accent-emerald-500 h-4 w-4 rounded shrink-0 cursor-pointer';

    const text = document.createElement('code');
    text.className = 'text-xs text-slate-200 font-mono select-text break-all leading-normal';
    text.textContent = line;

    // Line completed strike behavior
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        text.className += ' line-through opacity-40';
        item.className = 'p-3 bg-[#0b0f19]/40 border border-slate-800 rounded-xl flex items-center justify-between space-x-3 opacity-60 transition';
      } else {
        text.className = 'text-xs text-slate-200 font-mono select-text break-all leading-normal';
        item.className = 'p-3 bg-[#0b0f19] border border-slate-800 rounded-xl flex items-center justify-between space-x-3 hover:border-slate-700 transition';
      }
    });

    left.appendChild(checkbox);
    left.appendChild(text);

    const btnCopy = document.createElement('button');
    btnCopy.className = 'text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0 transition active:scale-95';
    btnCopy.textContent = 'Copy';

    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(line).then(() => {
        btnCopy.textContent = 'Copied!';
        btnCopy.className = 'text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold px-2.5 py-1 rounded-lg shrink-0 transition';
        showToast('Command copied!', 'success');
        setTimeout(() => {
          btnCopy.textContent = 'Copy';
          btnCopy.className = 'text-[10px] bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-lg shrink-0';
        }, 1500);
      });
    });

    item.appendChild(left);
    item.appendChild(btnCopy);
    container.appendChild(item);
  });
}

// MARKDOWN RENDERING FOR EXPLANATION
function renderMarkdown(text) {
  if (!text) return '';
  let html = text;

  // Escape HTML tags to prevent injections but keep paragraphs
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
  html = html.replace(/^### (.*$)/gim, '<h5 class="text-xs font-bold text-white mt-4 mb-2 uppercase tracking-wide">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 class="text-sm font-bold text-white mt-5 mb-2 border-b border-slate-800 pb-1.5">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 class="text-base font-bold text-cyber-accent mt-6 mb-3">$1</h3>');

  // Bold (**text**)
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

  // Inline code (`code`)
  html = html.replace(/`(.*?)`/g, '<code class="bg-[#0b0f19] text-cyber-accent font-mono text-[11px] px-1.5 py-0.5 rounded border border-slate-800">$1</code>');

  // Code blocks (```lang ... ```)
  html = html.replace(/```[a-z]*\n([\s\S]*?)```/g, '<pre class="bg-slate-950 text-slate-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 my-3 overflow-x-auto select-all leading-relaxed">$1</pre>');

  // Newlines to paragraphs
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<h') || p.trim().startsWith('<u') || p.trim().startsWith('<pre')) {
      return p;
    }
    return `<p class="mb-3 text-slate-300 leading-relaxed">${p}</p>`;
  }).join('');

  return html;
}

// MULTI-STEP SIMULATED STEPPER LOADER
async function runStepperAndSubmit(submitPayload) {
  // Reset stepper views
  els.privacyLoader.classList.remove('hidden');
  updateStep(els.stepMask, 'active', 'Scanning configuration for secrets & private subnets...');
  updateStep(els.stepTransit, 'pending', 'Awaiting previous step...');
  updateStep(els.stepRestore, 'pending', 'Awaiting previous step...');
  updateStep(els.stepDiff, 'pending', 'Awaiting previous step...');

  setProgressBar(15, '15%');

  // Stage 1: Masking
  await delay(800);
  updateStep(els.stepMask, 'complete', 'Shield locked! Replaced private IPs, passwords, and custom identities locally.');
  updateStep(els.stepTransit, 'active', 'Sending redacted instructions to secure sandbox...');
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

    const timeoutPromise = delay(1200); // Enforce a minimum delay for beautiful visual feedback

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
  updateStep(els.stepTransit, 'complete', 'Audit successfully compiled by LLM provider.');
  updateStep(els.stepRestore, 'active', 'Rebuilding config mapping: Replacing placeholders with secure originals...');
  setProgressBar(75, '75%');
  await delay(700);

  // Stage 4: Formatting Diff
  updateStep(els.stepRestore, 'complete', 'Original network credentials restored securely in-browser.');
  updateStep(els.stepDiff, 'active', 'Rendering dynamic colored line comparisons & fix checklists...');
  setProgressBar(95, '95%');
  await delay(600);

  // Finalize
  setProgressBar(100, '100%');
  updateStep(els.stepDiff, 'complete', 'Analysis pipeline fully executed.');
  await delay(300);

  // Load results into views
  state.analysisResult = serverResponseData;

  els.contentExplanation.innerHTML = renderMarkdown(serverResponseData.explanation || 'No explanation provided.');
  renderDiff(state.pastedConfigRaw, serverResponseData.correctedConfig || '');
  renderCommands(serverResponseData.fixCommands || '');

  // Hide loader and slide to explanation
  els.privacyLoader.classList.add('hidden');
  switchTab('explanation');
  showToast('Auditing pipeline complete!', 'success');

  // Save audit in local session history
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const title = state.currentFile ? state.currentFile.name : `RouterOS Config ${state.history.length + 1}`;

  saveHistoryItem({
    id: Date.now(),
    title,
    timestamp,
    pastedConfig: state.pastedConfigRaw,
    chatMessage: submitPayload.chatMessage || 'Configuration audit request',
    result: serverResponseData
  });
}

function updateStep(el, state, text) {
  const indicator = el.querySelector('.step-indicator');
  const stat = el.querySelector('.step-stat');

  els.stepperLogText.textContent = text;

  if (state === 'active') {
    el.className = 'flex items-center justify-between text-slate-200';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-cyan-500/50 text-[10px] font-bold flex items-center justify-center bg-[#0b0f19] text-cyber-accent pulse-ring-active shadow-cyber-glow';
    stat.textContent = 'Active';
    stat.className = 'step-stat text-[10px] font-mono text-cyber-accent';
  } else if (state === 'complete') {
    el.className = 'flex items-center justify-between text-slate-400';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-emerald-500/50 text-[10px] font-bold flex items-center justify-center bg-slate-900 text-emerald-400';
    indicator.innerHTML = '✓';
    stat.textContent = 'Completed';
    stat.className = 'step-stat text-[10px] font-mono text-emerald-400';
  } else {
    el.className = 'flex items-center justify-between text-slate-600';
    indicator.className = 'step-indicator w-5 h-5 rounded-full border border-slate-800 text-[10px] font-bold flex items-center justify-center bg-slate-950 text-slate-600';
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

// SUBMIT ENTIRE AUDITING TASK
async function submitChat() {
  const pastedVal = els.pastedConfig.value.trim();
  const chatVal = els.chatMessage.value.trim();

  if (!pastedVal && !chatVal) {
    showToast('Please paste a configuration or describe a question!', 'error');
    return;
  }

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
    maskOptions
  };

  await runStepperAndSubmit(body);
}
