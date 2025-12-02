// Lógica para la sección de Cupones en el panel de administración

async function loadCoupons() {
  const tbody = document.getElementById('couponsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando cupones...</td></tr>';
  // TODO: Llamar a la API para obtener cupones y renderizar con renderCouponsTable()
  console.log("Cargando cupones...");
  // Ejemplo:
  // const coupons = await apiCall('/cupones');
  // renderCouponsTable(coupons);
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Funcionalidad no implementada.</td></tr>';
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addCouponBtn');
  const loadBtn = document.getElementById('loadCouponsBtn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      alert('Funcionalidad para agregar cupones no implementada.');
    });
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', loadCoupons);
  }
});