const db = require('../config/db');

const categoriaDAO = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM categoria');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
    return rows[0];
  },

  create: async (categoria) => {
    const { nombre, descripcion, imagen } = categoria;
    const [result] = await db.query(
      'INSERT INTO categoria (nombre, descripcion, imagen) VALUES (?, ?, ?)',
      [nombre, descripcion, imagen]
    );
    return result.insertId;
  },

  update: async (id, categoria) => {
    const { nombre, descripcion, imagen } = categoria;
    await db.query(
      'UPDATE categoria SET nombre=?, descripcion=?, imagen=? WHERE idCategoria=?',
      [nombre, descripcion, imagen, id]
    );
  },

  delete: async (id) => {
    await db.query('DELETE FROM categoria WHERE idCategoria=?', [id]);
  }
};

module.exports = categoriaDAO;
