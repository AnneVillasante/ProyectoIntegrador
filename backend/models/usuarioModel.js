const pool = require('../config/db');

module.exports = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM Usuario');
    return rows;
  },

  create: async (data) => {
    const { nombres, apellidos, correo, telefono, dni } = data;
    const [result] = await pool.query(
      'INSERT INTO Usuario (nombres, apellidos, correo, telefono, dni) VALUES (?, ?, ?, ?, ?)',
      [nombres, apellidos, correo, telefono, dni]
    );
    return result;
  }
};
