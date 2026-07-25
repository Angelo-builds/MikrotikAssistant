const LibTab = {
  render(container) {
    container.innerHTML = `
      <div class="lib-container max-w-6xl mx-auto p-6">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold">Template Library & Presets</h2>
        </div>

        <!-- Presets Section -->
        <section class="mb-10">
          <h3 class="text-xl font-semibold mb-4 text-purple-400">Quick Presets</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4" id="presets-grid">
            <!-- Injected by JS -->
          </div>
        </section>

        <!-- Saved Templates Section -->
        <section>
          <h3 class="text-xl font-semibold mb-4 text-gray-300">Saved Projects</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="library-grid">
            <!-- Injected by JS -->
          </div>
          <div id="empty-library-msg" class="hidden text-center py-12 text-gray-500">
            No saved projects yet. Go to the Build tab and save your work!
          </div>
        </section>
      </div>
    `;

    this.renderPresets();
    this.renderLibrary();
  },

  renderPresets() {
    const grid = document.getElementById('presets-grid');
    const presets = BuilderLibrary.getPresets();

    grid.innerHTML = presets.map(preset => `
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:border-purple-500/50 transition cursor-pointer group" data-preset-id="${preset.id}">
        <div class="flex items-center justify-between mb-2">
          <h4 class="font-bold text-lg group-hover:text-purple-400 transition">${preset.name}</h4>
          <span class="text-xs bg-purple-900/30 text-purple-300 px-2 py-1 rounded">Preset</span>
        </div>
        <p class="text-sm text-gray-400 mb-4 h-10">${preset.description}</p>
        <div class="flex items-center justify-between text-xs text-gray-500">
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
      <div class="bg-gray-800 border border-gray-700 rounded-lg p-5 relative group">
        <button class="btn-delete-lib absolute top-3 right-3 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition" data-id="${item.id}">✕</button>
        <h4 class="font-bold text-lg mb-1 text-white">${item.name}</h4>
        <p class="text-xs text-gray-500 mb-4">${new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</p>

        <div class="flex space-x-2 mt-auto">
          <button class="btn-load-lib flex-1 bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded transition" data-id="${item.id}">Load in Builder</button>
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
        }
      });
    });
  },

  applyPreset(preset) {
    // Switch to build tab
    AppState.setCurrentTab('build');
    Router.renderCurrentTab();
    Router.updateActiveTab('build');

    // Wait for BuildTab to render, then apply
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
