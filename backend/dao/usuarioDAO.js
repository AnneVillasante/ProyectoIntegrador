const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UsuarioDao {
  async findByIdentifier(identifier) {
    // busca por correo o nombres
    const sql = 'SELECT * FROM usuario WHERE correo = ? OR nombres = ? LIMIT 1';
    const [rows] = await pool.query(sql, [identifier, identifier]);
    return rows[0];
  }

  async findByCorreo(correo) {
    const [rows] = await pool.query('SELECT * FROM usuario WHERE correo = ? LIMIT 1', [correo]);
    return rows[0];
  }

  async create(user) {
    const hashed = await bcrypt.hash(user.contraseña, 10);
    const rol = user.rol || 'Cliente';
    const sql = 'INSERT INTO usuario (nombres, apellidos, correo, telefono, dni, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await pool.query(sql, [
      user.nombres, 
      user.apellidos, 
      user.correo, 
      user.telefono, 
      user.dni, 
      hashed, 
      rol
    ]);
    return result.insertId;
  }
}

module.exports = new UsuarioDao();


