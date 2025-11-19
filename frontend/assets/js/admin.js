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
    }
  }

  // Funciones de utilidad
  async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  async function apiDownload(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}. La ruta en el servidor podría no existir.`);
      }

      return response; // Devolvemos la respuesta completa para manejar el blob
    } catch (error) {
      console.error('API Download Error:', error);
      throw error;
    }
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
  let categorias = [];
  let subcategorias = [];

  async function loadCategories() {
    try {
      categorias = await apiCall('/categorias');
      renderCategorySelect();
    } catch (error) {
      console.error('Error cargando categorías:', error);
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
      console.error('Error cargando subcategorías:', error);
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
      console.error('Error cargando productos:', error);
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
      <tr>
        <td>${product.idProducto}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria || 'Sin categoría'}</td>
        <td>S/ ${parseFloat(product.precio).toFixed(2)}</td>
        <td>${product.stock}</td>
        <td>
          <button class="btn-secondary" onclick="editProduct(${product.idProducto})">Editar</button>
          <button class="btn-danger" onclick="deleteProduct(${product.idProducto})">Eliminar</button>
        </td>
      </tr>
    `).join('');
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
      console.error('Error eliminando producto:', error);
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
      console.error('Error cargando stocks:', error);
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
        <td>${product.idProducto}</td>
        <td>${product.nombre}</td>
        <td>${product.categoria || 'Sin categoría'}</td>
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
      console.error('Error actualizando stocks:', error);
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
      console.error('Error cargando clasificaciones:', error);
      alert('Error al cargar clasificaciones');
    }
  }

  async function loadSubcategoriesAll() {
    try {
      subcategorias = await apiCall('/subcategorias');
      return subcategorias;
    } catch (error) {
      console.error('Error cargando todas las subcategorías:', error);
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
      const imagenUrl = cat.imagen 
        ? (cat.imagen.startsWith('http') ? cat.imagen : (cat.imagen.startsWith('/') ? cat.imagen : `../assets/img/${cat.imagen}`))
        : null;
      return `
      <tr>
        <td>${cat.idCategoria}</td>
        <td>${cat.nombre || 'Sin nombre'}</td>
        <td>${cat.descripcion || 'Sin descripción'}</td>
        <td>
          ${imagenUrl ? `<img src="${imagenUrl}" alt="${cat.nombre}" style="max-width: 60px; max-height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.style.display='none'">` : 'Sin imagen'}
        </td>
        <td>
          <button class="btn-secondary" onclick="editCategory(${cat.idCategoria})">Editar</button>
          <button class="btn-danger" onclick="deleteCategory(${cat.idCategoria})">Eliminar</button>
        </td>
      </tr>
    `;
    }).join('');
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
      const imagenUrl = sub.imagen 
        ? (sub.imagen.startsWith('http') ? sub.imagen : (sub.imagen.startsWith('/') ? sub.imagen : `../assets/img/${sub.imagen}`))
        : null;
      return `
      <tr>
        <td>${sub.idSubcategoria}</td>
        <td>${sub.nombre || 'Sin nombre'}</td>
        <td>${sub.descripcion || 'Sin descripción'}</td>
        <td>${categoria ? categoria.nombre : 'Sin categoría'}</td>
        <td>${sub.genero || 'Unisex'}</td>
        <td>
          ${imagenUrl ? `<img src="${imagenUrl}" alt="${sub.nombre}" style="max-width: 60px; max-height: 60px; border-radius: 8px; object-fit: cover;" onerror="this.style.display='none'">` : 'Sin imagen'}
        </td>
        <td>
          <button class="btn-secondary" onclick="editSubcategory(${sub.idSubcategoria})">Editar</button>
          <button class="btn-danger" onclick="deleteSubcategory(${sub.idSubcategoria})">Eliminar</button>
        </td>
      </tr>
    `;
    }).join('');
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
      console.error('Error eliminando categoría:', error);
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
      console.error('Error eliminando subcategoría:', error);
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
        body: JSON.stringify({ usuario })
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
        console.error('Respuesta no válida del servidor:', errorData);
        alert(`Error al generar el reporte: ${errorData.error || 'El servidor no devolvió un archivo PDF válido.'}`);
      }
    } catch (error) {
      console.error(`Error generando reporte de ${reportName}:`, error);
      alert(`Error al generar reporte de ${reportName}: ` + (error.message || 'Error desconocido'));
    }
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

  // Clasificación
  document.getElementById('newCategoryBtn').addEventListener('click', addCategory);
  document.getElementById('newSubcategoryBtn').addEventListener('click', addSubcategory);
  document.getElementById('loadClassificationsBtn').addEventListener('click', loadClassifications);

  // Stocks
  document.getElementById('loadStocksBtn').addEventListener('click', loadStocks);
  document.getElementById('saveStocksBtn').addEventListener('click', saveStocks);

  // Reportes
  document.getElementById('generateUsersReport').addEventListener('click', () => generateReport('usuarios'));
  document.getElementById('generateProductsReport').addEventListener('click', () => generateReport('productos'));
  document.getElementById('generateVentasReport').addEventListener('click', () => generateReport('ventas'));

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

  // Cargar categorías cuando se abre el modal (el listener de categoría se configura dentro de addProduct y editProduct)

  // Formulario de categoría
  document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('idCategoriaModal').value;
    const nombre = document.getElementById('categoriaNombre').value;
    const descripcion = document.getElementById('categoriaDescripcion').value;
    const imagenFile = document.getElementById('categoriaImagen').files[0];

    const categoryData = {
      nombre,
      descripcion: descripcion || '',
      imagen: '' // Por ahora, el backend manejará la imagen como string
    };

    try {
      if (id) {
        await apiCall(`/categorias/${id}`, {
          method: 'PUT',
          body: JSON.stringify(categoryData)
        });
        alert('Categoría actualizada correctamente');
      } else {
        await apiCall('/categorias', {
          method: 'POST',
          body: JSON.stringify(categoryData)
        });
        alert('Categoría creada correctamente');
      }
      document.getElementById('categoryModal').hidden = true;
      await loadClassifications();
    } catch (error) {
      console.error('Error guardando categoría:', error);
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

    const subcategoryData = {
      nombre,
      descripcion: descripcion || '',
      idCategoria: parseInt(idCategoria),
      genero: genero || 'Unisex',
      imagen: '' // Por ahora, el backend manejará la imagen como string
    };

    try {
      if (id) {
        await apiCall(`/subcategorias/${id}`, {
          method: 'PUT',
          body: JSON.stringify(subcategoryData)
        });
        alert('Subcategoría actualizada correctamente');
      } else {
        await apiCall('/subcategorias', {
          method: 'POST',
          body: JSON.stringify(subcategoryData)
        });
        alert('Subcategoría creada correctamente');
      }
      document.getElementById('subcategoryModal').hidden = true;
      await loadClassifications();
    } catch (error) {
      console.error('Error guardando subcategoría:', error);
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

    const productData = {
      nombre,
      descripcion: descripcion || '',
      precio,
      stock,
      idCategoria: idCategoria ? parseInt(idCategoria) : null,
      idSubcategoria: idSubcategoria ? parseInt(idSubcategoria) : null,
      imagen: '' // Por ahora, el backend manejará la imagen
    };

    // Si hay una imagen, aquí se podría manejar la subida
    // Por ahora, dejamos que el backend maneje la imagen como string
    // TODO: Implementar subida de archivos si es necesario

    try {
      if (id) {
        await apiCall(`/productos/${id}`, {
          method: 'PUT',
          body: JSON.stringify(productData)
        });
        alert('Producto actualizado correctamente');
      } else {
        await apiCall('/productos', {
          method: 'POST',
          body: JSON.stringify(productData)
        });
        alert('Producto creado correctamente');
      }
      document.getElementById('productModal').hidden = true;
      await loadProducts();
      // Recargar stocks también si estamos en esa pestaña
      if (stocks.length > 0) {
        await loadStocks();
      }
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert('Error al guardar producto: ' + (error.message || 'Error desconocido'));
    }
  });

  // Funciones globales para onclick
  window.editUser = editUser;
  window.deleteUser = deleteUser;
  window.editProduct = editProduct;
  window.deleteProduct = deleteProduct;
  window.updateStockChange = updateStockChange;
  window.editCategory = editCategory;
  window.deleteCategory = deleteCategory;
  window.editSubcategory = editSubcategory;
  window.deleteSubcategory = deleteSubcategory;

  // Cargar datos iniciales (solo usuarios por defecto)
  loadUsers();
});
