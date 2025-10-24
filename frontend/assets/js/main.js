// Navbar interactions: dropdown menu and search popover
document.addEventListener('DOMContentLoaded', () => {
  function bindNavbarInteractions() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    const searchBtn = document.getElementById('searchBtn');
    const searchPopover = document.getElementById('searchPopover');
    const searchInput = document.getElementById('searchInput');

    function toggleMenu(expand) {
      if (!menuToggle || !menuPanel) return;
      const willExpand = typeof expand === 'boolean' ? expand : menuPanel.hasAttribute('hidden');
      menuPanel.toggleAttribute('hidden', !willExpand);
      menuToggle.setAttribute('aria-expanded', String(willExpand));
    }

    function toggleSearch(expand) {
      if (!searchBtn || !searchPopover) return;
      const willExpand = typeof expand === 'boolean' ? expand : searchPopover.hasAttribute('hidden');
      searchPopover.toggleAttribute('hidden', !willExpand);
      searchBtn.setAttribute('aria-expanded', String(willExpand));
      if (willExpand && searchInput) setTimeout(() => searchInput.focus(), 0);
    }

    // Toggle handlers
    if (menuToggle && menuPanel && !menuToggle.__bound) {
      menuToggle.addEventListener('click', () => toggleMenu());
      menuToggle.__bound = true;
    }

    if (searchBtn && searchPopover && !searchBtn.__bound) {
      searchBtn.addEventListener('click', () => toggleSearch());
      searchBtn.__bound = true;
    }

    // Click outside to close
    if (!document.__navOutsideHandler) {
      document.addEventListener('click', (e) => {
        const target = e.target;
        if (menuPanel && menuToggle && !menuPanel.contains(target) && !menuToggle.contains(target)) {
          toggleMenu(false);
        }
        if (searchPopover && searchBtn && !searchPopover.contains(target) && !searchBtn.contains(target)) {
          toggleSearch(false);
        }
      });
      document.__navOutsideHandler = true;
    }

    // Escape to close
    if (!document.__navEscHandler) {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          toggleMenu(false);
          toggleSearch(false);
        }
      });
      document.__navEscHandler = true;
    }
  }

  // Bind now and when navbar component is injected
  bindNavbarInteractions();
  document.addEventListener('navbar:loaded', bindNavbarInteractions, { once: true });

  // Year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});


