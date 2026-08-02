const PromptModal = {
  show(options) {
    return new Promise((resolve) => {
      const { title, message, placeholder = '', defaultValue = '', confirmText = 'Confirm', cancelText = 'Cancel' } = options;

      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4';
      modal.innerHTML = `
        <div class="bg-surface border border-border-subtle rounded-lg shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
          <div class="p-4 border-b border-border-subtle">
            <h3 class="text-sm font-semibold text-zinc-100">${title}</h3>
          </div>
          <div class="p-4">
            <p class="text-xs text-zinc-400 mb-3">${message}</p>
            <input
              type="text"
              id="prompt-input"
              value="${defaultValue}"
              placeholder="${placeholder}"
              class="w-full bg-elevated border border-border-subtle rounded-md px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
            />
          </div>
          <div class="p-4 border-t border-border-subtle flex justify-end space-x-2">
            <button class="btn-cancel px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition">${cancelText}</button>
            <button class="btn-confirm px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition">${confirmText}</button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      const input = modal.querySelector('#prompt-input');
      input.focus();
      input.select();

      const close = (value) => {
        modal.style.transition = 'opacity 150ms ease';
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.remove();
          resolve(value);
        }, 150);
      };

      modal.querySelector('.btn-cancel').addEventListener('click', () => close(null));
      modal.querySelector('.btn-confirm').addEventListener('click', () => close(input.value.trim()));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') close(input.value.trim());
        if (e.key === 'Escape') close(null);
      });
      modal.addEventListener('click', (e) => {
        if (e.target === modal) close(null);
      });
    });
  }
};
