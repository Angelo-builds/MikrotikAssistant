document.addEventListener('DOMContentLoaded', () => {
  // Initialize Monaco Editor loader
  if (typeof require !== 'undefined' && require.config) {
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});
  }

  // Render layout shell elements
  const headerContainer = document.getElementById('header-container');
  const sidebarContainer = document.getElementById('sidebar-container');

  if (headerContainer) {
    Header.render(headerContainer);
  }

  if (sidebarContainer) {
    Sidebar.render(sidebarContainer);
  }

  Router.init();

  // Make sure the active tab has proper bg styling on load
  if (typeof AppState !== 'undefined' && AppState.currentTab) {
    Router.updateActiveTab(AppState.currentTab);
  }

  // Make BuildTab instance globally accessible for drag & drop
  if (typeof BuildTab !== 'undefined') {
    window.BuildTabInstance = BuildTab;
  }

  // Create toast notifications system container
  const toastContainer = document.createElement('div');
  toastContainer.id = 'toast-container';
  toastContainer.className = 'fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none';
  document.body.appendChild(toastContainer);

  // Expose global non-intrusive toast notification system
  window.showGlobalToast = (message, type = 'success') => {
    const toast = document.createElement('div');
    toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-gray-900 border-gray-700 text-gray-100 min-w-[280px] max-w-[400px]';

    if (type === 'success') {
      toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-emerald-950 border-emerald-500 text-emerald-200 min-w-[280px] max-w-[400px]';
      toast.innerHTML = `
        <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
        <span class="text-xs font-semibold">${message}</span>
      `;
    } else if (type === 'error') {
      toast.className = 'p-3 rounded-xl border flex items-center space-x-2.5 shadow-xl transition-all duration-300 transform translate-y-2 opacity-0 select-text z-50 pointer-events-auto bg-red-950 border-red-500 text-red-200 min-w-[280px] max-w-[400px]';
      toast.innerHTML = `
        <i data-lucide="alert-triangle" class="w-4 h-4 text-red-400"></i>
        <span class="text-xs font-semibold">${message}</span>
      `;
    } else {
      toast.innerHTML = `
        <i data-lucide="info" class="w-4 h-4 text-purple-400"></i>
        <span class="text-xs font-semibold">${message}</span>
      `;
    }

    toastContainer.appendChild(toast);
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  };

  // Global Escape key handler for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/80, .fixed.inset-0.bg-black\\\\/80, .fixed.inset-0.bg-black\\/85, .fixed.inset-0.bg-black\\/70');
      modals.forEach(modal => modal.remove());
    }
  });
});
