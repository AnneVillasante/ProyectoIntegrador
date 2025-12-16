// Panel Administrativo - Funcionalidad completa con pestanas

// Funciones de utilidad globales para ser accesibles desde otros scripts
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(`${window.CONFIG.API_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
    }
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    logger.error('API Call Error:', error);
    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación y rol
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // La verificación más importante es la existencia del token.
  if (!token || !user || user.rol !== 'Administrador') {
    alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
    window.location.href = '/';
    return;
  }

  // Variables globales
  let users = [];
  let products = [];
  let stocks = [];
  let categorias = [];
  let subcategorias = [];
  let stockChanges = {};

  // ===== SISTEMA DE PESTAnAS =====
  function initTabs() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = link.getAttribute('data-tab');
        
        navLinks.forEach(lnk => lnk.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Agregar clase active al botón y contenido seleccionado
        link.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
        
        // Cargar datos según la pestana activa
        loadTabData(targetTab);
      });
    });
  }

  function loadTabData(tabName) {
    switch(tabName) {
      case 'users':
        if (users.length === 0) loadUsers();
        break;
      case 'products':
        if (products.length === 0) loadProducts();
        if (categorias.length === 0) loadCategories();
        break;
      case 'classification':
        if (categorias.length === 0 || subcategorias.length === 0) loadClassifications();
        break;
      case 'stocks':
        if (stocks.length === 0) loadStocks();
        break;
      case 'reports':
        // Los reportes no necesitan precarga
        break;
      case 'promotions':
        if (typeof loadPromotions === 'function') loadPromotions();
        break;
      case 'campaigns':
        if (typeof loadCampaigns === 'function') loadCampaigns();
        break;
      case 'coupons':
        if (typeof loadCoupons === 'function') loadCoupons();
        break;
      case 'returns':
        if (typeof loadReturns === 'function') loadReturns();
        break;
      case 'orders':
        if (typeof loadOrders === 'function') loadOrders(); // Llama a la función si existe
        break;
      case 'payments':
        if (typeof loadPayments === 'function') loadPayments(); // Llama a la función si existe
        break;
      case 'invoices':
        if (typeof loadInvoices === 'function') loadInvoices();
        break;
      case 'metrics':
        document.getElementById('apply-metrics-filter').click(); // Simula un clic para cargar con el filtro por defecto
        break;
      case 'logs':
        if (typeof loadLogs === 'function') loadLogs();
        break;
      default:
        logger.log(`Pestana ${tabName} seleccionada. Sin acción de precarga.`);
    }
  }

  async function apiDownload(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const fetchOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    };
    try {
      const response = await fetch(`${window.CONFIG.API_URL}${endpoint}`, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}. La ruta en el servidor podría no existir.`);
      }

      return response; // Devolvemos la respuesta completa para manejar el blob
    } catch (error) {
      logger.error('API Download Error:', error);
      throw error;
    }
  }

  // ===== NAVEGACIÓN DESDE TARJETAS DE MÉTRICAS =====
  function initMetricCardNavigation() {
    const metricsGrid = document.querySelector('.metrics-grid');
    if (!metricsGrid) return;

    metricsGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.metric-card');
      if (!card) return;

      const tabTarget = card.dataset.tabTarget;
      if (tabTarget && tabTarget !== 'metrics') { // Si el target es 'metrics', no hacemos nada
        const navLink = document.querySelector(`.nav-link[data-tab='${tabTarget}']`);
        if (navLink) {
          navLink.click(); // Simula un clic en el enlace de la barra lateral para cambiar de pestaña
          window.scrollTo({ top: 0, behavior: 'smooth' }); // Opcional: lleva al usuario al inicio de la página
        }
      }
    });
  }


  // ===== USUARIOS =====
  async function loadUsers() {
    try {
      users = await apiCall('/usuario');
      renderUsersTable();
    } catch (error) {
      logger.error('Error cargando usuarios:', error);
      alert('Error al cargar usuarios');
    }
  }

  function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
      <tr data-user-id="${user.idUsuario}">
        <td title="${user.idUsuario}">${user.idUsuario}</td>
        <td title="${user.nombres} ${user.apellidos}">${user.nombres} ${user.apellidos}</td>
        <td title="${user.correo}">${user.correo}</td>
        <td>${user.rol}</td>
        <td>${user.telefono || 'N/A'}</td>
        <td>${user.dni || 'N/A'}</td>
        <td>
          <button class="btn-secondary edit-user-btn">Editar Rol</button>
          <button class="btn-danger delete-user-btn">Eliminar</button>
        </td>
      </tr>
    `).join('');

    // Añadir Event Listeners después de renderizar
    tbody.querySelectorAll('.edit-user-btn').forEach(button => {
      button.addEventListener('click', (e) => editUser(e.target.closest('tr').dataset.userId));
    });
    tbody.querySelectorAll('.delete-user-btn').forEach(button => {
      button.addEventListener('click', (e) => deleteUser(e.target.closest('tr').dataset.userId));
    });
  }

  async function editUser(id) {
    const user = users.find(u => u.idUsuario === id);
    if (!user) return;

    document.getElementById('editUserId').value = id;
    document.getElementById('editUserRole').value = user.rol;
    document.getElementById('editUserModal').hidden = false;
  }

  async function deleteUser(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      await apiCall(`/usuario/${id}`, { method: 'DELETE' });
      await loadUsers();
      alert('Usuario eliminado correctamente');
    } catch (error) {
      logger.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  }

  // ===== LOGS DE ACTIVIDAD =====
  async function loadLogs() {
    try {
      const logs = await apiCall('/logs');
      renderLogsTable(logs);
    } catch (error) {
      logger.error('Error cargando logs:', error);
      alert('Error al cargar los logs de actividad.');
    }
  }

  function renderLogsTable(logs) {
    const tbody = document.getElementById('logsTableBody');
    if (!logs || logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No hay logs disponibles.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map(log => `
      <tr>
        <td>${log.idLog}</td>
        <td>${log.usuario || 'Sistema'}</td>
        <td>${log.accion}</td>
        <td>${new Date(log.fecha).toLocaleString()}</td>
      </tr>
    `).join('');
  }

  // ===== DETALLES DE PEDIDO (MODAL) =====
  async function showOrderDetails(idPedido) {
    try {
      // Asumiendo que tienes un endpoint /api/pedidos/:id que devuelve el pedido con sus items
      const pedido = await apiCall(`/pedidos/${idPedido}`);
      
      // Llenar la información general del pedido
      document.getElementById('orderDetailsContent').innerHTML = `
        <p><strong>ID Pedido:</strong> ${pedido.idPedido}</p>
        <p><strong>Cliente:</strong> ${pedido.clienteNombre} (${pedido.clienteCorreo})</p>
        <p><strong>DNI/RUC:</strong> ${pedido.clienteDocumento || 'No especificado'}</p>
        <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleString()}</p>
        <p><strong>Estado:</strong> ${pedido.estado}</p>
        <p><strong>Total:</strong> S/ ${parseFloat(pedido.total).toFixed(2)}</p>
      `;

      // Llenar la tabla de productos
      const productsTbody = document.getElementById('orderProductsTableBody');
      productsTbody.innerHTML = pedido.items.map(item => `
        <tr>
          <td>${item.nombreProducto}</td>
          <td>${item.cantidad}</td>
          <td>S/ ${parseFloat(item.precioUnitario).toFixed(2)}</td>
          <td>S/ ${parseFloat(item.subtotal).toFixed(2)}</td>
        </tr>
      `).join('');

      document.getElementById('orderDetailsModal').hidden = false;
    } catch (error) {
      logger.error(`Error al cargar detalles del pedido ${idPedido}:`, error);
      alert('No se pudieron cargar los detalles del pedido.');
    }
  }

  // Hacer la función accesible globalmente para los botones
  window.showOrderDetails = showOrderDetails;
  window.generateTicket = async (idPedido) => {
    window.open(`${window.CONFIG.API_URL}/reportes/ticket/${idPedido}`, '_blank');
  }

  // ===== PRODUCTOS =====
  async function loadCategories() {
    try {
      categorias = await apiCall('/categorias');
      renderCategorySelect();
    } catch (error) {
      logger.error('Error cargando categorías:', error);
    }
  }

  async function loadSubcategories(idCategoria) {
    try {
      if (!idCategoria || idCategoria === '') {
        document.getElementById('idSubcategoria').innerHTML = '<option value="">-- Sin subcategoría --</option>';
        return;
      }
      subcategorias = await apiCall(`/subcategorias/categoria/${idCategoria}`);
      renderSubcategorySelect();
    } catch (error) {
      logger.error('Error cargando subcategorías:', error);
      document.getElementById('idSubcategoria').innerHTML = '<option value="">-- Sin subcategoría --</option>';
    }
  }

  function renderCategorySelect() {
    const select = document.getElementById('idCategoria');
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Sin categoría --</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.idCategoria;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
    if (currentValue) {
      select.value = currentValue;
    }
  }

  function renderSubcategorySelect() {
    const select = document.getElementById('idSubcategoria');
    const currentValue = select.value;
    select.innerHTML = '<option value="">-- Sin subcategoría --</option>';
    subcategorias.forEach(sub => {
      const option = document.createElement('option');
      option.value = sub.idSubcategoria;
      option.textContent = sub.nombre;
      select.appendChild(option);
    });
    if (currentValue) {
      select.value = currentValue;
    }
  }

  async function loadProducts() {
    try {
      const response = await apiCall('/productos');
      products = Array.isArray(response) ? response : [];
      renderProductsTable();
    } catch (error) {
      logger.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    }
  }

  function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (products.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos disponibles</td></tr>';
      return;
    }
    tbody.innerHTML = products.map(product => `
      <tr data-product-id="${product.idProducto}">
        <td title="${product.idProducto}">${product.idProducto}</td>
        <td title="${product.nombre}">${product.nombre}</td>
        <td title="${product.categoria || 'Sin categoría'}">${product.categoria || 'Sin categoría'}</td>
        <td title="S/ ${parseFloat(product.precio).toFixed(2)}">S/ ${parseFloat(product.precio).toFixed(2)}</td>
        <td title="${product.stock}">${product.stock}</td>
        <td>
          <button class="btn-secondary edit-product-btn">Editar</button>
          <button class="btn-danger delete-product-btn">Eliminar</button>
        </td>
      </tr>
    `).join('');

    // Añadir Event Listeners
    tbody.querySelectorAll('.edit-product-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        editProduct(e.target.closest('tr').dataset.productId);
      });
    });
    tbody.querySelectorAll('.delete-product-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        deleteProduct(e.target.closest('tr').dataset.productId);
      });
    });
  }

  async function addProduct() {
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
    document.getElementById('productForm').reset();
    document.getElementById('idProducto').value = '';
    document.getElementById('idSubcategoria').innerHTML = '<option value="">-- Sin subcategoría --</option>';
    
    await loadCategories();
    document.getElementById('productModal').hidden = false;
    
    // Configurar el listener de categoría después de que el modal esté visible
    const categoriaSelect = document.getElementById('idCategoria');
    categoriaSelect.onchange = async (e) => {
      const idCategoria = e.target.value;
      await loadSubcategories(idCategoria);
    };
  }

  async function editProduct(id) {
    const product = products.find(p => p.idProducto === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    document.getElementById('idProducto').value = id;
    document.getElementById('nombre').value = product.nombre || '';
    document.getElementById('descripcion').value = product.descripcion || '';
    document.getElementById('precio').value = product.precio || '';
    document.getElementById('stock').value = product.stock || '';
    
    await loadCategories();
    if (product.idCategoria) {
      document.getElementById('idCategoria').value = product.idCategoria;
      await loadSubcategories(product.idCategoria);
      if (product.idSubcategoria) {
        document.getElementById('idSubcategoria').value = product.idSubcategoria;
      }
    } else {
      document.getElementById('idCategoria').value = '';
      document.getElementById('idSubcategoria').innerHTML = '<option value="">-- Sin subcategoría --</option>';
    }
    
    document.getElementById('productModal').hidden = false;
    
    // Configurar el listener de categoría después de que el modal esté visible
    const categoriaSelect = document.getElementById('idCategoria');
    categoriaSelect.onchange = async (e) => {
      const idCategoria = e.target.value;
      await loadSubcategories(idCategoria);
    };
  }

  async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await apiCall(`/productos/${id}`, { method: 'DELETE' });
      await loadProducts();
      alert('Producto eliminado correctamente');
    } catch (error) {
      logger.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
    }
  }

  // ===== STOCKS =====
  async function loadStocks() {
    try {
      const response = await apiCall('/productos');
      stocks = Array.isArray(response) ? response : [];
      renderStocksTable();
    } catch (error) {
      logger.error('Error cargando stocks:', error);
      alert('Error al cargar stocks');
    }
  }

  function renderStocksTable() {
    const tbody = document.getElementById('stocksTableBody');
    if (stocks.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay productos disponibles</td></tr>';
      return;
    }
    tbody.innerHTML = stocks.map(product => `
      <tr>
        <td title="${product.idProducto}">${product.idProducto}</td>
        <td title="${product.nombre}">${product.nombre}</td>
        <td title="${product.categoria || 'Sin categoría'}">${product.categoria || 'Sin categoría'}</td>
        <td title="${product.stock}">${product.stock}</td>
        <td>
          <input type="number" class="stock-input" 
                 data-product-id="${product.idProducto}"
                 value="${product.stock}" 
                 min="0">
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.stock-input').forEach(input => {
      input.addEventListener('change', (e) => updateStockChange(e.target.dataset.productId, e.target.value));
    });
  }

  function updateStockChange(id, value) {
    stockChanges[id] = parseInt(value);
    const saveBtn = document.getElementById('saveStocksBtn');
    saveBtn.disabled = Object.keys(stockChanges).length === 0;
  }

  async function saveStocks() {
    try {
      for (const [id, stock] of Object.entries(stockChanges)) {
        const product = stocks.find(p => p.idProducto === parseInt(id));
        if (!product) continue;
        
        await apiCall(`/productos/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            nombre: product.nombre,
            descripcion: product.descripcion || '',
            precio: product.precio,
            stock: parseInt(stock),
            idCategoria: product.idCategoria || null,
            idSubcategoria: product.idSubcategoria || null,
            imagen: product.imagen || ''
          })
        });
      }
      stockChanges = {};
      document.getElementById('saveStocksBtn').disabled = true;
      await loadStocks();
      alert('Stocks actualizados correctamente');
    } catch (error) {
      logger.error('Error actualizando stocks:', error);
      alert('Error al actualizar stocks');
    }
  }

  // ===== CLASIFICACIÓN PRODUCTOS =====
  async function loadClassifications() {
    try {
      await loadCategories();
      await loadSubcategoriesAll();
      renderCategoriesTable();
      renderSubcategoriesTable();
    } catch (error) {
      logger.error('Error cargando clasificaciones:', error);
      alert('Error al cargar clasificaciones');
    }
  }

  async function loadSubcategoriesAll() {
    try {
      subcategorias = await apiCall('/subcategorias');
      return subcategorias;
    } catch (error) {
      logger.error('Error cargando todas las subcategorías:', error);
      return [];
    }
  }

  function renderCategoriesTable() {
    const tbody = document.getElementById('categoriesTableBody');
    if (!tbody) return;
    
    if (!categorias || categorias.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay categorías disponibles</td></tr>';
      return;
    }
    
    tbody.innerHTML = categorias.map(cat => {
      const imagenUrl = cat.imagen; // La URL de Cloudinary ya es absoluta
      return `
      <tr data-category-id="${cat.idCategoria}">
        <td title="${cat.idCategoria}">${cat.idCategoria}</td>
        <td title="${cat.nombre || 'Sin nombre'}">${cat.nombre || 'Sin nombre'}</td>
        <td title="${cat.descripcion || 'Sin descripción'}">${cat.descripcion || 'Sin descripción'}</td>
        <td title="${imagenUrl || 'Sin imagen'}">
          ${imagenUrl ? `<img src="${imagenUrl}" alt="${cat.nombre}" style="max-width: 60px; max-height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.style.display='none'">` : 'Sin imagen'}
        </td>
        <td>
          <button class="btn-secondary edit-category-btn">Editar</button>
          <button class="btn-danger delete-category-btn">Eliminar</button>
        </td>
      </tr>
    `;
    }).join('');

    // Añadir Event Listeners
    tbody.querySelectorAll('.edit-category-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        editCategory(e.target.closest('tr').dataset.categoryId);
      });
    });
    tbody.querySelectorAll('.delete-category-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        deleteCategory(e.target.closest('tr').dataset.categoryId);
      });
    });
  }

  function renderSubcategoriesTable() {
    const tbody = document.getElementById('subcategoriesTableBody');
    if (!tbody) return;
    
    if (!subcategorias || subcategorias.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center;">No hay subcategorías disponibles</td></tr>';
      return;
    }
    
    tbody.innerHTML = subcategorias.map(sub => {
      const categoria = categorias.find(c => c.idCategoria === sub.idCategoria);
      const imagenUrl = sub.imagen; // La URL de Cloudinary ya es absoluta
      return `
      <tr data-subcategory-id="${sub.idSubcategoria}">
        <td title="${sub.idSubcategoria}">${sub.idSubcategoria}</td>
        <td title="${sub.nombre || 'Sin nombre'}">${sub.nombre || 'Sin nombre'}</td>
        <td title="${sub.descripcion || 'Sin descripción'}">${sub.descripcion || 'Sin descripción'}</td>
        <td title="${categoria ? categoria.nombre : 'Sin categoría'}">${categoria ? categoria.nombre : 'Sin categoría'}</td>
        <td title="${sub.genero || 'Unisex'}">${sub.genero || 'Unisex'}</td>
        <td title="${imagenUrl || 'Sin imagen'}">
          ${imagenUrl ? `<img src="${imagenUrl}" alt="${sub.nombre}" style="max-width: 60px; max-height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.style.display='none'">` : 'Sin imagen'}
        </td>
        <td>
          <button class="btn-secondary edit-subcategory-btn">Editar</button>
          <button class="btn-danger delete-subcategory-btn">Eliminar</button>
        </td>
      </tr>
    `;
    }).join('');

    // Añadir Event Listeners
    tbody.querySelectorAll('.edit-subcategory-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        editSubcategory(e.target.closest('tr').dataset.subcategoryId);
      });
    });
    tbody.querySelectorAll('.delete-subcategory-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        deleteSubcategory(e.target.closest('tr').dataset.subcategoryId);
      });
    });
  }

  function addCategory() {
    document.getElementById('categoryModalTitle').textContent = 'Nueva Categoría';
    document.getElementById('categoryForm').reset();
    document.getElementById('idCategoriaModal').value = '';
    document.getElementById('categoryModal').hidden = false;
  }

  async function editCategory(id) {
    const category = categorias.find(c => c.idCategoria === id);
    if (!category) return;

    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    document.getElementById('idCategoriaModal').value = id;
    document.getElementById('categoriaNombre').value = category.nombre || '';
    document.getElementById('categoriaDescripcion').value = category.descripcion || '';
    document.getElementById('categoryModal').hidden = false;
  }

  async function deleteCategory(id) {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Esto también eliminará todas las subcategorías asociadas.')) return;

    try {
      await apiCall(`/categorias/${id}`, { method: 'DELETE' });
      await loadClassifications();
      alert('Categoría eliminada correctamente');
    } catch (error) {
      logger.error('Error eliminando categoría:', error);
      alert('Error al eliminar categoría');
    }
  }

  async function addSubcategory() {
    await loadCategories();
    const select = document.getElementById('subcategoriaCategoria');
    select.innerHTML = '<option value="">-- Seleccione una categoría --</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.idCategoria;
      option.textContent = cat.nombre;
      select.appendChild(option);
    });
    
    document.getElementById('subcategoryModalTitle').textContent = 'Nueva Subcategoría';
    document.getElementById('subcategoryForm').reset();
    document.getElementById('idSubcategoriaModal').value = '';
    document.getElementById('subcategoriaGenero').value = 'Unisex';
    document.getElementById('subcategoryModal').hidden = false;
  }

  async function editSubcategory(id) {
    const subcategory = subcategorias.find(s => s.idSubcategoria === id);
    if (!subcategory) return;

    await loadCategories();
    const select = document.getElementById('subcategoriaCategoria');
    select.innerHTML = '<option value="">-- Seleccione una categoría --</option>';
    categorias.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.idCategoria;
      option.textContent = cat.nombre;
      if (cat.idCategoria === subcategory.idCategoria) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    document.getElementById('subcategoryModalTitle').textContent = 'Editar Subcategoría';
    document.getElementById('idSubcategoriaModal').value = id;
    document.getElementById('subcategoriaNombre').value = subcategory.nombre || '';
    document.getElementById('subcategoriaDescripcion').value = subcategory.descripcion || '';
    document.getElementById('subcategoriaGenero').value = subcategory.genero || 'Unisex';
    document.getElementById('subcategoryModal').hidden = false;
  }

  async function deleteSubcategory(id) {
    if (!confirm('¿Estás seguro de eliminar esta subcategoría?')) return;

    try {
      await apiCall(`/subcategorias/${id}`, { method: 'DELETE' });
      await loadClassifications();
      alert('Subcategoría eliminada correctamente');
    } catch (error) {
      logger.error('Error eliminando subcategoría:', error);
      alert('Error al eliminar subcategoría');
    }
  }

  async function generateReport(reportType) {
    const reportNameMap = {
      usuarios: 'usuarios',
      productos: 'productos',
      ventas: 'ventas'
    };

    const reportName = reportNameMap[reportType];
    if (!reportName) {
      alert('Tipo de reporte no válido');
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const usuario = user.correo || 'Sistema';

      // El backend ahora genera PDF, así que usamos apiDownload que está preparada para blobs.
      const response = await apiDownload(`/reportes/${reportType}`, {
        method: 'POST',
        // El body puede estar vacío si no necesitas pasar filtros
        body: JSON.stringify({ 
          usuario: usuario,
          formato: 'pdf' })
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/pdf')) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_${reportType}_${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        alert(`Reporte de ${reportType} generado correctamente.`);
      } else {
        // Si la respuesta no es un PDF, es probable que sea un error en formato JSON.
        const errorData = await response.json().catch(() => ({ error: 'Respuesta inesperada del servidor.' }));
        logger.error('Respuesta no válida del servidor:', errorData);
        alert(`Error al generar el reporte: ${errorData.error || 'El servidor no devolvió un archivo PDF válido.'}`);
      }
    } catch (error) {
      logger.error(`Error generando reporte de ${reportName}:`, error);
      alert(`Error al generar reporte de ${reportName}: ` + (error.message || 'Error desconocido'));
    }
  }

  // ===== EVENT LISTENERS =====
  // Inicializar pestanas
  initTabs();
  initMetricCardNavigation(); // Inicializar la navegación desde las tarjetas

  // Usuarios
  document.getElementById('loadUsersBtn').addEventListener('click', loadUsers);
  document.getElementById('refreshUsersBtn').addEventListener('click', loadUsers);

  // Productos
  document.getElementById('addProductBtn').addEventListener('click', addProduct);
  document.getElementById('loadProductsBtn').addEventListener('click', loadProducts);

  // Campanas (Anadido para conectar con admin_campanas.js)
  const addCampaignBtn = document.getElementById('addCampaignBtn');
  if (addCampaignBtn) {
    addCampaignBtn.addEventListener('click', () => window.addCampaign && window.addCampaign());
  }

  // Clasificación
  document.getElementById('newCategoryBtn').addEventListener('click', addCategory);
  document.getElementById('newSubcategoryBtn').addEventListener('click', addSubcategory);
  document.getElementById('loadClassificationsBtn').addEventListener('click', loadClassifications);

  // Stocks
  document.getElementById('loadStocksBtn').addEventListener('click', loadStocks);
  document.getElementById('saveStocksBtn').addEventListener('click', saveStocks);

  // Reportes
  document.querySelectorAll('.generate-report-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const reportType = event.target.dataset.reportType;
      generateReport(reportType);
    });
  });

  // Links del carrito en la barra lateral
  const posLink = document.getElementById('pos-link');
  if (posLink) {
    posLink.addEventListener('click', (e) => {
      localStorage.setItem('activeCart', 'venta');
    });
  }
  // Modales
  document.getElementById('closeEditUserModal').addEventListener('click', () => {
    document.getElementById('editUserModal').hidden = true;
  });

  document.getElementById('closeProductModal').addEventListener('click', () => {
    document.getElementById('productModal').hidden = true;
  });

  document.getElementById('closeCategoryModal').addEventListener('click', () => {
    document.getElementById('categoryModal').hidden = true;
  });

  document.getElementById('closeSubcategoryModal').addEventListener('click', () => {
    document.getElementById('subcategoryModal').hidden = true;
  });

  // Modal de detalles de pedido
  document.getElementById('closeOrderDetailsModal').addEventListener('click', () => {
    document.getElementById('orderDetailsModal').hidden = true;
  });

  // Añadir un botón para generar ticket en el modal de detalles de pedido
  const orderDetailsModalBody = document.querySelector('#orderDetailsModal .modal-body');
  if (orderDetailsModalBody) {
      const generateTicketBtn = document.createElement('button');
      generateTicketBtn.className = 'btn-primary';
      generateTicketBtn.innerHTML = '<i class="fas fa-receipt"></i> Generar Ticket';
      generateTicketBtn.onclick = () => {
          const pedidoId = document.getElementById('orderDetailsContent').querySelector('p:first-child').textContent.split(': ')[1];
          if (pedidoId) window.generateTicket(pedidoId);
      };
      // Insertar el botón después de la tabla de productos
      const tableContainer = orderDetailsModalBody.querySelector('.table-container');
      if (tableContainer) {
          tableContainer.insertAdjacentElement('afterend', generateTicketBtn);
          generateTicketBtn.style.marginTop = '20px';
      }
  }

  document.getElementById('cancelEditUser').addEventListener('click', () => {
    document.getElementById('editUserModal').hidden = true;
  });

  // El botón cancelProduct ya está definido en el HTML
  const cancelProductBtn = document.getElementById('cancelProduct');
  if (cancelProductBtn) {
    cancelProductBtn.addEventListener('click', () => {
      document.getElementById('productModal').hidden = true;
    });
  }

  const cancelCategoryBtn = document.getElementById('cancelCategory');
  if (cancelCategoryBtn) {
    cancelCategoryBtn.addEventListener('click', () => {
      document.getElementById('categoryModal').hidden = true;
    });
  }

  const cancelSubcategoryBtn = document.getElementById('cancelSubcategory');
  if (cancelSubcategoryBtn) {
    cancelSubcategoryBtn.addEventListener('click', () => {
      document.getElementById('subcategoryModal').hidden = true;
    });
  }

  // Formularios
  document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const rol = document.getElementById('editUserRole').value;
    
    try {
      await apiCall(`/usuario/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ rol })
      });
      document.getElementById('editUserModal').hidden = true;
      await loadUsers();
      alert('Rol actualizado correctamente');
    } catch (error) {
      logger.error('Error actualizando usuario:', error);
      alert('Error al actualizar usuario');
    }
  });
  // Cargar categorías cuando se abre el modal (el listener de categoría se configura dentro de addProduct y editProduct)

  // Formulario de categoría
  document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('idCategoriaModal').value;
    const nombre = document.getElementById('categoriaNombre').value;
    const descripcion = document.getElementById('categoriaDescripcion').value;
    const imagenFile = document.getElementById('categoriaImagen').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion || '');
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    try {
      if (id) {
        await apiCall(`categorias/${id}`, {
          method: 'PUT',
          body: formData
        });
        alert('Categoría actualizada correctamente');
      } else {
        await apiCall('/categorias', {
          method: 'POST',
          body: formData
        });
        alert('Categoría creada correctamente');
      }
      document.getElementById('categoryModal').hidden = true;
      await loadClassifications();
    } catch (error) {
      logger.error('Error guardando categoría:', error);
      alert('Error al guardar categoría: ' + (error.message || 'Error desconocido'));
    }
  });

  // Formulario de subcategoría
  document.getElementById('subcategoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('idSubcategoriaModal').value;
    const nombre = document.getElementById('subcategoriaNombre').value;
    const descripcion = document.getElementById('subcategoriaDescripcion').value;
    const idCategoria = document.getElementById('subcategoriaCategoria').value;
    const genero = document.getElementById('subcategoriaGenero').value;
    const imagenFile = document.getElementById('subcategoriaImagen').files[0];

    if (!idCategoria) {
      alert('Por favor, seleccione una categoría');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion || '');
    formData.append('idCategoria', idCategoria);
    formData.append('genero', genero || 'Unisex');
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    try {
      if (id) {
        await apiCall(`/subcategorias/${id}`, {
          method: 'PUT',
          body: formData
        });
        alert('Subcategoría actualizada correctamente');
      } else {
        await apiCall('/subcategorias', {
          method: 'POST',
          body: formData
        });
        alert('Subcategoría creada correctamente');
      }
      document.getElementById('subcategoryModal').hidden = true;
      await loadClassifications();
    } catch (error) {
      logger.error('Error guardando subcategoría:', error);
      alert('Error al guardar subcategoría: ' + (error.message || 'Error desconocido'));
    }
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('idProducto').value;
    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const stock = parseInt(document.getElementById('stock').value);
    const idCategoria = document.getElementById('idCategoria').value || null;
    const idSubcategoria = document.getElementById('idSubcategoria').value || null;
    const imagenFile = document.getElementById('imagen').files[0];

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion || '');
    formData.append('precio', precio);
    formData.append('stock', stock);
    if (idCategoria) {
      formData.append('idCategoria', idCategoria);
    }
    if (idSubcategoria) {
      formData.append('idSubcategoria', idSubcategoria);
    }
    if (imagenFile) {
      formData.append('imagen', imagenFile);
    }

    // Si hay una imagen, aquí se podría manejar la subida
    // Por ahora, dejamos que el backend maneje la imagen como string
    // TODO: Implementar subida de archivos si es necesario

    try {
      if (id) {
        await apiCall(`/productos/${id}`, {
          method: 'PUT',
          body: formData
        });
        alert('Producto actualizado correctamente');
      } else {
        await apiCall('/productos', {
          method: 'POST',
          body: formData
        });
        alert('Producto creado correctamente');
      }
      document.getElementById('productModal').hidden = true;
      await loadProducts();
      // Recargar stocks también si estamos en esa pestana
      if (stocks.length > 0) {
        await loadStocks();
      }
    } catch (error) {
      logger.error('Error guardando producto:', error);
      alert('Error al guardar producto: ' + (error.message || 'Error desconocido'));
    }
  });

  // ===== EVENT LISTENERS DINÁMICOS (para tablas) =====
  document.body.addEventListener('click', function(event) {
    // Botón para ver detalles de pedido
    if (event.target.classList.contains('view-order-details-btn')) {
      const idPedido = event.target.dataset.orderId;
      if (idPedido) {
        showOrderDetails(idPedido);
      }
    }
    // Botón para generar ticket de pago
    if (event.target.classList.contains('generate-ticket-btn')) {
      const idPedido = event.target.dataset.orderId;
      if (idPedido) window.generateTicket(idPedido);
    }
  });

  // ===== MÉTRICAS DEL DASHBOARD =====
