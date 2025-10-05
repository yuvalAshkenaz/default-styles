export function initMegaMenu() {
  const menuItems = document.querySelectorAll('.mega-menu > li > a[aria-haspopup="true"]');

  menuItems.forEach(item => {
    const dropdown = item.nextElementSibling;
    if (!dropdown) return;

    // התחלת aria-expanded נכון
    item.setAttribute('aria-expanded', 'false');
    dropdown.style.display = 'none';

    // לחיצה עם עכבר
    item.addEventListener('click', e => {
      e.preventDefault();
      const isOpen = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!isOpen));
      dropdown.style.display = !isOpen ? 'block' : 'none';
      if (!isOpen) dropdown.querySelector('a')?.focus();
    });

    // ניווט עם מקלדת
    item.addEventListener('keydown', e => {
      const links = dropdown.querySelectorAll('a');
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          item.setAttribute('aria-expanded', 'true');
          dropdown.style.display = 'block';
          links[0]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          item.setAttribute('aria-expanded', 'true');
          dropdown.style.display = 'block';
          links[links.length - 1]?.focus();
          break;
        case 'Escape':
          e.preventDefault();
          item.setAttribute('aria-expanded', 'false');
          dropdown.style.display = 'none';
          item.focus();
          break;
      }
    });

    // אופציונלי: סגירה אוטומטית כשעוזבים את המנה
    dropdown.addEventListener('mouseleave', () => {
      item.setAttribute('aria-expanded', 'false');
      dropdown.style.display = 'none';
    });
  });
}