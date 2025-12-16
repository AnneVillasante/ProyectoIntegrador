// Lógica para la sección de Facturas en el panel de administración

async function loadInvoices() {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando facturas...</td></tr>';

  try {
    const invoices = await apiCall('/facturas');
    renderInvoicesTable(Array.isArray(invoices) ? invoices : []);
  } catch (error) {
    logger.error('Error cargando facturas:', error);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error al cargar las facturas.</td></tr>';
  }
}

function renderInvoicesTable(invoices) {
  const tbody = document.getElementById('invoicesTableBody');
  if (!tbody) return;

  if (invoices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay facturas registradas.</td></tr>';
    return;
  }

  tbody.innerHTML = invoices.map(invoice => {
    const fechaEmision = new Date(invoice.fechaEmision).toLocaleDateString();
    const totalFormateado = `S/ ${Number(invoice.total).toFixed(2)}`;
    return `
      <tr>
        <td title="${invoice.idFactura}">${invoice.idFactura}</td>
        <td title="Pedido ID: ${invoice.idPedido}">Pedido #${invoice.idPedido}</td>
        <td title="${fechaEmision}">${fechaEmision}</td>
        <td title="${totalFormateado}">${totalFormateado}</td>
        <td>
          <button class="btn-secondary" onclick="window.open('${invoice.urlDocumento}', '_blank')">Ver/Descargar</button>
        </td>
      </tr>
    `;
  }).join('');
}