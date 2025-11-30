// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
  const API_BASE = 'http://localhost:4000/api';

  // --- ELEMENTOS DEL DOM ---
  const productosGrid = document.getElementById('productosGrid');
  const productosTitle = document.querySelector('.productos-title');
  const productosSubtitle = document.querySelector('.productos-subtitle');
  const filtroCategoriasContainer = document.getElementById('filtroCategorias');
  const filtroSubcategoriasContainer = document.getElementById('filtroSubcategorias');
  const ordenarSelect = document.getElementById('ordenarProductos');
  const minPriceInput = document.getElementById('minPrice');
  const maxPriceInput = document.getElementById('maxPrice');
  const applyPriceFilterBtn = document.getElementById('applyPriceFilter');
  const paginacionContainer = document.getElementById('paginacion');

  // --- ESTADO DE LA APLICACIÓN ---
  let allProductos = [];
  let allCategorias = [];
  let allSubcategorias = [];

  let estadoFiltros = {
    categoria: null,
    subcategoria: null,
    precioMin: null,
    precioMax: null,
    orden: 'recomendado',
    paginaActual: 1,
    productosPorPagina: 20,
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

    // 1. Filtrar por categoría
    if (estadoFiltros.categoria) {
      productosFiltrados = productosFiltrados.filter(p => p.categoria === estadoFiltros.categoria);
    }

    // 2. Filtrar por subcategoría
    if (estadoFiltros.subcategoria) {
      productosFiltrados = productosFiltrados.filter(p => p.subcategoria === estadoFiltros.subcategoria);
    }

    // 3. Filtrar por precio
    if (estadoFiltros.precioMin !== null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio >= estadoFiltros.precioMin);
    }
    if (estadoFiltros.precioMax !== null) {
      productosFiltrados = productosFiltrados.filter(p => p.precio <= estadoFiltros.precioMax);
    }

    // 4. Ordenar
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

    // 5. Paginación
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
    const categoriasHtml = allCategorias.map(cat => `<li><button data-categoria="${cat.nombre}">${cat.nombre}</button></li>`).join('');
    filtroCategoriasContainer.innerHTML = `<h4>Categoría</h4><ul><li><button data-categoria="all" class="active">Todas</button></li>${categoriasHtml}</ul>`;

    // Subcategorías
    const subcategoriasHtml = allSubcategorias.map(sub => `<li><label><input type="checkbox" data-subcategoria="${sub.nombre}"> ${sub.nombre}</label></li>`).join('');
    filtroSubcategoriasContainer.innerHTML = `<h4>Subcategoría</h4><ul>${subcategoriasHtml}</ul>`;

    // Event Listeners para filtros
    filtroCategoriasContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        filtroCategoriasContainer.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');
        const categoria = e.target.dataset.categoria;
        estadoFiltros.categoria = categoria === 'all' ? null : categoria;
        estadoFiltros.paginaActual = 1;
        renderizarProductos();
      });
    });

    filtroSubcategoriasContainer.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        // Lógica para múltiples subcategorías (simplificado a una por ahora)
        estadoFiltros.subcategoria = e.target.checked ? e.target.dataset.subcategoria : null;
        estadoFiltros.paginaActual = 1;
        renderizarProductos();
      });
    });
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
    const categoriaUrl = urlParams.get('categoria');
    if (categoriaUrl && allCategorias.some(c => c.nombre.toLowerCase() === categoriaUrl.toLowerCase())) {
      estadoFiltros.categoria = categoriaUrl;
      productosTitle.textContent = `Categoría: ${categoriaUrl}`;
      productosSubtitle.textContent = `Explora nuestra colección de ${categoriaUrl}`;
    }

    renderizarFiltros();
    renderizarProductos();
  };

  ordenarSelect.addEventListener('change', (e) => {
    estadoFiltros.orden = e.target.value;
    estadoFiltros.paginaActual = 1;
    renderizarProductos();
  });

  applyPriceFilterBtn.addEventListener('click', () => {
    estadoFiltros.precioMin = minPriceInput.value ? parseFloat(minPriceInput.value) : null;
    estadoFiltros.precioMax = maxPriceInput.value ? parseFloat(maxPriceInput.value) : null;
    estadoFiltros.paginaActual = 1;
    renderizarProductos();
  });

  const agregarEventListenersTarjetas = () => {
    productosGrid.querySelectorAll('.agregar').forEach(button => {
      button.addEventListener('click', async (e) => {
        // ... (la lógica para agregar al carrito se mantiene igual)
      });
    });
  };

  try {
    inicializar();
  } catch (error) {
    console.error('Error cargando productos:', error);
    productosGrid.innerHTML = `<p class="error">Error al cargar los productos. Por favor, intenta más tarde.</p>`;
  }
});
