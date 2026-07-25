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

  // Jump to build button
  const jumpBtn = document.getElementById('btn-jump-to-build');
  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      AppState.setCurrentTab('build');
      Router.renderCurrentTab();
      Router.updateActiveTab('build');
    });
  }

  // New session button
  const newSessionBtn = document.getElementById('btn-new-session');
  if (newSessionBtn) {
    newSessionBtn.addEventListener('click', () => {
      if (confirm('Start a new session? Unsaved work will be lost.')) {
        location.reload();
      }
    });
  }

  // Global Escape key handler for modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/80, .fixed.inset-0.bg-black\\\\/80');
      modals.forEach(modal => modal.remove());
    }
  });
});