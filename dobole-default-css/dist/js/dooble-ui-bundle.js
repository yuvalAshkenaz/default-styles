(() => {
  // js/components/modal.js
  function initModals() {
    const triggers = document.querySelectorAll("[data-modal-target]");
    let activeModal = null;
    let activeTrigger = null;
    const openModal = (modal, trigger) => {
      activeModal = modal;
      activeTrigger = trigger;
      const backdrop = modal.previousElementSibling;
      backdrop.classList.add("show");
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      const focusable = modal.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      focusable.forEach((el) => el.removeAttribute("tabindex"));
      modal.inert = false;
      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];
      firstEl.focus();
      const trapFocus = (e) => {
        if (e.key === "Tab") {
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
        } else if (e.key === "Escape") {
          closeModal();
        }
      };
      modal.addEventListener("keydown", trapFocus);
      modal._trapFocusHandler = trapFocus;
      modal.querySelectorAll(".close-btn").forEach(
        (btn) => btn.addEventListener("click", closeModal)
      );
      backdrop.addEventListener("click", closeModal);
    };
    const closeModal = () => {
      if (!activeModal) return;
      const modal = activeModal;
      const backdrop = modal.previousElementSibling;
      backdrop.classList.remove("show");
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      const focusable = modal.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      focusable.forEach((el) => el.setAttribute("tabindex", "-1"));
      modal.inert = true;
      modal.removeEventListener("keydown", modal._trapFocusHandler);
      if (activeTrigger) activeTrigger.focus();
      activeModal = null;
      activeTrigger = null;
    };
    triggers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = document.querySelector(btn.dataset.modalTarget);
        openModal(target, btn);
      });
    });
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.inert = true;
      const focusable = modal.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
      );
      focusable.forEach((el) => el.setAttribute("tabindex", "-1"));
    });
  }

  // js/components/tooltips.js
  function initTooltips() {
    const triggers = document.querySelectorAll("[data-tooltip]");
    triggers.forEach((trigger) => {
      trigger.addEventListener("mouseenter", () => showTooltip(trigger));
      trigger.addEventListener("focus", () => showTooltip(trigger));
      trigger.addEventListener("mouseleave", hideTooltip);
      trigger.addEventListener("blur", hideTooltip);
    });
  }
  function showTooltip(el) {
    const text = el.getAttribute("data-tooltip");
    const placement = el.getAttribute("data-tooltip-placement") || "top";
    const tooltip = document.createElement("div");
    tooltip.className = `tooltip tooltip-${placement}`;
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    positionTooltip(el, tooltip, placement);
    tooltip.classList.add("show");
  }
  function hideTooltip() {
    document.querySelectorAll(".tooltip").forEach((t) => t.remove());
  }
  function positionTooltip(el, tooltip, placement) {
    const rect = el.getBoundingClientRect();
    const ttRect = tooltip.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;
    let top, left;
    switch (placement) {
      case "bottom":
        top = rect.bottom + 8 + scrollY;
        left = rect.left + rect.width / 2 - ttRect.width / 2 + scrollX;
        break;
      case "start":
        top = rect.top + rect.height / 2 - ttRect.height / 2 + scrollY;
        left = rect.left - ttRect.width - 8 + scrollX;
        break;
      case "end":
        top = rect.top + rect.height / 2 - ttRect.height / 2 + scrollY;
        left = rect.right + 8 + scrollX;
        break;
      default:
        top = rect.top - ttRect.height - 8 + scrollY;
        left = rect.left + rect.width / 2 - ttRect.width / 2 + scrollX;
    }
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }

  // js/components/alerts.js
  function initAlerts() {
    window.showAlert = function(options = {}) {
      const {
        title = "Alert",
        text = "",
        icon = null,
        // 'success', 'error', 'warning'
        confirmText = "OK",
        cancelText = null
      } = options;
      const lastFocused = document.activeElement;
      const backdrop = document.createElement("div");
      backdrop.className = "alert-backdrop";
      document.body.appendChild(backdrop);
      const dialog = document.createElement("div");
      dialog.className = "alert-dialog";
      dialog.setAttribute("role", "alertdialog");
      dialog.setAttribute("aria-modal", "true");
      const headerClass = icon ? `alert-header alert-${icon}` : "alert-header";
      dialog.innerHTML = `
      <div class="${headerClass}">
        <span class="alert-icon"></span>
        <h2 class="alert-title">${title}</h2>
      </div>
      <div class="alert-body">${text}</div>
      <div class="alert-footer">
        ${cancelText ? `<button class="btn btn-secondary" data-alert-cancel>${cancelText}</button>` : ""}
        <button class="btn btn-primary" data-alert-confirm>${confirmText}</button>
      </div>
    `;
      document.body.appendChild(dialog);
      requestAnimationFrame(() => {
        dialog.classList.add("open");
        backdrop.classList.add("open");
      });
      const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      return new Promise((resolve) => {
        function closeAlert(result = true) {
          dialog.classList.remove("open");
          backdrop.classList.remove("open");
          setTimeout(() => {
            dialog.remove();
            backdrop.remove();
            document.removeEventListener("keydown", handleKey);
            if (lastFocused) lastFocused.focus();
            resolve(result);
          }, 300);
        }
        function handleKey(e) {
          if (e.key === "Escape") closeAlert(false);
          if (e.key === "Tab") {
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
        document.addEventListener("keydown", handleKey);
        dialog.querySelector("[data-alert-confirm]").addEventListener("click", () => closeAlert(true));
        const cancelBtn = dialog.querySelector("[data-alert-cancel]");
        if (cancelBtn) cancelBtn.addEventListener("click", () => closeAlert(false));
        backdrop.addEventListener("click", () => closeAlert(false));
        first.focus();
      });
    };
  }

  // js/components/megaMenu.js
  function initMegaMenu() {
    const menuItems = document.querySelectorAll('.mega-menu > li > a[aria-haspopup="true"]');
    menuItems.forEach((item) => {
      const dropdown = item.nextElementSibling;
      if (!dropdown) return;
      item.setAttribute("aria-expanded", "false");
      dropdown.style.display = "none";
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = item.getAttribute("aria-expanded") === "true";
        item.setAttribute("aria-expanded", String(!isOpen));
        dropdown.style.display = !isOpen ? "block" : "none";
        if (!isOpen) dropdown.querySelector("a")?.focus();
      });
      item.addEventListener("keydown", (e) => {
        const links = dropdown.querySelectorAll("a");
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            item.setAttribute("aria-expanded", "true");
            dropdown.style.display = "block";
            links[0]?.focus();
            break;
          case "ArrowUp":
            e.preventDefault();
            item.setAttribute("aria-expanded", "true");
            dropdown.style.display = "block";
            links[links.length - 1]?.focus();
            break;
          case "Escape":
            e.preventDefault();
            item.setAttribute("aria-expanded", "false");
            dropdown.style.display = "none";
            item.focus();
            break;
        }
      });
      dropdown.addEventListener("mouseleave", () => {
        item.setAttribute("aria-expanded", "false");
        dropdown.style.display = "none";
      });
    });
  }

  // js/main.js
  document.addEventListener("DOMContentLoaded", () => {
    initModals();
    initTooltips();
    initAlerts();
    initMegaMenu();
  });
})();
