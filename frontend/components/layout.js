// Shared layout loader: injects navbar and footer uniformly
(function () {
  async function includeComponent(id, file) {
    const target = document.getElementById(id);
    if (!target) return false;
    try {
      const res = await fetch(file, { credentials: 'same-origin' });
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${file}`);
      target.innerHTML = await res.text();
      return true;
    } catch (err) {
      console.error('Error incluyendo componente', id, file, err);
      return false;
    }
  }

  function setYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const [navOk, footerOk] = await Promise.all([
      includeComponent('navbar', '/components/navbar.html'),
      includeComponent('footer', '/components/footer.html'),
    ]);

    if (navOk) document.dispatchEvent(new Event('navbar:loaded'));
    if (footerOk) {
      setYear();
      document.dispatchEvent(new Event('footer:loaded'));
    }
  });
})();