// Panel Administrativo - Funcionalidad completa con pestañas
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticación y rol
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || user.rol !== 'Administrador') {
    alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
    window.location.href = '/';
    return;
  }

  // Variables globales
  let users = [];
  let products = [];
  let stocks = [];
  let stockChanges = {};

  // API Base URL
  const API_BASE = 'http://localhost:4000/api';

  // ===== SISTEMA DE PESTAÑAS =====
  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remover clase active de todos los botones y contenidos
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Agregar clase active al botón y contenido seleccionado
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
        
        // Cargar datos según la pestaña activa
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
        break;
      case 'stocks':
        if (stocks.length === 0) loadStocks();
        break;
      case 'reports':
        // Los reportes no necesitan precarga
        break;
    }
  }

  // Funciones de utilidad
  async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    });
    return response.json();
  }

  // ===== USUARIOS =====
  async function loadUsers() {
    try {
      users = await apiCall('/usuarios');
      renderUsersTable();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error al cargar usuarios');
    }
  }

  function renderUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${user.idUsuario}</td>
        <td>${user.nombres} ${user.apellidos}</td>
        <td>${user.correo}</td>
        <td>${user.rol}</td>
        <td>
          <button class="btn-secondary" onclick="editUser(${user.idUsuario})">Editar Rol</button>
          <button class="btn-danger" onclick="deleteUser(${user.idUsuario})">Eliminar</button>
        </td>
      </tr>
    `).join('');
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
      await apiCall(`/usuarios/${id}`, { method: 'DELETE' });
      await loadUsers();
      alert('Usuario eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error al eliminar usuario');
    }
  }

  // ===== PRODUCTOS =====
  async function loadProducts() {
    try {
      products = await apiCall('/products');
      renderProductsTable();
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    }
  }

  function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = products.map(product => `
      <tr>
        <td>${product.idProducto}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria}</td>
        <td>S/ ${product.precio.toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn-secondary" onclick="editProduct(${product.idProducto})">Editar</button>
          <button class="btn-danger" onclick="deleteProduct(${product.idProducto})">Eliminar</button>
        </td>
      </tr>
    `).join('');
  }

  function addProduct() {
    document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').hidden = false;
  }

  function editProduct(id) {
    const product = products.find(p => p.idProducto === id);
    if (!product) return;

    document.getElementById('productModalTitle').textContent = 'Editar Producto';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.nombre;
    document.getElementById('productCategory').value = product.categoria;
    document.getElementById('productPrice').value = product.precio;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productModal').hidden = false;
  }

  async function deleteProduct(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await apiCall(`/products/${id}`, { method: 'DELETE' });
      await loadProducts();
      alert('Producto eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar producto');
    }
  }

  // ===== STOCKS =====
  async function loadStocks() {
    try {
      stocks = await apiCall('/products');
      renderStocksTable();
    } catch (error) {
      console.error('Error cargando stocks:', error);
      alert('Error al cargar stocks');
    }
  }

  function renderStocksTable() {
    const tbody = document.getElementById('stocksTableBody');
    tbody.innerHTML = stocks.map(product => `
      <tr>
        <td>${product.idProducto}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria}</td>
        <td>${product.stock}</td>
        <td>
          <input type="number" class="stock-input" 
                 value="${product.stock}" 
                 min="0" 
                 onchange="updateStockChange(${product.idProducto}, this.value)">
        </td>
      </tr>
    `).join('');
  }

  function updateStockChange(id, value) {
    stockChanges[id] = parseInt(value);
    const saveBtn = document.getElementById('saveStocksBtn');
    saveBtn.disabled = Object.keys(stockChanges).length === 0;
  }

  async function saveStocks() {
    try {
      for (const [id, stock] of Object.entries(stockChanges)) {
        await apiCall(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ stock: stock })
        });
      }
      stockChanges = {};
      document.getElementById('saveStocksBtn').disabled = true;
      await loadStocks();
      alert('Stocks actualizados correctamente');
    } catch (error) {
      console.error('Error actualizando stocks:', error);
      alert('Error al actualizar stocks');
    }
  }

  // ===== REPORTES =====
  function generateUsersReport() {
    const reportData = users.map(user => ({
      ID: user.idUsuario,
      Nombre: `${user.nombres} ${user.apellidos}`,
      Correo: user.correo,
      Rol: user.rol
    }));
    downloadReport(reportData, 'reporte_usuarios');
  }

  function generateProductsReport() {
    const reportData = products.map(product => ({
      ID: product.idProducto,
      Nombre: product.nombre,
      Categoría: product.categoria,
      Precio: `S/ ${product.precio.toFixed(2)}`,
      Stock: product.stock
    }));
    downloadReport(reportData, 'reporte_productos');
  }

  function generateStocksReport() {
    const reportData = stocks.map(product => ({
      ID: product.idProducto,
      Producto: product.nombre,
      Categoría: product.categoria,
      'Stock Actual': product.stock
    }));
    downloadReport(reportData, 'reporte_stocks');
  }

  function downloadReport(data, filename) {
    const csv = convertToCSV(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  function convertToCSV(data) {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');
    return csvContent;
  }

  // ===== EVENT LISTENERS =====
  // Inicializar pestañas
  initTabs();

  // Usuarios
  document.getElementById('loadUsersBtn').addEventListener('click', loadUsers);
  document.getElementById('refreshUsersBtn').addEventListener('click', loadUsers);

  // Productos
  document.getElementById('addProductBtn').addEventListener('click', addProduct);
  document.getElementById('loadProductsBtn').addEventListener('click', loadProducts);

  // Stocks
  document.getElementById('loadStocksBtn').addEventListener('click', loadStocks);
  document.getElementById('saveStocksBtn').addEventListener('click', saveStocks);

  // Reportes
  document.getElementById('generateUsersReport').addEventListener('click', generateUsersReport);
  document.getElementById('generateProductsReport').addEventListener('click', generateProductsReport);
  document.getElementById('generateStocksReport').addEventListener('click', generateStocksReport);

  // Modales
  document.getElementById('closeEditUserModal').addEventListener('click', () => {
    document.getElementById('editUserModal').hidden = true;
  });

  document.getElementById('closeProductModal').addEventListener('click', () => {
    document.getElementById('productModal').hidden = true;
  });

  document.getElementById('cancelEditUser').addEventListener('click', () => {
    document.getElementById('editUserModal').hidden = true;
  });

  document.getElementById('cancelProduct').addEventListener('click', () => {
    document.getElementById('productModal').hidden = true;
  });

  // Formularios
  document.getElementById('editUserForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const rol = document.getElementById('editUserRole').value;
    
    try {
      await apiCall(`/usuarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ rol })
      });
      document.getElementById('editUserModal').hidden = true;
      await loadUsers();
      alert('Rol actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error al actualizar usuario');
    }
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('productId').value;
    const productData = {
      nombre: document.getElementById('productName').value,
      categoria: document.getElementById('productCategory').value,
      precio: parseFloat(document.getElementById('productPrice').value),
      stock: parseInt(document.getElementById('productStock').value)
    };

    try {
      if (id) {
        await apiCall(`/products/${id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
        alert('Producto actualizado correctamente');
      } else {
        await apiCall('/products', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        alert('Producto creado correctamente');
      }
      document.getElementById('productModal').hidden = true;
      await loadProducts();
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar producto');
    }
  });

  // Funciones globales para onclick
  window.editUser = editUser;
  window.deleteUser = deleteUser;
  window.editProduct = editProduct;
  window.deleteProduct = deleteProduct;
  window.updateStockChange = updateStockChange;

  // Cargar datos iniciales (solo usuarios por defecto)
  loadUsers();
});
