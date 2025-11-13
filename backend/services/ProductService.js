const ProductoDao = require('../dao/productoDAO');
const Producto = require('../models/productoModel');


class ProductService {
  // 🧩 1. Obtener productos desde MySQL
  async getProductsForStaticRender(category = null) {
    try {
      let products = await ProductoDao.getAll();
      // Si se proporciona una categoría, filtrar los productos
      if (category) {
        products = products.filter(p => p.categoria && p.categoria.toLowerCase() === category.toLowerCase());
      }

      return products.map(p => ({
        id: p.idProducto,
        nombre: p.nombre,
        categoria: p.categoria || 'Sin categoría',
        precio: p.precio,
        stock: p.stock,
        imagen: p.imagen || 'placeholder.png' // evita errores si no hay imagen
      }));
    } catch (error) {
      console.error('Error en ProductService:', error);
      throw error;
    }
  }

  // 🧩 2. Generar HTML de cards para insertar en el archivo productos.html
  generateProductCards(products) {
    if (!products || products.length === 0) {
      return '<p class="no-products">No hay productos disponibles.</p>';
    }

    return products.map(p => `
      <div class="producto-card">
        <img src="../assets/img/${p.imagen}" alt="${p.nombre}">
        <h3>${p.nombre}</h3>
        <p class="categoria">${p.categoria || ''}</p>
        <p class="precio">S/ ${Number(p.precio).toFixed(2)}</p>
        <p class="stock">Disponibles: ${p.stock}</p>
        <div class="acciones">
          <button class="btn-outline ver" data-id="${p.id}">Ver más</button>
          <button class="btn-primary agregar" data-id="${p.id}">Añadir al carrito</button>
        </div>
      </div>
    `).join('');
  }
}

module.exports = new ProductService();
