const db = require('../config/db');

const subcategoriaDAO = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT s.*, c.nombre AS categoria
      FROM subcategoria s
      LEFT JOIN categoria c ON s.idCategoria = c.idCategoria
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM subcategoria WHERE idSubcategoria = ?', [id]);
    return rows[0];
  },

  create: async (subcategoria) => {
    const { nombre, descripcion, imagen, idCategoria, genero } = subcategoria;
    const [result] = await db.query(
      'INSERT INTO subcategoria (nombre, descripcion, imagen, idCategoria, genero) VALUES (?, ?, ?, ?, ?)',
      [nombre, descripcion, imagen, idCategoria || null, genero]
    );
    return result.insertId;
  },

  update: async (id, subcategoria) => {
    const { nombre, descripcion, imagen, idCategoria, genero } = subcategoria;
    await db.query(
      'UPDATE subcategoria SET nombre=?, descripcion=?, imagen=?, idCategoria=?, genero=? WHERE idSubcategoria=?',
      [nombre, descripcion, imagen, idCategoria || null, genero, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM subcategoria WHERE idSubcategoria=?', [id]);
  }
};

module.exports = subcategoriaDAO;
