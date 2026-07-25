document.addEventListener('DOMContentLoaded', () => {
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
});
