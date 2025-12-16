// Lógica para la sección de Campanas en el panel de administración

let allCampaigns = [];
async function loadCampaigns() {
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando campanas...</td></tr>';
  try {
    const response = await apiCall('/campanas');
    allCampaigns = Array.isArray(response) ? response : [];
    renderCampaignsTable();
  } catch (error) {
    logger.error('Error cargando campanas:', error);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar campanas.</td></tr>';
  }
}

function renderCampaignsTable() {
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;

  if (allCampaigns.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay campanas creadas.</td></tr>';
    return;
  }

  tbody.innerHTML = allCampaigns.map(camp => {
    const fechaInicio = new Date(camp.fechaInicio).toLocaleDateString();
    const fechaFin = new Date(camp.fechaFin).toLocaleDateString();
    return `
      <tr>
        <td title="${camp.idCampana}">${camp.idCampana}</td>
        <td title="${camp.titulo}">${camp.titulo}</td>
        <td title="${fechaInicio}">${fechaInicio}</td>
        <td title="${fechaFin}">${fechaFin}</td>
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
  document.getElementById('campaignModalTitle').textContent = 'Nueva Campana';
  document.getElementById('campaignForm').reset();
  document.getElementById('idCampana').value = '';
  document.getElementById('campaignModal').hidden = false;
}

function editCampaign(id) {
  const camp = allCampaigns.find(c => c.idCampana === id);
  if (!camp) return;

  document.getElementById('campaignModalTitle').textContent = 'Editar Campana';
  document.getElementById('idCampana').value = camp.idCampana;
  document.getElementById('campaignNombre').value = camp.titulo;
  document.getElementById('campaignDescripcion').value = camp.descripcion;
  document.getElementById('campaignFechaInicio').value = camp.fechaInicio.split('T')[0];
  document.getElementById('campaignFechaFin').value = camp.fechaFin.split('T')[0];
  document.getElementById('campaignActivo').value = camp.activo ? '1' : '0';
  document.getElementById('campaignModal').hidden = false;
}

async function deleteCampaign(id) {
  if (!confirm('¿Estás seguro de eliminar esta campana?')) return;
  try {
    await apiCall(`/campanas/${id}`, { method: 'DELETE' });
    alert('Campana eliminada correctamente.');
    loadCampaigns();
  } catch (error) {
    logger.error('Error eliminando campana:', error);
    alert('Error al eliminar la campana.');
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
      const imagenFile = document.getElementById('campaignImagen').files[0];

      const formData = new FormData();
      formData.append('titulo', document.getElementById('campaignNombre').value);
      formData.append('descripcion', document.getElementById('campaignDescripcion').value);
      formData.append('fechaInicio', document.getElementById('campaignFechaInicio').value);
      formData.append('fechaFin', document.getElementById('campaignFechaFin').value);
      formData.append('activo', document.getElementById('campaignActivo').value === '1');

      if (imagenFile) {
        formData.append('imagen', imagenFile);
      }

      const method = id ? 'PUT' : 'POST';
      const endpoint = id ? `/campanas/${id}` : '/campanas';
      try {
        await apiCall(endpoint, { method, body: formData });
        alert(`Campana ${id ? 'actualizada' : 'creada'} correctamente.`);
        modal.hidden = true;
        loadCampaigns();
      } catch (error) {
        logger.error('Error guardando campana:', error);
        alert('Error al guardar la campana.');
      }
    });
  }

  window.editCampaign = editCampaign;
  window.deleteCampaign = deleteCampaign;
  window.addCampaign = addCampaign;
});