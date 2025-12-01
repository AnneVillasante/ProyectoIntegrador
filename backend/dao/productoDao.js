const db = require('../config/db');

const productoDAO = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS categoria, s.nombre AS subcategoria
      FROM producto p
      LEFT JOIN categoria c ON p.idCategoria = c.idCategoria
      LEFT JOIN subcategoria s ON p.idSubcategoria = s.idSubcategoria
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT p.*, c.nombre AS categoria, s.nombre AS subcategoria
      FROM producto p
      LEFT JOIN categoria c ON p.idCategoria = c.idCategoria
      LEFT JOIN subcategoria s ON p.idSubcategoria = s.idSubcategoria
      WHERE p.idProducto = ?`, [id]
    );
    return rows[0];
  },

  create: async (producto) => {
    const { nombre, descripcion, imagen, precio, stock, idCategoria, idSubcategoria } = producto;
    const [result] = await db.query(`
      INSERT INTO producto (nombre, descripcion, imagen, precio, stock, idCategoria, idSubcategoria)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, imagen, precio, stock, idCategoria || null, idSubcategoria || null]
    );
    return result.insertId;
  },

  update: async (id, producto) => {
    const { nombre, descripcion, imagen, precio, stock, idCategoria, idSubcategoria } = producto;
    await db.query(`
      UPDATE producto
      SET nombre=?, descripcion=?, imagen=?, precio=?, stock=?, idCategoria=?, idSubcategoria=?
      WHERE idProducto=?`,
      [nombre, descripcion, imagen, precio, stock, idCategoria || null, idSubcategoria || null, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM producto WHERE idProducto=?', [id]);
  }
};

module.exports = productoDAO;
