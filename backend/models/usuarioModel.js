const pool = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM usuario');
    return rows;
  },

  create: async (data) => {
    const { nombres, apellidos, correo, telefono, dni, contraseña, rol } = data;
    const [result] = await pool.query(
      'INSERT INTO usuario (nombres, apellidos, correo, telefono, dni, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nombres, apellidos, correo, telefono, dni, contraseña, rol || 'Cliente']
    );
    return result;
  },

  getByEmail: async (correo) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ?', [correo]);
    return rows[0];
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE idUsuario = ?', [id]);
    return rows[0];
  },

  update: async (id, data) => {
    const { nombres, apellidos, correo, telefono, dni, fotoPerfil } = data;
    await pool.query(
      'UPDATE usuario SET nombres = ?, apellidos = ?, correo = ?, telefono = ?, dni = ?, fotoPerfil = ? WHERE idUsuario = ?',
      [nombres, apellidos, correo, telefono, dni, fotoPerfil, id]
    );
  },

  delete: async (id) => {
    await pool.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
  }
};
