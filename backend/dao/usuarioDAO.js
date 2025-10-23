const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class UsuarioDao {
  async findByIdentifier(identifier) {
    // busca por correo o nombre
    const sql = 'SELECT * FROM Usuario WHERE correo = ? OR nombre = ? LIMIT 1';
    const [rows] = await pool.query(sql, [identifier, identifier]);
    return rows[0];
  }

  async findByCorreo(correo) {
    const [rows] = await pool.query('SELECT * FROM Usuario WHERE correo = ? LIMIT 1', [correo]);
    return rows[0];
  }

  async create(user) {
    const hashed = await bcrypt.hash(user.contraseña, 10);
    const rol = user.rol || 'cliente';
    const sql = 'INSERT INTO Usuario (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)';
    const [result] = await pool.query(sql, [user.nombre, user.correo, hashed, rol]);
    return result.insertId;
  }
}

module.exports = new UsuarioDao();


