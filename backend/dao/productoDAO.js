const pool = require('../config/db');

const productoDAO = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT p.*, s.nombre AS subcategoria, c.nombre AS categoria
      FROM producto p
      LEFT JOIN subcategoria s ON p.idSubcategoria = s.idSubcategoria
      LEFT JOIN categoria c ON s.idCategoria = c.idCategoria -- ¡Aquí está el cambio! Unimos categoria usando la subcategoría, no el producto directly
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre AS categoria, s.nombre AS subcategoria
      FROM producto p
      LEFT JOIN subcategoria s ON p.idSubcategoria = s.idSubcategoria
      LEFT JOIN categoria c ON s.idCategoria = c.idCategoria -- Igual aquí, la categoría viene de la subcategoría
      WHERE p.idProducto = ?`, [id]
    );
    return rows[0];
  },

  create: async (producto) => {
    const { nombre, descripcion, imagen, precio, stock, idCategoria, idSubcategoria } = producto;
    const [result] = await pool.query(`
      INSERT INTO producto (nombre, descripcion, imagen, precio, stock, idSubcategoria)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, imagen, precio, stock, idSubcategoria || null]
    );
    return result.insertId;
  },

  update: async (id, producto) => {
    const { nombre, descripcion, imagen, precio, stock,  idSubcategoria } = producto;
    await pool.query(`
      UPDATE producto
      SET nombre=?, descripcion=?, imagen=?, precio=?, stock=?, idSubcategoria=?
      WHERE idProducto=?`,
      [nombre, descripcion, imagen, precio, stock, idSubcategoria || null, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM producto WHERE idProducto=?', [id]);
  }
};

module.exports = productoDAO;
