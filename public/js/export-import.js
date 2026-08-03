const ExportImport = {
  startTime: null,

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
    const totalSteps = 2;
    this.startTime = Date.now();

    try {
      const { includeChats, includeBuilds, includeBlocks, includePreferences } = options;

      // Step 1: Gathering data
      this.showDetailedProgress(1, totalSteps, 'Gathering data...', 10);
      await new Promise(r => setTimeout(r, 200));

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
      this.showDetailedProgress(1, totalSteps, 'Processing Chat history...', 40);
      await new Promise(r => setTimeout(r, 150));

      if (includeBuilds) {
        exportData.builds = await this.getBuildProjects();
      }
      this.showDetailedProgress(1, totalSteps, 'Processing Build projects...', 70);
      await new Promise(r => setTimeout(r, 150));

      if (includeBlocks) {
        exportData.customBlocks = await this.getCustomBlocks();
      }

      if (includePreferences) {
        exportData.preferences = this.getPreferences();
      }

      this.showDetailedProgress(1, totalSteps, 'Data gathered successfully!', 100);
      await new Promise(r => setTimeout(r, 250));

      // Step 2: Preparing download
      this.showDetailedProgress(2, totalSteps, 'Preparing download file...', 20);
      await new Promise(r => setTimeout(r, 150));

      // Calculate size
      const jsonString = JSON.stringify(exportData);
      const sizeInMB = (new Blob([jsonString]).size / (1024 * 1024)).toFixed(2);

      this.showDetailedProgress(2, totalSteps, 'Checking file size...', 60);

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
          if (!confirmed) {
            this.showDetailedProgress(2, totalSteps, 'Export cancelled.', 100);
            return;
          }
        } else {
          const confirmed = confirm(`Export size is ${sizeInMB}MB. This may take a while to process. Continue?`);
          if (!confirmed) {
            this.showDetailedProgress(2, totalSteps, 'Export cancelled.', 100);
            return;
          }
        }
      }

      this.showDetailedProgress(2, totalSteps, 'Triggering file save...', 90);
      await new Promise(r => setTimeout(r, 150));

      // Download file
      this.downloadFile(jsonString, `mikrotik-assistant-export-${Date.now()}.json`);
      this.showDetailedProgress(2, totalSteps, 'Download completed!', 100);
    } catch (error) {
      this.showDetailedProgress(2, 2, `Export failed: ${error.message}`, 100);
      if (typeof showGlobalToast === 'function') {
        showGlobalToast(`Export failed: ${error.message}`, 'error');
      } else {
        alert(`Export failed: ${error.message}`);
      }
    }
  },

  // Import data with progress
  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      this.startTime = Date.now();
      this.showDetailedProgress(1, 4, 'Reading file...', 0);

      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = (e.loaded / e.total) * 100;
          this.showDetailedProgress(1, 4, 'Reading file...', percent);
        }
      };

      reader.onload = async (e) => {
        try {
          let data;
          try {
            data = JSON.parse(e.target.result);
          } catch (jsonErr) {
            throw new Error('Invalid JSON file format');
          }

          // Validate structure
          if (!data.version || !data.metadata) {
            throw new Error('Invalid export file format: missing version or metadata');
          }

          // Import with progress
          await this.processImport(data);
          resolve();
        } catch (error) {
          // Clean up progress modal on error
          const modal = document.getElementById('progress-modal');
          if (modal) modal.remove();
          this.startTime = null;

          reject(error);
        }
      };

      reader.onerror = () => {
        const modal = document.getElementById('progress-modal');
        if (modal) modal.remove();
        this.startTime = null;
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  },

  // Merging Strategy Implementation with 4 step visualized progression
  async processImport(data) {
    const totalSteps = 4;

    // Reset timer specifically for import progression
    this.startTime = Date.now();

    // Step 1: Import Chats
    this.showDetailedProgress(1, totalSteps, 'Importing Chats...', 10);
    await new Promise(r => setTimeout(r, 200));
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
    this.showDetailedProgress(1, totalSteps, 'Chats imported successfully!', 100);
    await new Promise(r => setTimeout(r, 200));

    // Step 2: Import Build Projects
    this.showDetailedProgress(2, totalSteps, 'Importing Build Projects...', 10);
    await new Promise(r => setTimeout(r, 200));
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
    this.showDetailedProgress(2, totalSteps, 'Build projects imported successfully!', 100);
    await new Promise(r => setTimeout(r, 200));

    // Step 3: Import Custom Blocks / Templates
    this.showDetailedProgress(3, totalSteps, 'Importing Custom Blocks...', 10);
    await new Promise(r => setTimeout(r, 200));
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
    this.showDetailedProgress(3, totalSteps, 'Custom blocks imported successfully!', 100);
    await new Promise(r => setTimeout(r, 200));

    // Step 4: Import Preferences
    this.showDetailedProgress(4, totalSteps, 'Importing Preferences...', 10);
    await new Promise(r => setTimeout(r, 200));
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
    this.showDetailedProgress(4, totalSteps, 'Import completed successfully!', 100);
    await new Promise(r => setTimeout(r, 500));
  },

  // Backwards compatibility for showProgress or simple usage
  showProgress(percent, message) {
    this.showDetailedProgress(1, 1, message, percent);
  },

  showDetailedProgress(step, totalSteps, message, percent) {
    let modal = document.getElementById('progress-modal');

    if (!modal) {
      const newModal = document.createElement('div');
      newModal.id = 'progress-modal';
      newModal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
      newModal.innerHTML = `
        <div class="bg-surface border border-border-subtle rounded-lg p-6 max-w-md w-full animate-apple-reveal">
          <h3 class="text-sm font-semibold text-zinc-800 dark:text-zinc-100 mb-4">Processing...</h3>

          <!-- Step Indicator -->
          <div class="flex items-center justify-between mb-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span>Step <span class="current-step">1</span> of <span class="total-steps">3</span></span>
            <span class="percent-text">0%</span>
          </div>

          <!-- Progress Bar -->
          <div class="w-full h-2 bg-elevated rounded-full overflow-hidden mb-3">
            <div class="progress-bar h-full bg-indigo-500 transition-all duration-300" style="width: 0%"></div>
          </div>

          <!-- Status Message -->
          <p class="text-xs text-zinc-600 dark:text-zinc-400 status-message">Initializing...</p>

          <!-- ETA (if applicable) -->
          <div class="mt-2 text-[10px] text-zinc-400 dark:text-zinc-500 eta-text"></div>
        </div>
      `;
      document.body.appendChild(newModal);
      modal = newModal;
    }

    const progressBar = modal.querySelector('.progress-bar');
    const statusText = modal.querySelector('.status-message');
    const currentStep = modal.querySelector('.current-step');
    const totalStepsEl = modal.querySelector('.total-steps');
    const percentText = modal.querySelector('.percent-text');
    const etaText = modal.querySelector('.eta-text');

    progressBar.style.width = `${percent}%`;
    statusText.textContent = message;
    currentStep.textContent = step;
    totalStepsEl.textContent = totalSteps;
    percentText.textContent = `${Math.round(percent)}%`;

    // Calculate ETA
    if (this.startTime) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const total = elapsed / (percent / 100);
      const remaining = total - elapsed;
      if (remaining > 0 && percent > 0) {
        etaText.textContent = `~${Math.ceil(remaining)}s remaining`;
      } else {
        etaText.textContent = '';
      }
    } else {
      this.startTime = Date.now();
    }

    // Close only when the final step reaches 100%
    if (step === totalSteps && percent >= 100) {
      setTimeout(() => {
        modal.style.transition = 'opacity 300ms ease';
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.remove();
          this.startTime = null;
        }, 300);
      }, 500);
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
