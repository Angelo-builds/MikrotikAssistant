const Sidebar = {
  isCollapsed: false,
  isHistoryCollapsed: false,

  init() {
    this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    this.isHistoryCollapsed = localStorage.getItem('history-panel-collapsed') === 'true';
    const container = document.getElementById('sidebar-container');
    if (container) {
      this.render(container);
    }
  },

  render(container) {
    if (typeof this.isCollapsed === 'undefined') {
      this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    }
    if (typeof this.isHistoryCollapsed === 'undefined') {
      this.isHistoryCollapsed = localStorage.getItem('history-panel-collapsed') === 'true';
    }

    const currentTab = typeof AppState !== 'undefined' ? AppState.currentTab : 'audit';

    container.innerHTML = `
      <aside id="sidebar" class="w-64 bg-app border-r border-border-subtle flex flex-col h-full transition-all duration-200 ${this.isCollapsed ? 'sidebar-collapsed !w-12' : ''}">
        <!-- App Header -->
        <div class="p-4 border-b border-border-subtle flex items-center justify-between">
          <div class="flex items-center space-x-2 nav-text">
            <i data-lucide="cpu" class="w-5 h-5 text-indigo-400 shrink-0"></i>
            <div class="flex flex-col">
              <span class="text-sm font-semibold text-zinc-100 leading-tight">MikrotikAssistant</span>
              <span class="text-[10px] text-zinc-500 leading-none">Privacy-First RouterOS Tool</span>
            </div>
          </div>
          <button id="sidebar-toggle" title="${this.isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}" class="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-zinc-400 transition-colors shrink-0">
            <i data-lucide="${this.isCollapsed ? 'chevron-right' : 'chevron-left'}" class="w-3.5 h-3.5"></i>
          </button>
        </div>

        <!-- Main Navigation -->
        <nav class="sidebar-nav p-3 space-y-1 select-none">
          <button data-tab="audit" title="Audit" class="nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-elevated transition ${currentTab === 'audit' ? 'bg-elevated text-indigo-400 font-semibold' : 'text-zinc-400'}">
            <i data-lucide="activity" class="w-4 h-4 shrink-0"></i>
            <span class="text-xs font-medium nav-text">Audit</span>
          </button>
          <button data-tab="build" title="Build" class="nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-elevated transition ${currentTab === 'build' ? 'bg-elevated text-indigo-400 font-semibold' : 'text-zinc-400'}">
            <i data-lucide="wrench" class="w-4 h-4 shrink-0"></i>
            <span class="text-xs font-medium nav-text">Build</span>
          </button>
          <button data-tab="lib" title="Library" class="nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-elevated transition ${currentTab === 'lib' ? 'bg-elevated text-indigo-400 font-semibold' : 'text-zinc-400'}">
            <i data-lucide="library" class="w-4 h-4 shrink-0"></i>
            <span class="text-xs font-medium nav-text">Library</span>
          </button>
        </nav>

        <!-- Sidebar history flex container -->
        <div class="sidebar-history flex-1 overflow-y-auto min-h-0">
          <!-- Session History (Collapsible, below separator) -->
          <div class="border-t border-border-subtle mt-2 ${this.isCollapsed ? 'hidden' : ''}">
            <button id="btn-toggle-history" class="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition focus:outline-none">
              <span class="flex items-center space-x-2">
                <i data-lucide="history" class="w-3.5 h-3.5"></i>
                <span>Session History</span>
              </span>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform ${this.isHistoryCollapsed ? 'rotated' : ''}" id="history-chevron"></i>
            </button>

            <div id="history-panel" class="px-2 pb-2 space-y-1 ${this.isHistoryCollapsed ? 'collapsed' : ''}">
              <!-- Search -->
              <div class="px-2 py-1.5">
                <input type="text" id="history-search" placeholder="Search sessions..."
                  class="w-full bg-elevated border border-border-subtle rounded px-2 py-1 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50">
              </div>

              <!-- History Items -->
              <div id="history-list" class="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                ${this.renderHistoryItems()}
              </div>

              <!-- Wipe All Button -->
              <button id="btn-wipe-all" class="w-full flex items-center justify-center space-x-1.5 px-2 py-1.5 text-[10px] text-red-400 hover:bg-red-900/20 rounded transition mt-2 focus:outline-none">
                <i data-lucide="trash-2" class="w-3 h-3"></i>
                <span>Clear All History</span>
              </button>
            </div>
          </div>

          <!-- Builder History (Collapsible) -->
          <div class="border-t border-border-subtle mt-2 ${this.isCollapsed ? 'hidden' : ''}">
            <button id="btn-toggle-builder-history" class="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition focus:outline-none">
              <span class="flex items-center space-x-2">
                <i data-lucide="folder" class="w-3.5 h-3.5"></i>
                <span>Build Projects</span>
              </span>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 transition-transform" id="builder-history-chevron"></i>
            </button>

            <div id="builder-history-panel" class="px-2 pb-2 space-y-1">
              <div id="builder-projects-list" class="space-y-0.5 max-h-48 overflow-y-auto pr-1">
                <!-- Projects rendered here -->
                ${this.renderBuilderProjects()}
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences (at bottom) -->
        <div class="sidebar-preferences p-3 border-t border-border-subtle">
          <button data-tab="prefs" title="Preferences" class="nav-item tab-btn w-full flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-elevated transition ${currentTab === 'prefs' ? 'bg-elevated text-indigo-400 font-semibold' : 'text-zinc-400'}">
            <i data-lucide="settings" class="w-4 h-4 shrink-0"></i>
            <span class="text-xs font-medium nav-text">Preferences</span>
          </button>
        </div>
      </aside>
    `;

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    this.setupToggle();
    this.setupTabListeners();
    this.setupHistoryListeners();

    // Ensure stateful selection persists correctly across renders
    if (typeof AppState !== 'undefined' && AppState.currentTab) {
      Router.updateActiveTab(AppState.currentTab);
    }
  },

  getHistoryData() {
    const savedHistory = localStorage.getItem('mikrotik_chatbot_history');
    if (savedHistory) {
      try {
        return JSON.parse(savedHistory);
      } catch (e) {
        console.error('Failed to parse history inside sidebar:', e);
      }
    }
    return [];
  },

  getBuilderProjects() {
    const data = localStorage.getItem('builder-projects');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse builder projects:', e);
      }
    }
    return [];
  },

  renderBuilderProjects() {
    const projects = this.getBuilderProjects();
    if (projects.length === 0) {
      return `<div class="text-center py-4 text-zinc-600 text-[10px] font-medium">No saved projects.</div>`;
    }

    return projects.map(proj => {
      const date = proj.lastModified ? new Date(proj.lastModified).toLocaleDateString() : '';
      return `
        <div class="project-item group relative p-2 bg-transparent hover:bg-elevated border border-transparent hover:border-border-subtle rounded cursor-pointer transition flex flex-col min-w-0" data-id="${proj.id}">
          <button class="btn-delete-project absolute top-1.5 right-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-red-950/20" data-id="${proj.id}">
            <i data-lucide="trash-2" class="w-3 h-3"></i>
          </button>
          <div class="flex items-center justify-between pr-4 mb-0.5">
            <span class="text-[11px] font-semibold text-zinc-200 truncate pr-1">${proj.name}</span>
            <span class="text-[9px] text-zinc-500 font-mono shrink-0">${date}</span>
          </div>
          <p class="text-[10px] text-zinc-500 line-clamp-1 leading-normal pr-4">${proj.blocks ? proj.blocks.length : 0} blocks</p>
        </div>
      `;
    }).join('');
  },

  renderHistoryItems(filterQuery = '') {
    const history = this.getHistoryData();
    if (history.length === 0) {
      return `<div class="text-center py-4 text-zinc-600 text-[10px] font-medium">No sessions saved.</div>`;
    }

    const query = filterQuery.toLowerCase().trim();
    const filtered = history.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      const msgMatch = item.messages && item.messages.some(m => m.chatMessage && m.chatMessage.toLowerCase().includes(query));
      return titleMatch || msgMatch;
    });

    if (filtered.length === 0) {
      return `<div class="text-center py-4 text-zinc-600 text-[10px] font-medium">No matches.</div>`;
    }

    return filtered.map(item => {
      const firstMsg = item.messages && item.messages[0] ? item.messages[0].chatMessage : '';
      return `
        <div class="history-item group relative p-2 bg-transparent hover:bg-elevated border border-transparent hover:border-border-subtle rounded cursor-pointer transition flex flex-col min-w-0" data-id="${item.id}">
          <button class="btn-delete-history-item absolute top-1.5 right-1.5 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1 rounded hover:bg-red-950/20" data-id="${item.id}">
            <i data-lucide="x" class="w-3 h-3"></i>
          </button>
          <div class="flex items-center justify-between pr-4 mb-0.5">
            <span class="text-[11px] font-semibold text-zinc-200 truncate pr-1">${item.title}</span>
            <span class="text-[9px] text-zinc-500 font-mono shrink-0">${item.timestamp}</span>
          </div>
          <p class="text-[10px] text-zinc-500 line-clamp-1 leading-normal pr-4">${firstMsg || '(No context)'}</p>
        </div>
      `;
    }).join('');
  },

  setupToggle() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('sidebar-collapsed', this.isCollapsed);
        const container = document.getElementById('sidebar-container');
        if (container) {
          this.render(container);
        }
      });
    }

    // Toggle Builder History Visibility
    const toggleBuilderHistoryBtn = document.getElementById('btn-toggle-builder-history');
    if (toggleBuilderHistoryBtn) {
      toggleBuilderHistoryBtn.addEventListener('click', () => {
        const isBuilderHistoryCollapsed = localStorage.getItem('builder-history-panel-collapsed') === 'true';
        const nextState = !isBuilderHistoryCollapsed;
        localStorage.setItem('builder-history-panel-collapsed', nextState);
        const panel = document.getElementById('builder-history-panel');
        const chevron = document.getElementById('builder-history-chevron');
        if (panel) {
          panel.classList.toggle('collapsed', nextState);
        }
        if (chevron) {
          chevron.classList.toggle('rotated', nextState);
        }
      });
    }
    // Initialize initial state of Builder History toggle on UI load
    const isBuilderHistoryCollapsed = localStorage.getItem('builder-history-panel-collapsed') === 'true';
    const bPanel = document.getElementById('builder-history-panel');
    const bChevron = document.getElementById('builder-history-chevron');
    if (bPanel) {
      bPanel.classList.toggle('collapsed', isBuilderHistoryCollapsed);
    }
    if (bChevron) {
      bChevron.classList.toggle('rotated', isBuilderHistoryCollapsed);
    }

    // Listen for custom project save events to dynamically update projects list
    window.addEventListener('builder-project-saved', () => {
      const list = document.getElementById('builder-projects-list');
      if (list) {
        list.innerHTML = this.renderBuilderProjects();
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        this.setupBuilderProjectListeners();
      }
    });
  },

  setupTabListeners() {
    document.querySelectorAll('#sidebar .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        if (typeof AppState !== 'undefined') {
          AppState.setCurrentTab(tab);
          Router.renderCurrentTab();
          Router.updateActiveTab(tab);
        }
      });
    });
  },

  setupHistoryListeners() {
    if (this.isCollapsed) return;

    // Toggle History Visibility
    const toggleHistoryBtn = document.getElementById('btn-toggle-history');
    if (toggleHistoryBtn) {
      toggleHistoryBtn.addEventListener('click', () => {
        this.isHistoryCollapsed = !this.isHistoryCollapsed;
        localStorage.setItem('history-panel-collapsed', this.isHistoryCollapsed);
        const panel = document.getElementById('history-panel');
        const chevron = document.getElementById('history-chevron');
        if (panel) {
          panel.classList.toggle('collapsed', this.isHistoryCollapsed);
        }
        if (chevron) {
          chevron.classList.toggle('rotated', this.isHistoryCollapsed);
        }
      });
    }

    // Search input
    const searchInput = document.getElementById('history-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const list = document.getElementById('history-list');
        if (list) {
          list.innerHTML = this.renderHistoryItems(e.target.value);
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          this.setupHistoryItemClicks();
        }
      });
    }

    // Wipe All Button
    const wipeAllBtn = document.getElementById('btn-wipe-all');
    if (wipeAllBtn) {
      wipeAllBtn.addEventListener('click', async () => {
        if (typeof PromptModal !== 'undefined') {
          const confirmed = await PromptModal.show({
            title: 'Wipe All History',
            message: 'Are you sure you want to permanently delete all conversation history?',
            confirmText: 'Wipe History',
            cancelText: 'Cancel',
            type: 'warning'
          });
          if (confirmed) {
            localStorage.removeItem('mikrotik_chatbot_history');
            const list = document.getElementById('history-list');
            if (list) {
              list.innerHTML = this.renderHistoryItems();
            }
            if (typeof AuditTab !== 'undefined' && AuditTab.resetChatSession) {
              AuditTab.resetChatSession();
            }
            if (typeof showGlobalToast === 'function') {
              showGlobalToast('All history cleared!', 'success');
            }
          }
        } else {
          if (confirm('Wipe all session history?')) {
            localStorage.removeItem('mikrotik_chatbot_history');
            const list = document.getElementById('history-list');
            if (list) {
              list.innerHTML = this.renderHistoryItems();
            }
            if (typeof AuditTab !== 'undefined' && AuditTab.resetChatSession) {
              AuditTab.resetChatSession();
            }
          }
        }
      });
    }

    this.setupHistoryItemClicks();
    this.setupBuilderProjectListeners();
  },

  setupBuilderProjectListeners() {
    // Individual project restore click
    document.querySelectorAll('#builder-projects-list .project-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return; // ignore delete action
        const id = card.dataset.id;
        if (typeof AppState !== 'undefined') {
          AppState.setCurrentTab('build');
          Router.renderCurrentTab();
          Router.updateActiveTab('build');
          setTimeout(() => {
            if (typeof BuilderEngine !== 'undefined') {
              BuilderEngine.loadProject(id);
            }
          }, 50);
        }
      });
    });

    // Individual project delete
    document.querySelectorAll('#builder-projects-list .btn-delete-project').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;

        let confirmed = false;
        if (typeof PromptModal !== 'undefined') {
          confirmed = await PromptModal.show({
            title: 'Delete Project',
            message: 'Are you sure you want to delete this project?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'warning'
          });
        } else {
          confirmed = confirm('Are you sure you want to delete this project?');
        }

        if (!confirmed) return;

        let projects = this.getBuilderProjects();
        projects = projects.filter(p => String(p.id) !== String(id));
        localStorage.setItem('builder-projects', JSON.stringify(projects));

        const list = document.getElementById('builder-projects-list');
        if (list) {
          list.innerHTML = this.renderBuilderProjects();
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          this.setupBuilderProjectListeners();
        }

        if (typeof BuilderEngine !== 'undefined' && BuilderEngine.currentProjectId === id) {
          BuilderEngine.currentProjectId = null;
          BuilderEngine.projectName = null;
          BuilderEngine.createdAt = null;
          BuilderEngine.state.variables = { ...BuilderEngine.defaultVariables };
          BuilderEngine.loadDefaultBlocks();
          if (AppState.currentTab === 'build') {
            Router.renderCurrentTab();
          }
        }

        if (typeof showGlobalToast === 'function') {
          showGlobalToast('Project deleted successfully!', 'success');
        }
      });
    });
  },

  setupHistoryItemClicks() {
    // Individual click to restore
    document.querySelectorAll('#history-list .history-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('button')) return; // ignore delete action
        const id = card.dataset.id;
        const history = this.getHistoryData();
        const item = history.find(h => String(h.id) === String(id));
        if (item) {
          if (typeof AppState !== 'undefined') {
            AppState.setCurrentTab('audit');
            Router.renderCurrentTab();
            Router.updateActiveTab('audit');
            setTimeout(() => {
              if (typeof AuditTab !== 'undefined' && AuditTab.restoreConversation) {
                AuditTab.restoreConversation(item);
              }
            }, 50);
          }
        }
      });
    });

    // Delete individual
    document.querySelectorAll('#history-list .btn-delete-history-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        let history = this.getHistoryData();
        history = history.filter(h => String(h.id) !== String(id));
        localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(history));

        const list = document.getElementById('history-list');
        if (list) {
          list.innerHTML = this.renderHistoryItems();
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          this.setupHistoryItemClicks();
        }

        if (typeof AuditTab !== 'undefined' && AuditTab.state && AuditTab.state.currentChatId === id) {
          AuditTab.resetChatSession();
        }
      });
    });
  }
};
