const pool = require('../config/db');
const Producto = require('../models/productoModel');

class ProductoDao {
  async getAllProducts() {
    const [rows] = await pool.query(
      'SELECT idProducto, nombre, imagen, categoria, precio, stock FROM producto'
    );
    // Convertir cada fila de la BD en una instancia de Producto
    return rows.map(r => new Producto(
      r.idProducto,
      r.nombre,
      r.imagen,
      r.categoria,
      r.precio,
      r.stock
    ));
  }

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT idProducto, nombre, imagen, categoria, precio, stock FROM producto WHERE idProducto = ?',
      [id]
    );
    if (rows.length === 0) return null;
    const r = rows[0];
    return new Producto(r.idProducto, r.nombre, r.imagen, r.categoria, r.precio, r.stock);
  }

  // ... otros métodos (create, update, delete)
}

module.exports = new ProductoDao();
