import { initModals } from './components/modal.js';
import { initTooltips } from './components/tooltips.js';
import { initAlerts } from './components/alerts.js';
import { initMegaMenu } from './components/megaMenu.js';

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initTooltips();
  initAlerts();
  initMegaMenu();
});
