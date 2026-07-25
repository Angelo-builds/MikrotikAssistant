const Sidebar = {
  render(container) {
    container.innerHTML = `
      <aside id="sidebar" class="w-64 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
        <nav class="flex-1 p-4 space-y-2">
          <button data-tab="audit" class="tab-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition flex items-center space-x-3 text-gray-300">
            <span class="text-xl">📊</span>
            <span class="font-medium">Audit</span>
          </button>
          <button data-tab="build" class="tab-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition flex items-center space-x-3 text-gray-300">
            <span class="text-xl">🛠️</span>
            <span class="font-medium">Build</span>
          </button>
          <button data-tab="lib" class="tab-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition flex items-center space-x-3 text-gray-300">
            <span class="text-xl">📚</span>
            <span class="font-medium">Library</span>
          </button>
        </nav>
        <div class="p-4 border-t border-gray-700">
          <button data-tab="prefs" class="tab-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-700 transition flex items-center space-x-3 text-gray-300">
            <span class="text-xl">⚙️</span>
            <span class="font-medium">Preferences</span>
          </button>
        </div>
      </aside>
    `;
  }
};
