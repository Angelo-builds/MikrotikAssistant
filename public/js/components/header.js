const Header = {
  render(container) {
    container.innerHTML = `
      <header id="app-header" class="bg-surface border-b border-border h-12 px-4 flex items-center justify-between select-none">
        <div class="flex items-center space-x-2">
          ${UI_Icons.render('terminal', 'text-purple-600 w-4 h-4')}
          <h1 class="text-xs font-bold text-primary">Mik the Winbox Wizard</h1>
          <span id="privacy-badge" title="Privacy Shield Active" class="text-green-700 bg-green-100 border border-green-300 dark:text-green-400 dark:bg-green-950/40 dark:border-green-500/20 px-1.5 py-0.5 rounded text-[10px] inline-flex items-center justify-center">
            ${UI_Icons.render('shield', 'w-3 h-3')}
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button id="btn-jump-to-build" title="Builder" class="btn-secondary w-7 h-7 p-0 flex items-center justify-center hover:bg-white/5 text-secondary rounded-md transition active:scale-95">
            ${UI_Icons.render('hammer', 'w-3.5 h-3.5')}
          </button>
          <button id="btn-new-session" class="bg-purple-600 hover:bg-purple-700 text-white h-7 px-2.5 rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition active:scale-95">
            ${UI_Icons.render('plus', 'w-3 h-3 mr-1')}
            <span>New Session</span>
          </button>
        </div>
      </header>
    `;

    document.getElementById('btn-jump-to-build').addEventListener('click', () => {
      AppState.setCurrentTab('build');
      Router.renderCurrentTab();
      Router.updateActiveTab('build');
    });

    document.getElementById('btn-new-session').addEventListener('click', async () => {
      if (typeof PromptModal !== 'undefined') {
        const confirmed = await PromptModal.show({
          title: 'Start New Session',
          message: 'This will clear your current chat history. Unsaved work will be lost.',
          confirmText: 'New Session',
          cancelText: 'Cancel',
          type: 'warning'
        });

        if (confirmed) {
          location.reload();
        }
      } else {
        if (confirm('Start a new session? Unsaved work will be lost.')) {
          location.reload();
        }
      }
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
};
