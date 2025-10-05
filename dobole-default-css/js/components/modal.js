export function initModals() {
  const triggers = document.querySelectorAll('[data-modal-target]');
  let activeModal = null;
  let activeTrigger = null;

  const openModal = (modal, trigger) => {
    activeModal = modal;
    activeTrigger = trigger;

    const backdrop = modal.previousElementSibling;
    backdrop.classList.add('show');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');

    // Remove inert/tabindex for focusable elements
    const focusable = modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable.forEach(el => el.removeAttribute('tabindex'));
    modal.inert = false; // modern browsers

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    firstEl.focus();

    const trapFocus = e => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      } else if (e.key === 'Escape') {
        closeModal();
      }
    };

    modal.addEventListener('keydown', trapFocus);
    modal._trapFocusHandler = trapFocus;

    // Close buttons
    modal.querySelectorAll('.close-btn').forEach(btn =>
      btn.addEventListener('click', closeModal)
    );

    // Click backdrop
    backdrop.addEventListener('click', closeModal);
  };

  const closeModal = () => {
    if (!activeModal) return;

    const modal = activeModal;
    const backdrop = modal.previousElementSibling;

    backdrop.classList.remove('show');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');

    // Set inert/tabindex to prevent focus
    const focusable = modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable.forEach(el => el.setAttribute('tabindex', '-1'));
    modal.inert = true; // modern browsers

    // Remove trap focus listener
    modal.removeEventListener('keydown', modal._trapFocusHandler);

    // Restore focus to original trigger
    if (activeTrigger) activeTrigger.focus();

    activeModal = null;
    activeTrigger = null;
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector(btn.dataset.modalTarget);
      openModal(target, btn);
    });
  });

  // Initially set all modals as inert
  document.querySelectorAll('.modal').forEach(modal => {
    modal.inert = true;
    const focusable = modal.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable.forEach(el => el.setAttribute('tabindex', '-1'));
  });
};