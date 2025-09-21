import { initModals } from './components/modal.js';
import { initTooltips } from './components/tooltips.js';
import { initAlerts } from './components/alerts.js';

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initTooltips();
  initAlerts();
});
