// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
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

  // --- ESTADO DE LA APLICACIÓN ---
  let allProductos = [];
  let allCategorias = [];
  let allSubcategorias = [];
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
      const response = await fetch(`${window.CONFIG.API_URL}/${endpoint}`);
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
    let imagenUrl = prod.imagen ? `${window.CONFIG.IMG_URL}/${prod.imagen.replace(/\\/g, '/')}` : '../assets/img/placeholder.png';
    
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
      const response = await fetch(`${window.CONFIG.API_URL}/carrito`, {
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

  try {
    inicializar();
  } catch (error) {
    console.error('Error cargando productos:', error);
    productosGrid.innerHTML = `<p class="error">Error al cargar los productos. Por favor, intenta más tarde.</p>`;
  }

  function agregarEventListenersTarjetas() {
    const botonesAgregar = document.querySelectorAll('.agregar');
    botonesAgregar.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idProducto = e.target.getAttribute('data-id');
        // Lógica para agregar al carrito
        if (typeof agregarAlCarrito === 'function') {
            agregarAlCarrito(idProducto);
        } else {
            console.log('Producto agregado:', idProducto);
        }
      });
    });

    const botonesVer = document.querySelectorAll('.ver');
    botonesVer.forEach(btn => {
      btn.addEventListener('click', (e) => {
         const idProducto = e.target.getAttribute('data-id');
         window.location.href = `producto.html?id=${idProducto}`;
      });
    });
  }

});
