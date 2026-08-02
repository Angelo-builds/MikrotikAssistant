const LibTab = {
  state: {
    presetsExpanded: false,
    libraryExpanded: false
  },

  render(container) {
    container.innerHTML = `
      <div class="lib-container max-w-2xl mx-auto p-4 space-y-3 select-none animate-apple-reveal font-sans text-xs">
        <div class="flex items-center justify-between pb-1.5">
          <h2 class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
            ${UI_Icons.render('library', 'mr-1.5 text-purple-500 w-3.5 h-3.5')}
            Template Library
          </h2>
        </div>

        <!-- Presets Section -->
        <section class="border border-border rounded-md bg-surface overflow-hidden">
          <button id="btn-toggle-presets" class="w-full px-3 py-2 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none">
            <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
              ${UI_Icons.render('zap', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
              Quick Presets
            </span>
            <span id="presets-chevron" class="text-zinc-500">
              ${UI_Icons.render(this.state.presetsExpanded ? 'chevron-down' : 'chevron-right', 'w-3.5 h-3.5')}
            </span>
          </button>
          <div id="presets-container" class="border-t border-border bg-app divide-y divide-border/30 ${this.state.presetsExpanded ? '' : 'hidden'}">
            <div class="p-1 space-y-1" id="presets-list">
              <!-- Injected by JS -->
            </div>
          </div>
        </section>

        <!-- Saved Projects Section -->
        <section class="border border-border rounded-md bg-surface overflow-hidden">
          <button id="btn-toggle-library" class="w-full px-3 py-2 bg-surface-elevated flex items-center justify-between hover:bg-white/5 transition text-left focus:outline-none">
            <span class="text-xs font-bold text-primary flex items-center uppercase tracking-wider">
              ${UI_Icons.render('folder', 'mr-1.5 w-3.5 h-3.5 text-purple-500')}
              Saved Projects
            </span>
            <span id="library-chevron" class="text-zinc-500">
              ${UI_Icons.render(this.state.libraryExpanded ? 'chevron-down' : 'chevron-right', 'w-3.5 h-3.5')}
            </span>
          </button>
          <div id="library-container" class="border-t border-border bg-app divide-y divide-border/30 ${this.state.libraryExpanded ? '' : 'hidden'}">
            <div class="p-1 space-y-1" id="library-list">
              <!-- Injected by JS -->
            </div>
            <div id="empty-library-msg" class="hidden text-center py-6 text-zinc-500 text-[10px] bg-app font-medium">
              No saved projects yet. Go to the Build tab and save your work!
            </div>
          </div>
        </section>
      </div>
    `;

    this.renderPresets();
    this.renderLibrary();
    this.setupListeners();

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  renderPresets() {
    const list = document.getElementById('presets-list');
    if (!list) return;
    const presets = BuilderLibrary.getPresets();

    list.innerHTML = presets.map(preset => {
      // Map icons based on preset name
      let icon = 'server';
      if (preset.name.toLowerCase().includes('eolo')) icon = 'cloud';
      else if (preset.name.toLowerCase().includes('fiber')) icon = 'zap';
      else if (preset.name.toLowerCase().includes('basic') || preset.name.toLowerCase().includes('home')) icon = 'home';

      return `
        <div class="flex items-center justify-between h-9 px-2.5 rounded hover:bg-white/5 transition group" data-preset-id="${preset.id}">
          <div class="flex items-center space-x-2.5 flex-1 min-w-0">
            ${UI_Icons.render(icon, 'w-3.5 h-3.5 text-zinc-400 shrink-0')}
            <span class="font-bold text-white text-xs truncate shrink-0 max-w-[120px]">${preset.name}</span>
            <span class="text-[10px] text-zinc-500 truncate hidden sm:block">${preset.description}</span>
          </div>
          <div class="flex items-center space-x-2 shrink-0">
            <span class="text-[9px] font-mono text-zinc-500">${Object.keys(preset.variables).length}v / ${preset.enabledBlocks.length}b</span>
            <button class="bg-purple-600 hover:bg-purple-700 text-white h-6 px-2.5 rounded text-[11px] font-medium transition active:scale-95" data-preset-id="${preset.id}">
              Load
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-preset-id]').forEach(el => {
      el.addEventListener('click', (e) => {
        const id = el.dataset.presetId;
        const preset = presets.find(p => p.id === id);
        if (preset) {
          this.applyPreset(preset);
        }
      });
    });
  },

  renderLibrary() {
    const list = document.getElementById('library-list');
    const emptyMsg = document.getElementById('empty-library-msg');
    if (!list) return;

    const items = BuilderLibrary.getAll();

    if (items.length === 0) {
      list.classList.add('hidden');
      if (emptyMsg) emptyMsg.classList.remove('hidden');
      return;
    }

    list.classList.remove('hidden');
    if (emptyMsg) emptyMsg.classList.add('hidden');

    list.innerHTML = items.map(item => `
      <div class="flex items-center justify-between h-9 px-2.5 rounded hover:bg-white/5 transition group" data-id="${item.id}">
        <div class="flex items-center space-x-2.5 flex-1 min-w-0">
          ${UI_Icons.render('file-code', 'w-3.5 h-3.5 text-zinc-400 shrink-0')}
          <span class="font-bold text-white text-xs truncate shrink-0 max-w-[140px]">${item.name}</span>
          <span class="text-[9px] text-zinc-500 font-mono hidden sm:block">${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="flex items-center space-x-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button class="btn-load-lib bg-purple-600 hover:bg-purple-700 text-white h-6 px-2.5 rounded text-[11px] font-medium transition active:scale-95" data-id="${item.id}">
            Load
          </button>
          <button class="btn-delete-lib text-zinc-500 hover:text-red-400 transition p-1 hover:bg-red-500/10 rounded h-6 w-6 flex items-center justify-center border border-border" data-id="${item.id}">
            ${UI_Icons.render('trash-2', 'w-3 h-3')}
          </button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.btn-load-lib').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const item = items.find(i => i.id === btn.dataset.id);
        if (item) this.loadProject(item);
      });
    });

    list.querySelectorAll('.btn-delete-lib').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this project?')) {
          BuilderLibrary.delete(btn.dataset.id);
          this.renderLibrary();
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });
  },

  applyPreset(preset) {
    AppState.setCurrentTab('build');
    Router.renderCurrentTab();
    Router.updateActiveTab('build');

    setTimeout(() => {
      if (BuildTab && BuildTab.applyPresetData) {
        BuildTab.applyPresetData(preset);
      }
    }, 100);
  },

  loadProject(project) {
    AppState.setCurrentTab('build');
    Router.renderCurrentTab();
    Router.updateActiveTab('build');

    setTimeout(() => {
      if (BuildTab && BuildTab.loadProjectData) {
        BuildTab.loadProjectData(project);
      }
    }, 100);
  },

  setupListeners() {
    const btnPresets = document.getElementById('btn-toggle-presets');
    const btnLibrary = document.getElementById('btn-toggle-library');

    if (btnPresets) {
      btnPresets.addEventListener('click', () => {
        this.state.presetsExpanded = !this.state.presetsExpanded;
        const container = document.getElementById('presets-container');
        const chevron = document.getElementById('presets-chevron');
        if (container) {
          if (this.state.presetsExpanded) container.classList.remove('hidden');
          else container.classList.add('hidden');
        }
        if (chevron) {
          chevron.innerHTML = UI_Icons.render(this.state.presetsExpanded ? 'chevron-down' : 'chevron-right', 'w-3.5 h-3.5');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    }

    if (btnLibrary) {
      btnLibrary.addEventListener('click', () => {
        this.state.libraryExpanded = !this.state.libraryExpanded;
        const container = document.getElementById('library-container');
        const chevron = document.getElementById('library-chevron');
        if (container) {
          if (this.state.libraryExpanded) container.classList.remove('hidden');
          else container.classList.add('hidden');
        }
        if (chevron) {
          chevron.innerHTML = UI_Icons.render(this.state.libraryExpanded ? 'chevron-down' : 'chevron-right', 'w-3.5 h-3.5');
        }
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
    }
  }
};
