// Lógica para la sección de Campañas en el panel de administración

let allCampaigns = [];

async function loadCampaigns() {
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando campañas...</td></tr>';
  try {
    const response = await apiCall('/campanas');
    allCampaigns = Array.isArray(response) ? response : [];
    renderCampaignsTable();
  } catch (error) {
    console.error('Error cargando campañas:', error);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar campañas.</td></tr>';
  }
}

function renderCampaignsTable() {
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;

  if (allCampaigns.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay campañas creadas.</td></tr>';
    return;
  }

  tbody.innerHTML = allCampaigns.map(camp => {
    const fechaInicio = new Date(camp.fechaInicio).toLocaleDateString();
    const fechaFin = new Date(camp.fechaFin).toLocaleDateString();
    return `
      <tr>
        <td title="${camp.idCampana}">${camp.idCampana}</td>
        <td title="${camp.nombre}">${camp.nombre}</td>
        <td title="${fechaInicio} - ${fechaFin}">${fechaInicio} - ${fechaFin}</td>
        <td title="${camp.activo ? 'Activo' : 'Inactivo'}">${camp.activo ? '✅' : '❌'}</td>
        <td>
          <button class="btn-secondary" onclick="editCampaign(${camp.idCampana})">Editar</button>
          <button class="btn-danger" onclick="deleteCampaign(${camp.idCampana})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join('');
}

function addCampaign() {
  document.getElementById('campaignModalTitle').textContent = 'Nueva Campaña';
  document.getElementById('campaignForm').reset();
  document.getElementById('idCampana').value = '';
  document.getElementById('campaignModal').hidden = false;
}

function editCampaign(id) {
  const camp = allCampaigns.find(c => c.idCampana === id);
  if (!camp) return;

  document.getElementById('campaignModalTitle').textContent = 'Editar Campaña';
  document.getElementById('idCampana').value = camp.idCampana;
  document.getElementById('campaignNombre').value = camp.nombre;
  document.getElementById('campaignDescripcion').value = camp.descripcion;
  document.getElementById('campaignFechaInicio').value = camp.fechaInicio.split('T')[0];
  document.getElementById('campaignFechaFin').value = camp.fechaFin.split('T')[0];
  document.getElementById('campaignActivo').value = camp.activo ? '1' : '0';
  document.getElementById('campaignModal').hidden = false;
}

async function deleteCampaign(id) {
  if (!confirm('¿Estás seguro de eliminar esta campaña?')) return;
  try {
    await apiCall(`/campanas/${id}`, { method: 'DELETE' });
    alert('Campaña eliminada correctamente.');
    loadCampaigns();
  } catch (error) {
    console.error('Error eliminando campaña:', error);
    alert('Error al eliminar la campaña.');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addCampaignBtn');
  const loadBtn = document.getElementById('loadCampaignsBtn');
  const modal = document.getElementById('campaignModal');
  const form = document.getElementById('campaignForm');

  if (addBtn) addBtn.addEventListener('click', addCampaign);
  if (loadBtn) loadBtn.addEventListener('click', loadCampaigns);

  if (modal) {
    document.getElementById('closeCampaignModal').addEventListener('click', () => modal.hidden = true);
    document.getElementById('cancelCampaign').addEventListener('click', () => modal.hidden = true);
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('idCampana').value;
      const data = {
        titulo: document.getElementById('campaignNombre').value,
        descripcion: document.getElementById('campaignDescripcion').value,
        fechaInicio: document.getElementById('campaignFechaInicio').value,
        fechaFin: document.getElementById('campaignFechaFin').value,
        activo: document.getElementById('campaignActivo').value === '1',
      };
      const method = id ? 'PUT' : 'POST';
      const endpoint = id ? `/campanas/${id}` : '/campanas';
      try {
        await apiCall(endpoint, { method, body: JSON.stringify(data) });
        alert(`Campaña ${id ? 'actualizada' : 'creada'} correctamente.`);
        modal.hidden = true;
        loadCampaigns();
      } catch (error) {
        console.error('Error guardando campaña:', error);
        alert('Error al guardar la campaña.');
      }
    });
  }

  window.editCampaign = editCampaign;
  window.deleteCampaign = deleteCampaign;
  window.addCampaign = addCampaign;
});