// frontend/assets/js/productos.js

document.addEventListener('DOMContentLoaded', async () => {
  // Mostrar año en el footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contenedor principal
  const grid = document.getElementById('productosGrid');
  if (!grid) {
    console.error('No se encontró el contenedor de productos.');
    return;
  }

  try {
    // Obtener productos desde el backend
    const response = await fetch('http://localhost:4000/api/products');
    if (!response.ok) throw new Error('Error al obtener productos');
    const productos = await response.json();

    if (!Array.isArray(productos) || productos.length === 0) {
      grid.innerHTML = `<p class="sin-productos">No hay productos disponibles.</p>`;
      return;
    }

    // Crear tarjetas dinámicamente
    grid.innerHTML = productos.map(prod => `
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
    grid.querySelectorAll('.ver').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Detalles del producto próximamente disponibles.');
      });
    });

    grid.querySelectorAll('.agregar').forEach(btn => {
      btn.addEventListener('click', () => {
        alert('Producto añadido al carrito.');
      });
    });

  } catch (error) {
    console.error(error);
    grid.innerHTML = `<p class="error">Error al cargar los productos.</p>`;
  }
});

