const MonacoIntegration = {
  editor: null,
  container: null,

  async init(containerElement, initialContent = '') {
    this.container = containerElement;

    // Configure Monaco loader
    require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' }});

    return new Promise((resolve) => {
      require(['vs/editor/editor.main'], () => {
        // Define custom RouterOS language with double registration check
        if (!monaco.languages.getLanguages().some(l => l.id === 'routeros')) {
          monaco.languages.register({ id: 'routeros' });

          monaco.languages.setMonarchTokensProvider('routeros', {
            tokenizer: {
              root: [
                [/^\/[\w\s-]+/, 'keyword'],
                [/add|set|remove|move/, 'type'],
                [/[a-z-]+=/, 'attribute'],
                [/"[^"]*"/, 'string'],
                [/\{\{[\w]+\}\}/, 'variable'],
                [/#.*/, 'comment'],
                [/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/?\d*/, 'number'],
              ]
            }
          });

          monaco.editor.defineTheme('mikrotik-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'keyword', foreground: 'C586C0', fontStyle: 'bold' },
              { token: 'type', foreground: '569CD6' },
              { token: 'attribute', foreground: '9CDCFE' },
              { token: 'string', foreground: 'CE9178' },
              { token: 'variable', foreground: 'DCDCAA', fontStyle: 'bold' },
              { token: 'comment', foreground: '6A9955' },
              { token: 'number', foreground: 'B5CEA8' },
            ],
            colors: {
              'editor.background': '#1a1a2e',
              'editor.foreground': '#d4d4d4',
              'editor.lineHighlightBackground': '#2a2a3e',
            }
          });
        }

        let resolvedTheme = AppState.theme;
        if (resolvedTheme === 'system') {
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            resolvedTheme = 'light';
          } else {
            resolvedTheme = 'dark';
          }
        }
        const initialTheme = resolvedTheme === 'light' ? 'vs' : 'mikrotik-dark';

        this.editor = monaco.editor.create(containerElement, {
          value: initialContent,
          language: 'routeros',
          theme: initialTheme,
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: true,
          folding: true,
          wordWrap: 'off',
          tabSize: 2,
          renderWhitespace: 'selection',
        });

        resolve(this.editor);
      });
    });
  },

  getContent() {
    return this.editor ? this.editor.getValue() : '';
  },

  setContent(content) {
    if (this.editor) {
      this.editor.setValue(content);
    }
  },

  dispose() {
    if (this.editor) {
      this.editor.dispose();
      this.editor = null;
    }
  }
};
