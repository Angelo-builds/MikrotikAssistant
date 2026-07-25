const DiffViewer = {
  render(container, differences) {
    container.innerHTML = `
      <div class="diff-viewer bg-gray-900 border border-gray-700 rounded-lg p-4">
        <h3 class="font-bold text-lg mb-4 text-purple-400">Configuration Differences</h3>

        ${differences.added.length > 0 ? `
          <div class="mb-4">
            <h4 class="text-sm font-medium text-green-400 mb-2 font-semibold">Added Lines (${differences.added.length})</h4>
            <div class="space-y-1 max-h-60 overflow-y-auto">
              ${differences.added.map(line => `
                <div class="bg-green-900/20 border-l-4 border-green-500 px-3 py-2 text-xs font-mono text-green-300 whitespace-pre">+ ${line}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${differences.removed.length > 0 ? `
          <div class="mb-4">
            <h4 class="text-sm font-medium text-red-400 mb-2 font-semibold">Removed Lines (${differences.removed.length})</h4>
            <div class="space-y-1 max-h-60 overflow-y-auto">
              ${differences.removed.map(line => `
                <div class="bg-red-900/20 border-l-4 border-red-500 px-3 py-2 text-xs font-mono text-red-300 whitespace-pre">- ${line}</div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${differences.added.length === 0 && differences.removed.length === 0 ? `
          <div class="text-center py-8 text-gray-500">
            No differences found - configurations are identical
          </div>
        ` : ''}
      </div>
    `;
  }
};