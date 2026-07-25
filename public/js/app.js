document.addEventListener('DOMContentLoaded', () => {
  // Initialize Monaco Editor loader config if require is defined
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

  // Initialize router for tab navigation
  Router.init();

  // Make sure the active tab has proper bg styling on load
  Router.updateActiveTab(AppState.currentTab);

  // Make BuildTab instance globally accessible for drag & drop
  if (typeof BuildTab !== 'undefined') {
    window.BuildTabInstance = BuildTab;
  }
});