let chartInstances = {
  income: null,
  status: null,
  products: null,
  payments: null
};

async function loadMetrics(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await apiCall(`/dashboard/metricas?${queryString}`);

    // 1. Actualizar Tarjetas de Resumen
    if (response.summary) {
      const totalUsersEl = document.getElementById('metric-total-users');
      if (totalUsersEl) totalUsersEl.textContent = response.summary.usuarios;

      // El HTML tiene Ticket Promedio, calculamos el valor
      const avgTicketEl = document.getElementById('metric-average-ticket');
      if (avgTicketEl) {
        const ingresos = parseFloat(response.summary.ingresos) || 0;
        const pedidos = parseInt(response.summary.pedidos) || 0;
        const promedio = pedidos > 0 ? (ingresos / pedidos) : 0;
        avgTicketEl.textContent = `S/ ${promedio.toFixed(2)}`;
      }

      const totalOrdersEl = document.getElementById('metric-total-orders');
      if (totalOrdersEl) totalOrdersEl.textContent = response.summary.pedidos;

      const totalIncomeEl = document.getElementById('metric-total-income');
      if (totalIncomeEl) totalIncomeEl.textContent = `S/ ${parseFloat(response.summary.ingresos).toFixed(2)}`;
    }

    // 2. Renderizar Gráficos
    if (response.charts) {
      renderChart('income', 'incomeChart', 'line', response.charts.income, 'Ingresos', '#9A8CFF');
      renderChart('status', 'statusChart', 'doughnut', response.charts.status, 'Pedidos', ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']);
      renderChart('products', 'productsChart', 'bar', response.charts.products, 'Unidades', '#36A2EB');
      renderChart('payments', 'paymentsChart', 'pie', response.charts.payments, 'Pagos', ['#4BC0C0', '#FF9F40', '#FF6384']);
    }

  } catch (error) {
    logger.error('Error cargando métricas:', error);
    // No mostrar alerta intrusiva en carga inicial, solo log
  }
}

