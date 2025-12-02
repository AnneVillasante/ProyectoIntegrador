// Lógica para la sección de Devoluciones en el panel de administración

let allReturns = [];

async function loadReturns() {
  const tbody = document.getElementById('returnsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando devoluciones...</td></tr>';
  try {
    const response = await apiCall('/devoluciones');
    allReturns = Array.isArray(response) ? response : [];
    renderReturnsTable();
  } catch (error) {
    console.error('Error cargando devoluciones:', error);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar devoluciones.</td></tr>';
  }
}

function renderReturnsTable() {
  const tbody = document.getElementById('returnsTableBody');
  if (!tbody) return;

  if (allReturns.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay devoluciones registradas.</td></tr>';
    return;
  }

  tbody.innerHTML = allReturns.map(ret => {
    const fechaDevolucion = new Date(ret.fechaDevolucion).toLocaleDateString();
    return `
      <tr>
        <td title="${ret.idDevolucion}">${ret.idDevolucion}</td>
        <td title="Pedido #${ret.idPedido}">Pedido #${ret.idPedido}</td>
        <td title="${ret.motivo}">${ret.motivo}</td>
        <td title="${fechaDevolucion}">${fechaDevolucion}</td>
        <td title="${ret.estado}">${ret.estado}</td>
        <td>
          <button class="btn-secondary" onclick="editReturn(${ret.idDevolucion})">Gestionar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function editReturn(id) {
  const ret = allReturns.find(r => r.idDevolucion === id);
  if (!ret) return;

  const modal = document.getElementById('returnModal');
  if (!modal) return;

  document.getElementById('returnModalTitle').textContent = `Gestionar Devolución #${id}`;
  document.getElementById('idDevolucion').value = ret.idDevolucion;
  document.getElementById('returnInfoId').textContent = ret.idDevolucion;
  document.getElementById('returnInfoPedidoId').textContent = ret.idPedido;
  document.getElementById('returnInfoMotivo').textContent = ret.motivo;
  document.getElementById('returnEstado').value = ret.estado;
  
  modal.hidden = false;
}

document.addEventListener('DOMContentLoaded', () => {
  const loadBtn = document.getElementById('loadReturnsBtn');
  const modal = document.getElementById('returnModal');
  const form = document.getElementById('returnForm');

  if (loadBtn) {
    loadBtn.addEventListener('click', loadReturns);
  }

  if (modal) {
    document.getElementById('closeReturnModal').addEventListener('click', () => modal.hidden = true);
    document.getElementById('cancelReturn').addEventListener('click', () => modal.hidden = true);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('idDevolucion').value;
      const estado = document.getElementById('returnEstado').value;

      try {
        await apiCall(`/devoluciones/${id}`, { method: 'PUT', body: JSON.stringify({ estado }) });
        alert('Estado de la devolución actualizado correctamente.');
        modal.hidden = true;
        loadReturns();
      } catch (error) {
        console.error('Error actualizando devolución:', error);
        alert('Error al actualizar la devolución.');
      }
    });
  }

  // Hacer la función de edición global para el onclick
  window.editReturn = editReturn;
});