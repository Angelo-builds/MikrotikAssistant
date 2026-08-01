const LibTab = {
  render(container) {
    container.innerHTML = `
      <div class="lib-container max-w-6xl mx-auto p-6 space-y-8 select-none">
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-primary flex items-center">
            ${UI_Icons.render('library', 'mr-2 text-purple-500 w-5 h-5')}
            Template Library & Presets
          </h2>
        </div>

        <!-- Presets Section -->
        <section class="mb-10">
          <h3 class="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center">
            ${UI_Icons.render('activity', 'mr-2 w-4 h-4 text-purple-500')}
            Quick Presets
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="presets-grid">
            <!-- Injected by JS -->
          </div>
        </section>

        <!-- Saved Templates Section -->
        <section>
          <h3 class="text-xs font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center">
            ${UI_Icons.render('folder-open', 'mr-2 w-4 h-4 text-purple-500')}
            Saved Projects
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="library-grid">
            <!-- Injected by JS -->
          </div>
          <div id="empty-library-msg" class="hidden text-center py-12 text-text-muted text-xs bg-surface border border-border rounded-lg">
            No saved projects yet. Go to the Build tab and save your work!
          </div>
        </section>
      </div>
    `;

    this.renderPresets();
    this.renderLibrary();

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  },

  renderPresets() {
    const grid = document.getElementById('presets-grid');
    const presets = BuilderLibrary.getPresets();

    grid.innerHTML = presets.map(preset => `
      <div class="bg-surface border border-border rounded-lg p-5 hover:border-purple-500/50 hover:shadow-md transition cursor-pointer group" data-preset-id="${preset.id}">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-semibold text-sm text-primary group-hover:text-purple-400 transition">${preset.name}</h4>
          <span class="text-[10px] bg-purple-900/10 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded-full font-bold">Preset</span>
        </div>
        <p class="text-xs text-secondary mb-4 h-10 leading-relaxed line-clamp-2">${preset.description}</p>
        <div class="flex items-center justify-between text-[11px] text-text-muted font-mono pt-2 border-t border-border/40">
          <span>${Object.keys(preset.variables).length} vars</span>
          <span>${preset.enabledBlocks.length} blocks</span>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-preset-id]').forEach(card => {
      card.addEventListener('click', () => {
        const preset = presets.find(p => p.id === card.dataset.presetId);
        this.applyPreset(preset);
      });
    });
  },

  renderLibrary() {
    const grid = document.getElementById('library-grid');
    const emptyMsg = document.getElementById('empty-library-msg');
    const items = BuilderLibrary.getAll();

    if (items.length === 0) {
      grid.classList.add('hidden');
      emptyMsg.classList.remove('hidden');
      return;
    }

    grid.classList.remove('hidden');
    emptyMsg.classList.add('hidden');

    grid.innerHTML = items.map(item => `
      <div class="bg-surface border border-border rounded-lg p-5 relative group flex flex-col">
        <button class="btn-delete-lib absolute top-4 right-4 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded-md" data-id="${item.id}">
          ${UI_Icons.render('trash-2', 'w-4 h-4')}
        </button>
        <h4 class="font-semibold text-sm mb-1 text-primary">${item.name}</h4>
        <p class="text-[11px] text-text-muted mb-4 font-mono">${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>

        <div class="flex space-x-2 mt-auto pt-2 border-t border-border/40">
          <button class="btn-load-lib flex-1 h-8 bg-purple-600 hover:bg-purple-700 text-xs text-white rounded-md font-medium transition active:scale-95" data-id="${item.id}">Load in Builder</button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-load-lib').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = items.find(i => i.id === btn.dataset.id);
        this.loadProject(item);
      });
    });

    grid.querySelectorAll('.btn-delete-lib').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if(confirm('Delete this project?')) {
          BuilderLibrary.delete(btn.dataset.id);
          this.renderLibrary();
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }
      });
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
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
  }
};
