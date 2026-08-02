const Sidebar = {
  isCollapsed: false,

  init() {
    this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    const container = document.getElementById('sidebar-container');
    if (container) {
      this.render(container);
    }
  },

  render(container) {
    if (typeof this.isCollapsed === 'undefined') {
      this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    }

    container.innerHTML = `
      <aside id="sidebar" class="w-[200px] bg-surface border-r border-border flex flex-col h-full transition-all duration-200 ${this.isCollapsed ? 'sidebar-collapsed' : ''}">
        <!-- Sidebar Toggle Header -->
        <div class="p-2 flex items-center border-b border-border ${this.isCollapsed ? 'justify-center' : 'justify-between'}">
          <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider nav-text">Wizard Control</span>
          <button id="sidebar-toggle" title="${this.isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}" class="w-6 h-6 rounded hover:bg-white/5 flex items-center justify-center text-zinc-400 transition-colors">
            ${UI_Icons.render(this.isCollapsed ? 'chevron-right' : 'chevron-left', 'w-3.5 h-3.5')}
          </button>
        </div>

        <nav class="flex-1 p-2 space-y-1">
          <button data-tab="audit" title="Audit" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('shield-check', 'w-3.5 h-3.5 mr-2 text-zinc-400 shrink-0')}
            <span class="nav-text">Audit</span>
          </button>
          <button data-tab="build" title="Build" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('hammer', 'w-3.5 h-3.5 mr-2 text-zinc-400 shrink-0')}
            <span class="nav-text">Build</span>
          </button>
          <button data-tab="lib" title="Library" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('library', 'w-3.5 h-3.5 mr-2 text-zinc-400 shrink-0')}
            <span class="nav-text">Library</span>
          </button>
        </nav>
        <div class="p-2 border-t border-border">
          <button data-tab="prefs" title="Preferences" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('settings', 'w-3.5 h-3.5 mr-2 text-zinc-400 shrink-0')}
            <span class="nav-text">Preferences</span>
          </button>
        </div>
      </aside>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    this.setupToggle();
    this.setupTabListeners();

    // Ensure stateful selection persists correctly across renders
    if (typeof AppState !== 'undefined' && AppState.currentTab) {
      Router.updateActiveTab(AppState.currentTab);
    }
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
  },

  setupTabListeners() {
    document.querySelectorAll('#sidebar .tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.dataset.tab;
        AppState.setCurrentTab(tab);
        Router.renderCurrentTab();
        Router.updateActiveTab(tab);
      });
    });
  }
};
