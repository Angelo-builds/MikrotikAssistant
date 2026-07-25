const BlockDragDrop = {
  draggedIndex: null,

  init(container) {
    const blocks = container.querySelectorAll('.block-card');

    blocks.forEach((block, index) => {
      block.draggable = true;
      block.style.cursor = 'grab';

      // Add drag handle if it doesn't already exist
      let dragHandle = block.querySelector('.drag-handle');
      if (!dragHandle) {
        dragHandle = document.createElement('div');
        dragHandle.className = 'drag-handle absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 cursor-grab active:cursor-grabbing';
        dragHandle.innerHTML = '⋮⋮';
        block.style.position = 'relative';
        block.style.paddingLeft = '2.5rem';
        block.appendChild(dragHandle);
      }

      block.addEventListener('dragstart', (e) => {
        this.draggedIndex = index;
        block.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
      });

      block.addEventListener('dragend', () => {
        block.style.opacity = '1';
        this.draggedIndex = null;
        document.querySelectorAll('.block-card').forEach(b => {
          b.classList.remove('drag-over');
        });
      });

      block.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        block.classList.add('drag-over');
      });

      block.addEventListener('dragleave', () => {
        block.classList.remove('drag-over');
      });

      block.addEventListener('drop', (e) => {
        e.preventDefault();
        block.classList.remove('drag-over');

        if (this.draggedIndex !== null && this.draggedIndex !== index) {
          this.reorderBlocks(this.draggedIndex, index);
        }
      });
    });
  },

  reorderBlocks(fromIndex, toIndex) {
    // This will be called by BuildTab
    if (window.BuildTabInstance) {
      window.BuildTabInstance.reorderBlock(fromIndex, toIndex);
    }
  }
};
