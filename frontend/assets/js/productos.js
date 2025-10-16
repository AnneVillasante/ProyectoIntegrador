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
