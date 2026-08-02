const Sidebar = {
  render(container) {
    container.innerHTML = `
      <aside id="sidebar" class="w-[200px] bg-surface border-r border-border flex flex-col h-full">
        <nav class="flex-1 p-2 space-y-1">
          <button data-tab="audit" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('shield-check', 'w-3.5 h-3.5 mr-2 text-zinc-400')}
            <span>Audit</span>
          </button>
          <button data-tab="build" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('hammer', 'w-3.5 h-3.5 mr-2 text-zinc-400')}
            <span>Build</span>
          </button>
          <button data-tab="lib" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('library', 'w-3.5 h-3.5 mr-2 text-zinc-400')}
            <span>Library</span>
          </button>
        </nav>
        <div class="p-2 border-t border-border">
          <button data-tab="prefs" class="tab-btn w-full text-left h-8 px-2.5 rounded-md text-xs font-medium text-secondary flex items-center transition-colors border-l-2 border-transparent hover:bg-white/5">
            ${UI_Icons.render('settings', 'w-3.5 h-3.5 mr-2 text-zinc-400')}
            <span>Preferences</span>
          </button>
        </div>
      </aside>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
};
