const Header = {
  render(container) {
    container.innerHTML = `
      <header id="app-header" class="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <h1 class="text-xl font-bold text-white">Mik the Winbox Wizard</h1>
          <span class="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">Privacy Shield Active</span>
        </div>
        <button id="btn-new-session" class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition active:scale-95">
          + New Session
        </button>
      </header>
    `;

    document.getElementById('btn-new-session').addEventListener('click', () => {
      alert('New session initialized!');
    });
  }
};
