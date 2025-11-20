// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
  // Mostrar año en el footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contenedor principal
  const productosGrid = document.getElementById('productosGrid');
  const productosTitle = document.querySelector('.productos-title');
  const productosSubtitle = document.querySelector('.productos-subtitle');

  // Si el placeholder no existe, significa que el servidor ya renderizó el contenido.
  if (!productosGrid || !productosGrid.innerHTML.includes('PRODUCTS_PLACEHOLDER')) {
    console.log('Productos renderizados por el servidor. El script del cliente no se ejecutará.');
    return;
  }

  // Obtener categoría de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoria = urlParams.get('categoria');

  if (productosTitle && categoria) {
    productosTitle.textContent = `Categoría: ${categoria}`;
    if (productosSubtitle) {
      productosSubtitle.textContent = `Explora nuestra colección de ${categoria}`;
    }
  }

  if (!productosGrid) {
    console.error('No se encontró el contenedor de productos.');
    return;
  }

  try {
    // Obtener productos desde el backend usando la ruta correcta
    const API_BASE = 'http://localhost:4000/api';
    const apiUrl = `${API_BASE}/productos`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    let productos = await response.json();

    // Filtrar por categoría si se especifica en la URL
    if (categoria && Array.isArray(productos)) {
      productos = productos.filter(prod => 
        prod.categoria && prod.categoria.toLowerCase() === categoria.toLowerCase()
      );
    }

    if (!Array.isArray(productos) || productos.length === 0) {
      productosGrid.innerHTML = `<p class="sin-productos">No hay productos disponibles${categoria ? ` en la categoría ${categoria}` : ''}.</p>`;
      return;
    }

    // Crear tarjetas dinámicamente
    productosGrid.innerHTML = productos.map(prod => {
      // Manejar la URL de la imagen
      let imagenUrl = '../assets/img/placeholder.png';
      if (prod.imagen) {
        if (prod.imagen.startsWith('http')) {
          imagenUrl = prod.imagen;
        } else if (prod.imagen.includes('/')) { // Asume que la ruta es como 'uploads/productos/...'
          imagenUrl = `http://localhost:4000/${prod.imagen}`;
        } else {
          imagenUrl = `http://localhost:4000/uploads/productos/${prod.imagen}`;
        }
      }

      return `
      <div class="producto-card">
        <img src="${imagenUrl}" alt="${prod.nombre}" class="producto-img" onerror="this.src='../assets/img/placeholder.png'">
        <div class="producto-info">
          <h3>${prod.nombre || 'Sin nombre'}</h3>
          ${prod.descripcion ? `<p class="descripcion">${prod.descripcion}</p>` : ''}
          ${prod.categoria ? `<p class="categoria-badge">${prod.categoria}</p>` : ''}
          <p class="precio">S/ ${parseFloat(prod.precio || 0).toFixed(2)}</p>
          ${prod.stock !== undefined ? `<p class="stock">Stock: ${prod.stock}</p>` : ''}
          <div class="acciones">
            <button class="btn-outline ver" data-id="${prod.idProducto}">Ver</button>
            <button class="btn-primary agregar" data-id="${prod.idProducto}">Agregar</button>
          </div>
        </div>
      </div>
    `;
    }).join('');

    // Eventos de botones
    productosGrid.querySelectorAll('.ver').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const productId = e.target.getAttribute('data-id');
        alert(`Detalles del producto ${productId} próximamente disponibles.`);
      });
    });

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
          const response = await fetch(`${API_BASE}/carrito`, {
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

  } catch (error) {
    console.error('Error cargando productos:', error);
    productosGrid.innerHTML = `<p class="error">Error al cargar los productos. Por favor, intenta más tarde.</p>`;
  }
});
