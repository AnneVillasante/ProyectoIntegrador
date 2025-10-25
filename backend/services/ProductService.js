const ProductoDao = require('../dao/productoDao');

class ProductService {
  async getProductsForStaticRender() {
    try {
      const products = await ProductoDao.getAllProducts();
      return products.map(p => ({
        id: p.idProducto,
        nombre: p.nombre,
        categoria: p.categoria,
        precio: p.precio,
        stock: p.stock
      }));
    } catch (error) {
      console.error('Error en ProductService:', error);
      throw error;
    }
  }

  generateProductCards(products) {
    return products.map(p => `
      <div class="producto-card">
        <img src="../assets/img/placeholder.png" alt="${p.nombre}">
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
