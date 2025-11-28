// Navbar interactions: dropdown menu and search popover
document.addEventListener('DOMContentLoaded', () => {
  function bindNavbarInteractions() {
    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    const searchBtn = document.getElementById('searchBtn');
    const searchPopover = document.getElementById('searchPopover');
    const searchInput = document.getElementById('searchInput');
    const accountBtn = document.getElementById('accountBtn');
    const accountPanel = document.getElementById('accountPanel');
    const accountContent = document.getElementById('accountContent');

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

    function toggleAccount(expand) {
      if (!accountBtn || !accountPanel) return;
      const willExpand = typeof expand === 'boolean' ? expand : accountPanel.hasAttribute('hidden');
      accountPanel.toggleAttribute('hidden', !willExpand);
      accountBtn.setAttribute('aria-expanded', String(willExpand));
    }

    // Función para verificar si el usuario está autenticado
    function isAuthenticated() {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return token && user;
    }

    // Función para obtener datos del usuario
    function getUserData() {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }

    // Función para renderizar el contenido de la cuenta
    function renderAccountContent() {
      if (!accountContent) return;

      if (isAuthenticated()) {
        const user = getUserData();
        const isAdmin = user && user.rol === 'Administrador';
        
        let content = `
          <div class="account-info">
            <div class="user-name">${user.nombres} ${user.apellidos}</div>
            <div class="user-role">${user.rol}</div>
          </div>
          <div class="menu-divider"></div>
        `;

        // Enlace a "Mi Perfil" para todos los usuarios logueados
        content += `
          <a class="menu-item" href="/perfil">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mi perfil
          </a>`;

        // Solo mostrar "Panel administrativo" si es administrador
        if (isAdmin) {
          content += `
            <a class="menu-item" href="/pages/admin_panel.html">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
              Panel administrativo
            </a>
          `;
        }

        // "Cerrar sesión" se muestra para todos los usuarios autenticados
        content += `
          <a class="menu-item logout-btn" href="#" id="logoutBtn">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </a>
        `;

        accountContent.innerHTML = content;

        // Agregar evento de logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
          });
        }
      } else {
        // Usuario no autenticado - mostrar "Iniciar sesión"
        accountContent.innerHTML = `
          <a class="menu-item" href="/pages/login.html">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10,17 15,12 10,7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Iniciar sesión
          </a>
        `;
      }
    }

    // Función para cerrar sesión
    function logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      renderAccountContent();
      toggleAccount(false);
      // Redirigir a la página principal
      window.location.href = '/';
    }

    // Toggle handlers
    if (menuToggle && menuPanel && !menuToggle.__bound) {
      menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
      });
      menuToggle.__bound = true;
      // close when menu item clicked
      menuPanel.addEventListener('click', (ev) => {
        const target = ev.target;
        if (target && (target.closest('.menu-item') || target.closest('.icon-btn'))) {
          toggleMenu(false);
        }
      });
    }

    if (searchBtn && searchPopover && !searchBtn.__bound) {
      searchBtn.addEventListener('click', () => toggleSearch());
      searchBtn.__bound = true;
    }

    if (accountBtn && accountPanel && !accountBtn.__bound) {
      accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAccount();
      });
      accountBtn.__bound = true;
      // close when account item clicked
      accountPanel.addEventListener('click', (ev) => {
        const target = ev.target;
        if (target && target.closest('.menu-item')) {
          toggleAccount(false);
        }
      });
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
        if (accountPanel && accountBtn && !accountPanel.contains(target) && !accountBtn.contains(target)) {
          toggleAccount(false);
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
          toggleAccount(false);
        }
      });
      document.__navEscHandler = true;
    }

    // Renderizar contenido inicial
    renderAccountContent();

    // Escuchar cambios en el perfil para volver a renderizar
    window.addEventListener('profile:updated', renderAccountContent);
  }

  // Bind now and when navbar component is injected
  bindNavbarInteractions();
  document.addEventListener('navbar:loaded', bindNavbarInteractions, { once: true });

  // Year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});