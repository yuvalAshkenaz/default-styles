export function initAlerts() {
  window.showAlert = function(options = {}) {
    const {
      title = 'Alert',
      text = '',
      icon = null,       // 'success', 'error', 'warning'
      confirmText = 'OK',
      cancelText = null
    } = options;

    const lastFocused = document.activeElement;

    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'alert-backdrop';
    document.body.appendChild(backdrop);

    // Dialog
    const dialog = document.createElement('div');
    dialog.className = 'alert-dialog';
    dialog.setAttribute('role', 'alertdialog');
    dialog.setAttribute('aria-modal', 'true');
    
    const headerClass = icon ? `alert-header alert-${icon}` : 'alert-header';

    dialog.innerHTML = `
      <div class="${headerClass}">
        <span class="alert-icon"></span>
        <h2 class="alert-title">${title}</h2>
      </div>
      <div class="alert-body">${text}</div>
      <div class="alert-footer">
        ${cancelText ? `<button class="btn btn-secondary" data-alert-cancel>${cancelText}</button>` : ''}
        <button class="btn btn-primary" data-alert-confirm>${confirmText}</button>
      </div>
    `;
    document.body.appendChild(dialog);

    // Force browser to recognize elements before adding 'open'
    requestAnimationFrame(() => {
      dialog.classList.add('open');
      backdrop.classList.add('open');
    });

    const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    return new Promise(resolve => {
      function closeAlert(result = true) {
        dialog.classList.remove('open');
        backdrop.classList.remove('open');

        setTimeout(() => {
          dialog.remove();
          backdrop.remove();
          document.removeEventListener('keydown', handleKey);
          if (lastFocused) lastFocused.focus();
          resolve(result);
        }, 300); // זמן האנימציה
      }

      function handleKey(e) {
        if (e.key === 'Escape') closeAlert(false);
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
          }
        }
      }

      document.addEventListener('keydown', handleKey);
      dialog.querySelector('[data-alert-confirm]').addEventListener('click', () => closeAlert(true));
      const cancelBtn = dialog.querySelector('[data-alert-cancel]');
      if (cancelBtn) cancelBtn.addEventListener('click', () => closeAlert(false));
      backdrop.addEventListener('click', () => closeAlert(false));

      first.focus();
    });
  };
}