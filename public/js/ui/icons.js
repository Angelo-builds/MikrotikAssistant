/**
 * Icons Utility - Redesigned Icon Refresh Engine wrapping Lucide
 * Ensures dynamic DOM insertions/changes refresh icon definitions safely.
 */
const Icons = {
  refreshIcons() {
    if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    } else {
      console.warn('Lucide SDK not available yet. Retrying icon generation after delay...');
      setTimeout(() => {
        if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
          lucide.createIcons();
        }
      }, 300);
    }
  }
};

// Expose globally
window.refreshIcons = Icons.refreshIcons;
