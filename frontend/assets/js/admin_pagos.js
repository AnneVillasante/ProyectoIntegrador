// Lógica para la sección de Pagos en el panel de administración

async function loadPayments() {
  const tbody = document.getElementById('paymentsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando pagos...</td></tr>'; // 6 columnas

  try {
    const payments = await apiCall('/pagos');
    renderPaymentsTable(Array.isArray(payments) ? payments : []);
  } catch (error) {
    console.error('Error cargando pagos:', error);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar los pagos. Por favor, verifica que el endpoint `/pagos` exista en el backend.</td></tr>';
  }
}

function renderPaymentsTable(payments) {
  const tbody = document.getElementById('paymentsTableBody');
  if (!tbody) return;

  if (payments.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay pagos registrados.</td></tr>'; // 6 columnas
    return;
  }

  tbody.innerHTML = payments.map(payment => {
    const fechaPago = new Date(payment.fechaPago).toLocaleDateString();
    const montoFormateado = `S/ ${Number(payment.monto).toFixed(2)}`;
    return `
      <tr>
        <td title="${payment.idPago}">${payment.idPago}</td>
        <td title="Pedido ID: ${payment.idPedido}">Pedido #${payment.idPedido}</td>
        <td title="${payment.metodoPago}">${payment.metodoPago}</td>
        <td title="${montoFormateado}">${montoFormateado}</td>
        <td title="${fechaPago}">${fechaPago}</td>
        <td title="${payment.estadoTransaccion}">${payment.estadoTransaccion}</td>
      </tr>
    `;
  }).join('');
}