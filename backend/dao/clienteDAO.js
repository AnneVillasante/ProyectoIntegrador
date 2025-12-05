// backend/dao/clienteDAO.js
const db = require('../config/db');

const clienteDAO = {
  // 1. Buscar por correo
  findByCorreo: async (correo) => {
    const [rows] = await db.query('SELECT * FROM cliente WHERE correo = ?', [correo]);
    return rows[0]; // Devuelve el primer resultado o undefined
  },

  // 2. Buscar por ID de Usuario
  findByUserId: async (userId) => {
    const [rows] = await db.query('SELECT * FROM cliente WHERE fk_idUsuario = ?', [userId]);
    return rows[0]; // Devuelve el primer resultado o undefined
  },

  // 3. Crear nuevo cliente
  create: async (clienteData, connection = db) => {
    // Hacemos la desestructuración más robusta, asignando null si los valores no vienen.
    const { 
      nombres, 
      apellidos, 
      correo, 
      dni = null, 
      telefono = null, 
      direccion_predeterminada = null, 
      fk_idUsuario = null 
    } = clienteData;

    const sql = `
      INSERT INTO cliente (nombres, apellidos, dni, correo, telefono, direccion_predeterminada, fecha_registro, fk_idUsuario)
      VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
    `;
    const [result] = await connection.query(sql, [nombres, apellidos, dni, correo, telefono, direccion_predeterminada, fk_idUsuario]);
    return result;
  }
};

module.exports = clienteDAO;