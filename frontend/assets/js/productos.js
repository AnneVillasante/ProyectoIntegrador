// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
<<<<<<< HEAD
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
=======
  const API_BASE = 'http://localhost:4000/api';

  // --- ELEMENTOS DEL DOM ---
  const productosGrid = document.getElementById('productosGrid');
  const productosTitle = document.querySelector('.productos-title');
  const productosSubtitle = document.querySelector('.productos-subtitle');
  const categoriasContainer = document.getElementById('categorias-container');
  const filtroSubcategoriasContainer = document.getElementById('filtroSubcategorias');
  const ordenarSelect = document.getElementById('ordenarProductos');
  const paginacionContainer = document.getElementById('paginacion');
  const priceRange = document.getElementById('priceRange');
  const activeFiltersContainer = document.getElementById('activeFiltersContainer');
  const limpiarFiltrosBtn = document.getElementById('limpiarFiltrosBtn');
  const priceValue = document.getElementById('priceValue');
>>>>>>> progreso

  // --- ESTADO DE LA APLICACIÓN ---
  let allProductos = [];
  let allCategorias = [];
  let allSubcategorias = [];

<<<<<<< HEAD
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

<<<<<<< HEAD
    populateFilters(allProductos);
    renderProductos();
=======
    if (!Array.isArray(productos) || productos.length === 0) {
      productosGrid.innerHTML = `<p class="sin-productos">No hay productos disponibles${categoria ? ` en la categoría ${categoria}` : ''}.</p>`;
      return;
=======
  let estadoFiltros = {
    categoria: null,
    subcategorias: new Set(), // Usar un Set para múltiples subcategorías
    busqueda: null, // Nuevo estado para el término de búsqueda
    precioMax: 500, // Valor inicial del slider
    orden: 'recomendado',
    paginaActual: 1,
    productosPorPagina: 12,
  };

  // --- FUNCIONES DE OBTENCIÓN DE DATOS ---
  const fetchData = async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}/${endpoint}`);
      if (!response.ok) throw new Error(`Error al cargar ${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // --- FUNCIONES DE RENDERIZADO ---

  const renderizarProductos = () => {
    let productosFiltrados = [...allProductos];

    // 1. Filtrar por término de búsqueda (si existe)
    if (estadoFiltros.busqueda) {
      productosFiltrados = productosFiltrados.filter(p => 
        p.nombre.toLowerCase().includes(estadoFiltros.busqueda.toLowerCase())
      );
    }

    // 2. Filtrar por categoría
    if (estadoFiltros.categoria) {
      productosFiltrados = productosFiltrados.filter(p => p.categoria === estadoFiltros.categoria);
>>>>>>> progreso
    }

    // 3. Filtrar por subcategoría
    if (estadoFiltros.subcategorias.size > 0) {
      productosFiltrados = productosFiltrados.filter(p => 
        estadoFiltros.subcategorias.has(p.subcategoria)
      );
    }

    // 4. Filtrar por precio
    if (estadoFiltros.precioMax < 500) { // Solo filtra si el precio no es el máximo
      productosFiltrados = productosFiltrados.filter(p => p.precio <= estadoFiltros.precioMax);
    }

    // 5. Ordenar
    switch (estadoFiltros.orden) {
      case 'precio-asc':
        productosFiltrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        productosFiltrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    // 6. Paginación
    const inicio = (estadoFiltros.paginaActual - 1) * estadoFiltros.productosPorPagina;
    const fin = inicio + estadoFiltros.productosPorPagina;
    const productosPaginados = productosFiltrados.slice(inicio, fin);

    // Renderizar tarjetas
    if (productosPaginados.length === 0) {
      productosGrid.innerHTML = `<p class="sin-productos">No se encontraron productos con los filtros seleccionados.</p>`;
    } else {
      productosGrid.innerHTML = productosPaginados.map(crearTarjetaProducto).join('');
    }

    renderizarPaginacion(productosFiltrados.length);
    renderizarFiltrosActivos();
    agregarEventListenersTarjetas();
  };

  const crearTarjetaProducto = (prod) => {
    let imagenUrl = prod.imagen ? `http://localhost:4000/${prod.imagen.replace(/\\/g, '/')}` : '../assets/img/placeholder.png';
    
    return `
      <div class="producto-card">
        <img src="${imagenUrl}" alt="${prod.nombre}" class="producto-img" onerror="this.src='../assets/img/placeholder.png'">
        <div class="producto-info">
          <h3>${prod.nombre || 'Sin nombre'}</h3>
          <p class="precio">S/ ${parseFloat(prod.precio || 0).toFixed(2)}</p>
          <div class="acciones">
            <button class="btn-primary agregar" data-id="${prod.idProducto}">Agregar</button>
          </div>
        </div>
      </div>
    `;
  };

  const renderizarFiltros = () => {
    // Categorías
    const categoriasHtml = allCategorias.map(cat => {
      // Si hay una categoría en el estado (desde la URL), la marcamos como activa
      const isActive = estadoFiltros.categoria && estadoFiltros.categoria.toLowerCase() === cat.nombre.toLowerCase();
      return `<button class="btn-filtro ${isActive ? 'active' : ''}" data-categoria="${cat.nombre}">${cat.nombre}</button>`;
    }).join('');

    // Si no hay categoría en el estado (ni por filtro ni por URL), el botón "Todas" es el activo
    const todasActivo = !estadoFiltros.categoria ? 'active' : '';
    categoriasContainer.innerHTML = `<button class="btn-filtro ${todasActivo}" data-categoria="all">Todas</button>${categoriasHtml}`;

    // Subcategorías
    const subcategoriasHtml = allSubcategorias.map(sub => `<li><label><input type="checkbox" data-subcategoria="${sub.nombre}"> ${sub.nombre}</label></li>`).join('');
    filtroSubcategoriasContainer.innerHTML = `<h4>Subcategoría</h4><ul>${subcategoriasHtml}</ul>`;

    // Event Listeners para filtros de categoría
    categoriasContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoriasContainer.querySelector('.btn-filtro.active')?.classList.remove('active'); // Quita la clase activa del botón anterior
        e.target.classList.add('active');
        const categoria = e.target.dataset.categoria;
        estadoFiltros.categoria = categoria === 'all' ? null : categoria;
        estadoFiltros.paginaActual = 1;
        renderizarProductos();
      });
    });

    filtroSubcategoriasContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const subcategoria = e.target.dataset.subcategoria;
        if (e.target.checked) {
          estadoFiltros.subcategorias.add(subcategoria);
        } else {
          estadoFiltros.subcategorias.delete(subcategoria);
        }
        estadoFiltros.paginaActual = 1;
        renderizarProductos();
      });
    });
  };

  const renderizarFiltrosActivos = () => {
    activeFiltersContainer.innerHTML = '';
    let hayFiltros = false;

    // Etiquetas para subcategorías
    estadoFiltros.subcategorias.forEach(sub => {
      const tag = document.createElement('div');
      tag.className = 'filter-tag';
      tag.innerHTML = `${sub} <button class="remove-tag" data-subcategoria="${sub}">&times;</button>`;
      tag.querySelector('.remove-tag').addEventListener('click', () => {
        estadoFiltros.subcategorias.delete(sub);
        // Desmarcar el checkbox correspondiente
        const checkbox = filtroSubcategoriasContainer.querySelector(`input[data-subcategoria="${sub}"]`);
        if (checkbox) checkbox.checked = false;
        renderizarProductos();
      });
      activeFiltersContainer.appendChild(tag);
      hayFiltros = true;
    });

    // Etiqueta para precio (si se ha modificado)
    if (estadoFiltros.precioMax < 500) {
      const tag = document.createElement('div');
      tag.className = 'filter-tag';
      tag.innerHTML = `Precio < S/ ${estadoFiltros.precioMax.toFixed(2)} <button class="remove-tag" data-tipo="precio">&times;</button>`;
      tag.querySelector('.remove-tag').addEventListener('click', () => {
        estadoFiltros.precioMax = 500;
        priceRange.value = 500;
        priceValue.textContent = `S/ 500.00`;
        renderizarProductos();
      });
      activeFiltersContainer.appendChild(tag);
      hayFiltros = true;
    }
    limpiarFiltrosBtn.hidden = !hayFiltros;
  };

  const renderizarPaginacion = (totalProductos) => {
    const totalPaginas = Math.ceil(totalProductos / estadoFiltros.productosPorPagina);
    paginacionContainer.innerHTML = '';
    if (totalPaginas <= 1) return;

    for (let i = 1; i <= totalPaginas; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === estadoFiltros.paginaActual) {
        btn.classList.add('active');
      }
      btn.addEventListener('click', () => {
        estadoFiltros.paginaActual = i;
        renderizarProductos();
      });
      paginacionContainer.appendChild(btn);
    }
  };

  // --- LÓGICA DE INICIALIZACIÓN Y EVENTOS ---

  const inicializar = async () => {
    productosGrid.innerHTML = `<p>Cargando productos...</p>`;
    
    // Cargar todos los datos en paralelo
    [allProductos, allCategorias, allSubcategorias] = await Promise.all([
      fetchData('productos'),
      fetchData('categorias'),
      fetchData('subcategorias')
    ]);

    // Obtener categoría de la URL y aplicarla si existe
    const urlParams = new URLSearchParams(window.location.search);
    const busquedaUrl = urlParams.get('q');
    const categoriaUrl = urlParams.get('categoria');

    if (busquedaUrl) {
      estadoFiltros.busqueda = busquedaUrl;
      productosTitle.textContent = `Resultados para: "${busquedaUrl}"`;
      productosSubtitle.textContent = `Explora los productos que coinciden con tu búsqueda`;
    }

    if (categoriaUrl && allCategorias.some(c => c.nombre.toLowerCase() === categoriaUrl.toLowerCase())) {
      estadoFiltros.categoria = categoriaUrl;
      // Solo cambia el título si no hay una búsqueda (la búsqueda tiene prioridad)
      if (!busquedaUrl) {
        productosTitle.textContent = `Categoría: ${categoriaUrl}`;
        productosSubtitle.textContent = `Explora nuestra colección de ${categoriaUrl}`;
      }
    }

    renderizarFiltros();
    renderizarProductos();
  };

  ordenarSelect.addEventListener('change', (e) => {
    estadoFiltros.orden = e.target.value;
    estadoFiltros.paginaActual = 1;
    renderizarProductos();
  });

  priceRange.addEventListener('input', (e) => {
    const maxPrice = parseFloat(e.target.value);
    priceValue.textContent = `S/ ${maxPrice.toFixed(2)}`;
    estadoFiltros.precioMax = maxPrice;
    estadoFiltros.paginaActual = 1;
    renderizarProductos();
  });

  limpiarFiltrosBtn.addEventListener('click', () => {
    // Limpiar subcategorías
    estadoFiltros.subcategorias.clear();
    filtroSubcategoriasContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Resetear precio
    estadoFiltros.precioMax = 500;
    priceRange.value = 500;
    priceValue.textContent = `S/ 500.00`;
    renderizarProductos();
  });

  const agregarAlCarrito = async (idProducto) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Debes iniciar sesión para agregar productos al carrito.');
      window.location.href = 'login.html'; // O la ruta a tu página de login
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/carrito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          idProducto: idProducto,
          cantidad: 1 // Por defecto, agregamos 1 unidad
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo agregar el producto al carrito.');
      }

      // Opcional: Mostrar una confirmación más elegante que un alert
      alert('¡Producto agregado al carrito!');

    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const agregarEventListenersTarjetas = () => {
    productosGrid.querySelectorAll('.agregar').forEach(button => {
      button.addEventListener('click', (e) => agregarAlCarrito(e.target.dataset.id));
    });
<<<<<<< HEAD
>>>>>>> progreso
=======
  };
>>>>>>> progreso

  try {
    inicializar();
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
