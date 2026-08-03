const ExportImport = {
  // Get chat history count and list
  async getChatHistory() {
    const data = localStorage.getItem('mikrotik_chatbot_history');
    return data ? JSON.parse(data) : [];
  },

  // Get build projects
  async getBuildProjects() {
    const data = localStorage.getItem('builder-projects');
    return data ? JSON.parse(data) : [];
  },

  // Get custom blocks/templates from library
  async getCustomBlocks() {
    const data = localStorage.getItem('mikrotik-assistant-library');
    return data ? JSON.parse(data) : [];
  },

  // Get preferences
  getPreferences() {
    if (typeof AppState !== 'undefined') {
      return {
        preferences: AppState.preferences,
        theme: AppState.theme
      };
    }
    return {};
  },

  // Export selected data
  async exportData(options) {
    const { includeChats, includeBuilds, includeBlocks, includePreferences } = options;

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      metadata: {
        appName: 'MikrotikAssistant',
        exportType: 'partial'
      }
    };

    if (includeChats) {
      exportData.chats = await this.getChatHistory();
    }

    if (includeBuilds) {
      exportData.builds = await this.getBuildProjects();
    }

    if (includeBlocks) {
      exportData.customBlocks = await this.getCustomBlocks();
    }

    if (includePreferences) {
      exportData.preferences = this.getPreferences();
    }

    // Calculate size
    const jsonString = JSON.stringify(exportData);
    const sizeInMB = (new Blob([jsonString]).size / (1024 * 1024)).toFixed(2);

    // Max size warning (10MB)
    if (sizeInMB > 10) {
      if (typeof PromptModal !== 'undefined') {
        const confirmed = await PromptModal.show({
          title: 'Large Export Warning',
          message: `Export size is ${sizeInMB}MB. This may take a while to process. Continue?`,
          confirmText: 'Continue',
          cancelText: 'Cancel',
          type: 'warning'
        });
        if (!confirmed) return;
      } else {
        const confirmed = confirm(`Export size is ${sizeInMB}MB. This may take a while to process. Continue?`);
        if (!confirmed) return;
      }
    }

    // Download file
    this.downloadFile(jsonString, `mikrotik-assistant-export-${Date.now()}.json`);
  },

  // Import data with progress
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          this.showProgress(percent, 'Reading file...');
        }
      };

      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);

          // Validate structure
          if (!data.version || !data.metadata) {
            throw new Error('Invalid export file format');
          }

          // Import with progress
          await this.processImport(data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  },

  // Merging Strategy Implementation
  async processImport(data) {
    let currentStep = 0;
    const totalSteps = 4;
    const updateLocalStep = (stepName) => {
      currentStep++;
      const percent = (currentStep / totalSteps) * 100;
      this.showProgress(percent, `Importing ${stepName}...`);
    };

    // 1. Import Chats (Merge by appending with unique IDs)
    if (data.chats && Array.isArray(data.chats)) {
      const existingChats = await this.getChatHistory();
      const existingIds = new Set(existingChats.map(c => String(c.id)));

      data.chats.forEach(importedChat => {
        let chatToInsert = { ...importedChat };
        if (existingIds.has(String(chatToInsert.id))) {
          chatToInsert.id = `${chatToInsert.id}-imported-${Date.now()}`;
        }
        existingChats.push(chatToInsert);
      });
      localStorage.setItem('mikrotik_chatbot_history', JSON.stringify(existingChats));
    }
    updateLocalStep('Chats');

    // 2. Import Build Projects (Merge by appending with unique IDs)
    if (data.builds && Array.isArray(data.builds)) {
      const existingProjects = await this.getBuildProjects();
      const existingIds = new Set(existingProjects.map(p => String(p.id)));

      data.builds.forEach(importedProject => {
        let projToInsert = { ...importedProject };
        if (existingIds.has(String(projToInsert.id))) {
          projToInsert.id = `${projToInsert.id}-imported-${Date.now()}`;
        }
        existingProjects.push(projToInsert);
      });
      localStorage.setItem('builder-projects', JSON.stringify(existingProjects));
    }
    updateLocalStep('Build Projects');

    // 3. Import Custom Blocks / Templates (Merge by appending with unique IDs)
    if (data.customBlocks && Array.isArray(data.customBlocks)) {
      const existingBlocks = await this.getCustomBlocks();
      const existingIds = new Set(existingBlocks.map(b => String(b.id)));

      data.customBlocks.forEach(importedBlock => {
        let blockToInsert = { ...importedBlock };
        if (existingIds.has(String(blockToInsert.id))) {
          blockToInsert.id = `${blockToInsert.id}-imported-${Date.now()}`;
        }
        existingBlocks.push(blockToInsert);
      });
      localStorage.setItem('mikrotik-assistant-library', JSON.stringify(existingBlocks));
    }
    updateLocalStep('Custom Blocks');

    // 4. Import Preferences (Key-level merge strategy)
    if (data.preferences) {
      if (typeof AppState !== 'undefined') {
        if (data.preferences.preferences) {
          AppState.preferences = {
            ...AppState.preferences,
            ...data.preferences.preferences,
            privacyShields: {
              ...(AppState.preferences.privacyShields || {}),
              ...(data.preferences.preferences.privacyShields || {})
            }
          };
        }
        if (data.preferences.theme) {
          AppState.theme = data.preferences.theme;
          localStorage.setItem('mikrotik-assistant-theme', AppState.theme);
        }
        AppState.save();
      }
    }
    updateLocalStep('Preferences');

    // Ensure loader cleanup
    this.showProgress(100, 'Import completed successfully!');
    await new Promise(r => setTimeout(r, 600));
  },

  showProgress(percent, message) {
    // Show/update progress modal
    let modal = document.getElementById('import-progress-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'import-progress-modal';
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-surface border border-border-subtle rounded-lg p-6 max-w-md w-full">
          <h3 class="text-sm font-semibold text-zinc-100 mb-4">Importing Data...</h3>
          <div class="w-full h-2 bg-elevated rounded-full overflow-hidden mb-2">
            <div class="progress-bar h-full bg-indigo-500 transition-all duration-300" style="width: 0%"></div>
          </div>
          <p class="text-xs text-zinc-400">Reading file...</p>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const progressBar = modal.querySelector('.progress-bar');
    const statusText = modal.querySelector('p');
    progressBar.style.width = `${percent}%`;
    statusText.textContent = message;

    if (percent >= 100) {
      setTimeout(() => modal.remove(), 500);
    }
  },

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportImport;
}