// Función genérica para renderizar gráficos
function renderChart(key, canvasId, type, data, label, colors) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  // Destruir instancia anterior si existe
  if (chartInstances[key]) {
    chartInstances[key].destroy();
  }

  // Configuración de colores
  const bgColors = Array.isArray(colors) ? colors : (type === 'line' ? `${colors}33` : colors); // Transparencia para line area
  const borderColors = Array.isArray(colors) ? colors : colors;

  chartInstances[key] = new Chart(ctx, {
    type: type,
    data: {
      labels: data.labels,
      datasets: [{
        label: label,
        data: data.data,
        backgroundColor: bgColors,
        borderColor: borderColors,
        borderWidth: 1,
        fill: type === 'line', // Rellenar área bajo la línea
        tension: 0.4 // Suavizar curvas
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: (key === 'products') ? 'y' : 'x', // Barras horizontales para productos
      plugins: {
        legend: {
          display: type !== 'bar', // Ocultar leyenda en barras si solo hay una serie
          position: 'bottom',
          labels: { boxWidth: 12 }
        }
      },
      scales: (type === 'doughnut' || type === 'pie') ? {} : {
        y: { beginAtZero: true }
      }
    }
  });
}

  function renderPaymentMethodsChart(data) {
    const ctx = document.getElementById('paymentMethodsChart').getContext('2d');
    if (paymentMethodsChart) paymentMethodsChart.destroy();

    paymentMethodsChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: data.map(item => item.metodoPago),
        datasets: [{
          data: data.map(item => item.count),
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  function renderTopProductsChart(data) {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    if (topProductsChart) topProductsChart.destroy();

    topProductsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.nombre),
        datasets: [{
          label: 'Unidades Vendidas',
          data: data.map(item => item.totalVendido),
          backgroundColor: 'rgba(78, 115, 223, 0.8)',
          borderColor: 'rgba(78, 115, 223, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: { x: { beginAtZero: true } }
      }
    });
  }

  // Lógica de filtros de métricas
  const timeFilterSelect = document.getElementById('time-filter');
  const customDateRange = document.getElementById('custom-date-range');
  const applyMetricsFilterBtn = document.getElementById('apply-metrics-filter');

  if (timeFilterSelect) {
    timeFilterSelect.addEventListener('change', () => {
      customDateRange.hidden = timeFilterSelect.value !== 'custom';
    });
  }

  if (applyMetricsFilterBtn) {
    applyMetricsFilterBtn.addEventListener('click', () => {
      const filter = timeFilterSelect.value;
      let params = { filter };

      if (filter === 'custom') {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        if (startDate && endDate) {
          params.fechaInicio = startDate;
          params.fechaFin = endDate;
        }
      }
      
      loadMetrics(params);
    });
  }

  // Cargar datos iniciales (solo usuarios por defecto)
  loadUsers();
});
