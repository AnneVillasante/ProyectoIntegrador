// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
  // Contenedor principal
  const productosGrid = document.getElementById('productosGrid');
  const productosTitle = document.querySelector('.productos-title');
  const productosSubtitle = document.querySelector('.productos-subtitle');
  const ordenarSelect = document.getElementById('ordenar');
  const categoriasFiltroDiv = document.getElementById('categoriasFiltro');
  const filtrosToggle = document.getElementById('filtrosToggle');
  const cerrarSidebar = document.getElementById('cerrarSidebar');
  const filtrosSidebar = document.getElementById('filtrosSidebar');
  const paginacionContainer = document.getElementById('paginacionContainer');

  let allProductos = []; // Almacenar todos los productos
  let activeFilters = { categoria: new Set() };

  // Estado de paginación
  const PRODUCTOS_POR_PAGINA = 20;
  let currentPage = 1;

  // Si el placeholder no existe, significa que el servidor ya renderizó el contenido.
  if (!productosGrid || !productosGrid.innerHTML.includes('PRODUCTS_PLACEHOLDER')) {
    console.log('Productos renderizados por el servidor. El script del cliente no se ejecutará.');
    return;
  }

  if (!productosGrid) {
    console.error('No se encontró el contenedor de productos.');
    return;
  }
  try {
    // Obtener productos desde el backend usando la ruta correcta
    const apiUrl = `${window.CONFIG.API_URL}/productos`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    allProductos = await response.json();

    // Obtener categoría de la URL para filtro inicial
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaUrl = urlParams.get('categoria');
    if (categoriaUrl) {
      activeFilters.categoria.add(categoriaUrl.toLowerCase());
      if (productosTitle) productosTitle.textContent = `Categoría: ${categoriaUrl}`;
      if (productosSubtitle) productosSubtitle.textContent = `Explora nuestra colección de ${categoriaUrl}`;
    }

    populateFilters(allProductos);
    renderProductos();

  } catch (error) {
    console.error('Error cargando productos:', error);
    productosGrid.innerHTML = `<p class="error">Error al cargar los productos. Por favor, intenta más tarde.</p>`;
  }

  function populateFilters(productos) {
    if (!categoriasFiltroDiv) return;

    const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    categoriasFiltroDiv.innerHTML = categorias.map(cat => `
      <label>
        <input type="checkbox" class="filtro-categoria" value="${cat.toLowerCase()}" ${activeFilters.categoria.has(cat.toLowerCase()) ? 'checked' : ''}>
        ${cat}
      </label>
    `).join('');

    categoriasFiltroDiv.querySelectorAll('.filtro-categoria').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const categoria = e.target.value;
        if (e.target.checked) {
          activeFilters.categoria.add(categoria);
        } else {
          activeFilters.categoria.delete(categoria);
        }
        currentPage = 1; // Resetear a la primera página al cambiar filtros
        renderProductos();
      });
    });
  }

  function renderProductos() {
    let productosFiltrados = [...allProductos];

    // Aplicar filtros
    if (activeFilters.categoria.size > 0) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.categoria && activeFilters.categoria.has(p.categoria.toLowerCase())
      );
    }

    // Aplicar ordenamiento
    const orden = ordenarSelect.value;
    switch (orden) {
      case 'precio-asc':
        productosFiltrados.sort((a, b) => (a.precio || 0) - (b.precio || 0));
        break;
      case 'precio-desc':
        productosFiltrados.sort((a, b) => (b.precio || 0) - (a.precio || 0));
        break;
      case 'nombre-asc':
        productosFiltrados.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
        break;
      case 'nombre-desc':
        productosFiltrados.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
        break;
    }

    if (productosFiltrados.length === 0) {
      let mensaje = 'No hay productos disponibles';
      if (activeFilters.categoria.size > 0) {
        mensaje += ` con los filtros seleccionados.`;
      } else {
        mensaje += '.';
      }
      productosGrid.innerHTML = `<p class="sin-productos">${mensaje}</p>`;
      return;
    }

    // Lógica de paginación
    const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
    if (currentPage > totalPaginas) {
      currentPage = totalPaginas > 0 ? totalPaginas : 1;
    }
    const inicio = (currentPage - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;
    const productosPagina = productosFiltrados.slice(inicio, fin);

    productosGrid.innerHTML = productosPagina.map(prod => createProductoCard(prod)).join('');
    addCardEventListeners();
    renderPaginacion(totalPaginas);
  }

  function renderPaginacion(totalPaginas) {
    if (!paginacionContainer) return;

    if (totalPaginas <= 1) {
      paginacionContainer.innerHTML = '';
      return;
    }

    let botones = '';
    for (let i = 1; i <= totalPaginas; i++) {
      botones += `<button class="btn-paginacion ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    paginacionContainer.innerHTML = botones;

    paginacionContainer.querySelectorAll('.btn-paginacion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentPage = parseInt(e.target.dataset.page);
        renderProductos();
        window.scrollTo(0, 0); // Opcional: scroll al inicio de la página
      });
    });
  }

  ordenarSelect.addEventListener('change', () => {
    currentPage = 1; // Resetear a la primera página al cambiar el orden
    renderProductos();
  });

  // Lógica para sidebar móvil
  if (filtrosToggle && filtrosSidebar && cerrarSidebar) {
    filtrosToggle.addEventListener('click', () => filtrosSidebar.classList.add('active'));
    cerrarSidebar.addEventListener('click', () => filtrosSidebar.classList.remove('active'));
    // Opcional: cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (filtrosSidebar.classList.contains('active') && !filtrosSidebar.contains(e.target) && e.target !== filtrosToggle) {
        filtrosSidebar.classList.remove('active');
      }
    });
  }

  function createProductoCard(prod) {
      // Manejar la URL de la imagen
      let imagenUrl = '../assets/img/placeholder.png';
      if (prod.imagen) {
        if (prod.imagen.startsWith('http')) {
          imagenUrl = prod.imagen;
        } else if (prod.imagen.startsWith('/')) { // Ruta absoluta desde la raíz del servidor
          imagenUrl = `${window.CONFIG.IMG_URL}${prod.imagen}`;
        } else {
          // Asume una ruta relativa que necesita la base de la imagen
          imagenUrl = `${window.CONFIG.IMG_URL}/uploads/productos/${prod.imagen}`;
        }
      }

      return `
      <div class="producto-card" data-id-producto="${prod.idProducto}">
        <img src="${imagenUrl}" alt="${prod.nombre}" class="producto-img" onerror="this.src='../assets/img/placeholder.png'">
        <div class="producto-info-simple">
          <h3>${prod.nombre || 'Sin nombre'}</h3>
          <div class="acciones">
            <button class="btn-primary agregar" data-id="${prod.idProducto}">Agregar al Carrito</button>
          </div>
        </div>
      </div>
    `;
  }

  function addCardEventListeners() {
    productosGrid.querySelectorAll('.agregar').forEach(button => {
      button.addEventListener('click', async (e) => {
        const productId = e.target.getAttribute('data-id');
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Debes iniciar sesión para agregar productos al carrito.');
          window.location.href = '/pages/login.html';
          return;
        }

        try {
          const response = await fetch(`${window.CONFIG.API_URL}/carrito`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              idProducto: parseInt(productId),
              cantidad: 1
            })
          });

          if (response.ok) {
            alert(`Producto añadido al carrito.`);
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'No se pudo añadir el producto al carrito.');
          }
        } catch (error) {
          console.error('Error al añadir al carrito:', error);
          alert(`Error: ${error.message}`);
        }
      });
    });
  }
});
