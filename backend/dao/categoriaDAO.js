const pool = require('../config/db');

const categoriaDAO = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM categoria');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM categoria WHERE idCategoria = ?', [id]);
    return rows[0];
  },

  create: async (categoria) => {
    const { nombre, descripcion, imagen } = categoria;
    const [result] = await pool.query(
      'INSERT INTO categoria (nombre, descripcion, imagen) VALUES (?, ?, ?)',
      [nombre, descripcion, imagen]
    );
    return result.insertId;
  },

  update: async (id, categoria) => {
    const { nombre, descripcion, imagen } = categoria;
    await pool.query(
      'UPDATE categoria SET nombre=?, descripcion=?, imagen=? WHERE idCategoria=?',
      [nombre, descripcion, imagen, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM categoria WHERE idCategoria=?', [id]);
  }
};

module.exports = categoriaDAO;
