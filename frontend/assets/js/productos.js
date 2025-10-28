// frontend/assets/js/productos.js - Lógica para la página de productos

document.addEventListener('DOMContentLoaded', async () => {
  // Mostrar año en el footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contenedor principal
  const productosGrid = document.getElementById('productosGrid');
  const productosTitle = document.querySelector('.productos-title');

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
  }

  if (!productosGrid) {
    console.error('No se encontró el contenedor de productos.');
    return;
  }

  try {
    // Obtener productos desde el backend
    const apiUrl = categoria ? `http://localhost:4000/api/products?categoria=${categoria}` : 'http://localhost:4000/api/products';
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Error al obtener productos');
    let productos = await response.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      productosGrid.innerHTML = `<p class="sin-productos">No hay productos disponibles en esta categoría.</p>`;
      return;
    }

    // Crear tarjetas dinámicamente
    productosGrid.innerHTML = productos.map(prod => `
      <div class="producto-card">
        <img src="${prod.imagen_url || '../assets/img/placeholder.jpg'}" alt="${prod.nombre}" class="producto-img">
        <h3>${prod.nombre}</h3>
        <p class="descripcion">${prod.descripcion || 'Sin descripción'}</p>
        <p class="precio">S/ ${prod.precio?.toFixed(2) || '0.00'}</p>
        <div class="acciones">
          <button class="btn-outline ver">Ver</button>
          <button class="btn-outline btn-primary agregar">Agregar</button>
        </div>
      </div>
    `).join('');

    // Eventos de botones
    productosGrid.querySelectorAll('.ver').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Detalles del producto próximamente disponibles.');
      });
    });

    productosGrid.querySelectorAll('.agregar').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Producto añadido al carrito.');
      });
    });

  } catch (error) {
    console.error(error);
    productosGrid.innerHTML = `<p class="error">Error al cargar los productos.</p>`;
  }
});
