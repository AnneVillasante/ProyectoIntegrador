// Lógica para la sección de Campañas en el panel de administración

async function loadCampaigns() {
  const tbody = document.getElementById('campaignsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando campañas...</td></tr>';
  // TODO: Llamar a la API para obtener campañas y renderizar con renderCampaignsTable()
  console.log("Cargando campañas...");
  // Ejemplo:
  // const campaigns = await apiCall('/campañas');
  // renderCampaignsTable(campaigns);
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Funcionalidad no implementada.</td></tr>';
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('addCampaignBtn');
  const loadBtn = document.getElementById('loadCampaignsBtn');

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      alert('Funcionalidad para agregar campañas no implementada.');
    });
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', loadCampaigns);
  }
});