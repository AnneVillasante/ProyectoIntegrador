// Mostrar año en footer
document.getElementById('year').textContent = new Date().getFullYear();

// Manejo de botones - Solo para interactividad, no para cargar datos
document.addEventListener('DOMContentLoaded', () => {
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
});
