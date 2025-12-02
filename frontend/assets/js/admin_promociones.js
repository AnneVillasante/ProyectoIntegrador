// Lógica para la sección de Promociones en el panel de administración

let allPromotions = [];

async function loadPromotions() {
  try {
    // Usamos apiCall para consistencia y manejo de token
    const response = await apiCall('/promociones');
    allPromotions = Array.isArray(response) ? response : [];
    renderPromotionsTable();
  } catch (error) {
    console.error(error);
    alert('No se pudieron cargar las promociones.');
  }
}

function renderPromotionsTable() {
  const tbody = document.getElementById('promotionsTableBody');
  if (!tbody) return;

  if (allPromotions.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay promociones creadas.</td></tr>';
    return;
  }

  tbody.innerHTML = allPromotions.map(promo => {
    const fechaInicio = new Date(promo.fechaInicio).toLocaleDateString();
    const fechaFin = new Date(promo.fechaFin).toLocaleDateString();
    const valor = promo.tipoDescuento === 'Porcentaje' ? `${promo.valorDescuento}%` : `S/ ${parseFloat(promo.valorDescuento).toFixed(2)}`;

    return `
      <tr>
        <td title="${promo.idPromocion}">${promo.idPromocion}</td>
        <td title="${promo.titulo}">${promo.titulo}</td>
        <td title="${promo.tipoDescuento}">${promo.tipoDescuento}</td>
        <td title="${valor}">${valor}</td>
        <td title="Del ${fechaInicio} al ${fechaFin}">${fechaInicio} - ${fechaFin}</td>
        <td title="${promo.activo ? 'Activo' : 'Inactivo'}">${promo.activo ? '✅' : '❌'}</td>
        <td>
          <button class="btn-secondary" onclick="editPromotion(${promo.idPromocion})">Editar</button>
          <button class="btn-danger" onclick="deletePromotion(${promo.idPromocion})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addPromotion() {
  document.getElementById('promotionModalTitle').textContent = 'Nueva Promoción';
  document.getElementById('promotionForm').reset();
  document.getElementById('idPromocion').value = '';
  document.getElementById('promotionModal').hidden = false;
}

function editPromotion(id) {
  const promo = allPromotions.find(p => p.idPromocion === id);
  if (!promo) return;

  document.getElementById('promotionModalTitle').textContent = 'Editar Promoción';
  document.getElementById('idPromocion').value = promo.idPromocion;
  document.getElementById('promoTitulo').value = promo.titulo;
  document.getElementById('promoDescripcion').value = promo.descripcion;
  document.getElementById('promoFechaInicio').value = promo.fechaInicio.split('T')[0];
  document.getElementById('promoFechaFin').value = promo.fechaFin.split('T')[0];
  document.getElementById('promoTipoDescuento').value = promo.tipoDescuento;
  document.getElementById('promoValorDescuento').value = promo.valorDescuento;
  document.getElementById('promoActivo').value = promo.activo ? '1' : '0';

  document.getElementById('promotionModal').hidden = false;
}

async function deletePromotion(id) {
  if (!confirm('¿Estás seguro de eliminar esta promoción?')) return;

  try {
    await apiCall(`/promociones/${id}`, { method: 'DELETE' });
    alert('Promoción eliminada correctamente.');
    loadPromotions();
  } catch (error) {
    console.error('Error eliminando promoción:', error);
    alert('Error al eliminar la promoción.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Listeners para la sección de promociones
  const addBtn = document.getElementById('addPromotionBtn');
  const loadBtn = document.getElementById('loadPromotionsBtn');
  const modal = document.getElementById('promotionModal');
  const form = document.getElementById('promotionForm');

  if (addBtn) addBtn.addEventListener('click', addPromotion);
  if (loadBtn) loadBtn.addEventListener('click', loadPromotions);

  if (modal) {
    document.getElementById('closePromotionModal').addEventListener('click', () => modal.hidden = true);
    document.getElementById('cancelPromotion').addEventListener('click', () => modal.hidden = true);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('idPromocion').value;
      const data = {
        titulo: document.getElementById('promoTitulo').value,
        descripcion: document.getElementById('promoDescripcion').value,
        fechaInicio: document.getElementById('promoFechaInicio').value,
        fechaFin: document.getElementById('promoFechaFin').value,
        tipoDescuento: document.getElementById('promoTipoDescuento').value,
        valorDescuento: parseFloat(document.getElementById('promoValorDescuento').value),
        activo: document.getElementById('promoActivo').value === '1',
      };

      const method = id ? 'PUT' : 'POST';
      const endpoint = id ? `/promociones/${id}` : '/promociones';

      try {
        await apiCall(endpoint, {
          method: method,
          body: JSON.stringify(data)
        });
        alert(`Promoción ${id ? 'actualizada' : 'creada'} correctamente.`);
        modal.hidden = true;
        loadPromotions();
      } catch (error) {
        console.error('Error guardando promoción:', error);
        alert('Error al guardar la promoción.');
      }
    });
  }

  // Hacer funciones globales para los botones onclick
  window.editPromotion = editPromotion;
  window.deletePromotion = deletePromotion;
});