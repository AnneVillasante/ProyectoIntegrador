const db = require('../config/db'); // Cambiado de 'pool' a 'db' para consistencia
const bcrypt = require('bcryptjs');

class UsuarioDao {
  async findAll() {
    const sql = 'SELECT idUsuario, nombres, apellidos, correo, telefono, dni, rol FROM usuario ORDER BY nombres';
    // Usamos db.promise().query() para usar async/await correctamente
    const [rows] = await db.query(sql);
    return rows; // Corregido: Debería devolver todos los usuarios, no solo el primero.
  }

  async findByCorreo(correo) { // Renombrado de findByEmail a findByCorreo para consistencia
    const sql = 'SELECT * FROM usuario WHERE correo = ? LIMIT 1';
    const [rows] = await db.query(sql, [correo]);
    return rows[0]; // Corregido: Debería devolver un solo objeto de usuario, no un array.
  }

  async create(user) {
    const hashed = await bcrypt.hash(user.contraseña, 10);
    const rol = user.rol || 'Cliente';
    const sql = 'INSERT INTO usuario (nombres, apellidos, correo, telefono, dni, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [
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

  // Método para actualizar el rol, usado en el panel de admin
  async updateRole(id, rol) {
    const sql = 'UPDATE usuario SET rol = ? WHERE idUsuario = ?';
    await db.query(sql, [rol, id]);
  }

  // Método para eliminar un usuario
  async delete(id) {
    const sql = 'DELETE FROM usuario WHERE idUsuario = ?';
    await db.query(sql, [id]);
  }
}

module.exports = new UsuarioDao();
