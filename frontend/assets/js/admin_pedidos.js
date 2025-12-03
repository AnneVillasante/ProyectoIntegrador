// Lógica para la sección de Pedidos en el panel de administración

async function loadOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Cargando pedidos...</td></tr>';

  try {
    const orders = await apiCall('/pedidos');
    renderOrdersTable(Array.isArray(orders) ? orders : []);
  } catch (error) {
    console.error('Error cargando pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error al cargar los pedidos.</td></tr>';
  }
}

function renderOrdersTable(orders) {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay pedidos registrados.</td></tr>';
    return;
  }

  tbody.innerHTML = orders.map(order => {
    const fechaPedido = new Date(order.fecha).toLocaleDateString();
    const totalFormateado = `S/ ${Number(order.total).toFixed(2)}`;
    return `
      <tr>
        <td title="${order.idPedido}">${order.idPedido}</td>
        <td title="Cliente ID: ${order.idCliente}">Cliente #${order.idCliente}</td>
        <td title="${fechaPedido}">${fechaPedido}</td>
        <td title="${order.estado}">${order.estado}</td>
        <td title="${totalFormateado}">${totalFormateado}</td>
        <td title="${order.metodoPago}">${order.metodoPago}</td>
      </tr>
    `;
  }).join('');
}