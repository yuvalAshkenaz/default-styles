export function initTooltips() {
  const triggers = document.querySelectorAll('[data-tooltip]');

  triggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => showTooltip(trigger));
    trigger.addEventListener('focus', () => showTooltip(trigger));
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('blur', hideTooltip);
  });
}

function showTooltip(el) {
  const text = el.getAttribute('data-tooltip');
  const placement = el.getAttribute('data-tooltip-placement') || 'top';

  const tooltip = document.createElement('div');
  tooltip.className = `tooltip tooltip-${placement}`;
  tooltip.textContent = text;

  document.body.appendChild(tooltip);
  positionTooltip(el, tooltip, placement);
  tooltip.classList.add('show');
}

function hideTooltip() {
  document.querySelectorAll('.tooltip').forEach(t => t.remove());
}

function positionTooltip(el, tooltip, placement) {
  const rect = el.getBoundingClientRect();
  const ttRect = tooltip.getBoundingClientRect();
  const scrollY = window.scrollY;
  const scrollX = window.scrollX;

  let top, left;
  switch (placement) {
    case 'bottom':
      top = rect.bottom + 8 + scrollY;
      left = rect.left + rect.width / 2 - ttRect.width / 2 + scrollX;
      break;
    case 'start':
      top = rect.top + rect.height / 2 - ttRect.height / 2 + scrollY;
      left = rect.left - ttRect.width - 8 + scrollX;
      break;
    case 'end':
      top = rect.top + rect.height / 2 - ttRect.height / 2 + scrollY;
      left = rect.right + 8 + scrollX;
      break;
    default: // top
      top = rect.top - ttRect.height - 8 + scrollY;
      left = rect.left + rect.width / 2 - ttRect.width / 2 + scrollX;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${left}px`;
}
