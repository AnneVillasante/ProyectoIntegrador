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
    // Construcción dinámica de la consulta para actualizar solo los campos que llegan
    const fields = Object.keys(data);
    const values = Object.values(data);

    if (fields.length === 0) {
      return; // No hay nada que actualizar
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE usuario SET ${setClause} WHERE idUsuario = ?`;

    values.push(id); // Añadir el id al final para el WHERE
    await pool.query(sql, values);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM usuario WHERE idUsuario = ?', [id]);
  }
};
