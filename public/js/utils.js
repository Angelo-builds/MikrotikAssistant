const Utils = {
  renderMarkdown(text) {
    if (!text) return '';
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-900 px-1 rounded text-xs">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, '<br>');
  },

  extractRouterOsCommands(text) {
    const lines = text.split('\n');
    const commands = [];
    let inCommandBlock = false;

    for (const line of lines) {
      if (line.startsWith('/')) {
        inCommandBlock = true;
        commands.push(line);
      } else if (inCommandBlock && (line.startsWith('add ') || line.startsWith('set ') || line.startsWith('remove '))) {
        commands.push(line);
      } else if (line.trim() === '') {
        inCommandBlock = false;
      }
    }

    return commands.join('\n');
  },

  downloadAsRsc(content, filename = 'config.rsc') {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
};
