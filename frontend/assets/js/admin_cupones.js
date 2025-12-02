// Lógica para la sección de Cupones en el panel de administración

let allCoupons = [];

async function loadCoupons() {
  const tbody = document.getElementById('couponsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando cupones...</td></tr>';
  try {
    const response = await apiCall('/cupones');
    allCoupons = Array.isArray(response) ? response : [];
    renderCouponsTable();
  } catch (error) {
    console.error('Error cargando cupones:', error);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar cupones.</td></tr>';
  }
}

function renderCouponsTable() {
  const tbody = document.getElementById('couponsTableBody');
  if (!tbody) return;

  if (allCoupons.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay cupones creados.</td></tr>';
    return;
  }

  tbody.innerHTML = allCoupons.map(coupon => {
    const fechaExpiracion = new Date(coupon.fechaExpiracion).toLocaleDateString();
    const valor = coupon.tipoDescuento === 'Porcentaje' ? `${coupon.valorDescuento}%` : `S/ ${parseFloat(coupon.valorDescuento).toFixed(2)}`;
    return `
      <tr>
        <td title="${coupon.idCupon}">${coupon.idCupon}</td>
        <td title="${coupon.codigo}">${coupon.codigo}</td>
        <td title="${valor} (${coupon.tipoDescuento})">${valor}</td>
        <td title="${fechaExpiracion}">${fechaExpiracion}</td>
        <td title="${coupon.activo ? 'Activo' : 'Inactivo'}">${coupon.activo ? '✅' : '❌'}</td>
        <td>
          <button class="btn-secondary" onclick="editCoupon(${coupon.idCupon})">Editar</button>
          <button class="btn-danger" onclick="deleteCoupon(${coupon.idCupon})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addCoupon() {
  document.getElementById('couponModalTitle').textContent = 'Nuevo Cupón';
  document.getElementById('couponForm').reset();
  document.getElementById('idCupon').value = '';
  document.getElementById('couponModal').hidden = false;
}

function editCoupon(id) {
  const coupon = allCoupons.find(c => c.idCupon === id);
  if (!coupon) return;

  document.getElementById('couponModalTitle').textContent = 'Editar Cupón';
  document.getElementById('idCupon').value = coupon.idCupon;
  document.getElementById('couponCodigo').value = coupon.codigo;
  document.getElementById('couponDescripcion').value = coupon.descripcion;
  document.getElementById('couponFechaExpiracion').value = coupon.fechaExpiracion.split('T')[0];
  document.getElementById('couponTipoDescuento').value = coupon.tipoDescuento;
  document.getElementById('couponValorDescuento').value = coupon.valorDescuento;
  document.getElementById('couponActivo').value = coupon.activo ? '1' : '0';
  document.getElementById('couponModal').hidden = false;
}

async function deleteCoupon(id) {
  if (!confirm('¿Estás seguro de eliminar este cupón?')) return;
  try {
    await apiCall(`/cupones/${id}`, { method: 'DELETE' });
    alert('Cupón eliminado correctamente.');
    loadCoupons();
  } catch (error) {
    console.error('Error eliminando cupón:', error);
    alert('Error al eliminar el cupón.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addCouponBtn');
  const loadBtn = document.getElementById('loadCouponsBtn');
  const modal = document.getElementById('couponModal');
  const form = document.getElementById('couponForm');

  if (addBtn) addBtn.addEventListener('click', addCoupon);
  if (loadBtn) loadBtn.addEventListener('click', loadCoupons);

  if (modal) {
    document.getElementById('closeCouponModal').addEventListener('click', () => modal.hidden = true);
    document.getElementById('cancelCoupon').addEventListener('click', () => modal.hidden = true);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('idCupon').value;
      const data = {
        codigo: document.getElementById('couponCodigo').value,
        descripcion: document.getElementById('couponDescripcion').value,
        fechaExpiracion: document.getElementById('couponFechaExpiracion').value,
        tipoDescuento: document.getElementById('couponTipoDescuento').value,
        valorDescuento: parseFloat(document.getElementById('couponValorDescuento').value),
        activo: document.getElementById('couponActivo').value === '1',
      };
      const method = id ? 'PUT' : 'POST';
      const endpoint = id ? `/cupones/${id}` : '/cupones';
      try {
        await apiCall(endpoint, { method, body: JSON.stringify(data) });
        alert(`Cupón ${id ? 'actualizado' : 'creado'} correctamente.`);
        modal.hidden = true;
        loadCoupons();
      } catch (error) {
        console.error('Error guardando cupón:', error);
        alert('Error al guardar el cupón.');
      }
    });
  }

  window.editCoupon = editCoupon;
  window.deleteCoupon = deleteCoupon;
});