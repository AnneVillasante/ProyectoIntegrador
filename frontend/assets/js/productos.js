// Mostrar año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Manejo de botones
const botonesVer = document.querySelectorAll('.ver');
const botonesAgregar = document.querySelectorAll('.agregar');

botonesVer.forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Detalles del producto próximamente disponibles.');
  });
});

botonesAgregar.forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Producto añadido al carrito.');
  });
});

async function fetchProducts() {
  const res = await fetch('http://localhost:3000/api/products');
  if (!res.ok) throw new Error('Error fetching products');
  return res.json();
}

function renderProducts(products) {
  const grid = document.querySelector('.productos-grid');
  if (!grid) return;
  grid.innerHTML = products.map(p => `
    <div class="producto-card">
      <img src="../assets/img/placeholder.png" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p class="categoria">${p.categoria || ''}</p>
      <p class="precio">S/ ${p.precio.toFixed(2)}</p>
      <p class="stock">Disponibles: ${p.stock}</p>
      <div class="acciones">
        <button class="btn-outline ver" data-id="${p.idProducto}">Ver más</button>
        <button class="btn-primary agregar" data-id="${p.idProducto}">Añadir al carrito</button>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const products = await fetchProducts();
    renderProducts(products);
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
});
