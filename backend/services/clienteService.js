// backend/services/clienteService.js
const pool = require('../config/db');

/**
 * Crea un nuevo cliente en la base de datos.
 * Puede ser parte de una transacción si se le pasa una conexión.
 * @param {object} clientData - Datos del cliente (nombres, apellidos, etc.).
 * @param {object} [connection=pool] - Una conexión de BD existente (para transacciones).
 * @returns {Promise<object>} El resultado de la inserción.
 */
const createClient = async (clientData, connection = pool) => {
  const { nombres, apellidos, dni, correo, telefono, direccion_predeterminada, fk_idUsuario } = clientData;
  const sql = `
    INSERT INTO clientes (nombres, apellidos, dni, correo, telefono, direccion_predeterminada, fecha_registro, fk_idUsuario)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)
  `;
  const [result] = await connection.query(sql, [nombres, apellidos, dni, correo, telefono, direccion_predeterminada, fk_idUsuario]);
  return result;
};


module.exports = {
  createClient,
};
