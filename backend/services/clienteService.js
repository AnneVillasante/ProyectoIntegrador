// backend/services/clienteService.js
const clienteDAO = require('../dao/clienteDAO'); // Importamos el DAO

/**
 * Crea un nuevo cliente en la base de datos.
 * Puede ser parte de una transacción si se le pasa una conexión.
 * @param {object} clientData - Datos del cliente (nombres, apellidos, etc.).
 * @returns {Promise<object>} El resultado de la inserción.
 */
const createClient = async (clientData) => {
  // Aquí podrías agregar lógica extra antes de guardar (validaciones, etc.)
  return await clienteDAO.create(clientData);
};

const getClientByUserId = async (userId) => {
  return await clienteDAO.findByUserId(userId);
};

const findByCorreo = async (correo) => {
  return await clienteDAO.findByCorreo(correo);
};

module.exports = {
  createClient,
  getClientByUserId,
  findByCorreo,
};
