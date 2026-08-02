/**
 * UI_Icons Helper - Standard Lucide Icon Renderer for components.
 * Returns an <i> element that is automatically transformed into inline SVG by Lucide SDK.
 */
const UI_Icons = {
  render(iconName, classes = '') {
    return `<i data-lucide="${iconName}" class="${classes}"></i>`;
  }
};

window.UI_Icons = UI_Icons;
