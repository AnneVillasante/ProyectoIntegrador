// backend/controllers/clienteController.js
const clienteService = require('../services/clienteService');

/**
 * Crea un cliente sin un usuario asociado.
 * Ideal para registros rápidos en punto de venta.
 * Los datos del cliente (nombre, correo, etc.) se guardan directamente.
 */
const createQuickClient = async (req, res) => {
  try {
    // Se espera que el cuerpo de la petición contenga los datos del cliente
    const clienteData = req.body;
    const result = await clienteService.createClient(clienteData);
    const nuevoCliente = await clienteService.getClientById(result.insertId);

    res.status(201).json({
      message: 'Cliente rápido creado exitosamente.',
      cliente: nuevoCliente, // Devolvemos el cliente completo
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente rápido. ' + error.message });
  }
};
// Solo para administradores
const createClientByAdmin = async (req, res) => {
  try {
    // El admin puede crear un cliente sin asociarlo a un usuario si no se provee fk_idUsuario
    const result = await clienteService.createClient(req.body);
    res.status(201).json({
      message: 'Cliente creado exitosamente por el administrador.',
      clienteId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente. ' + error.message });
  }
};

const getMyProfile = async (req, res) => {
  try {
    // req.user es anadido por el middleware 'protect' y contiene el id del usuario del token
    if (!req.user || !req.user.idUsuario) {
      return res.status(401).json({ message: 'No autorizado, token inválido.' });
    }

    const cliente = await clienteService.getClientByUserId(req.user.idUsuario);
    if (!cliente) {
      return res.status(404).json({ message: 'Perfil de cliente no encontrado.' });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el perfil del cliente. ' + error.message });
  }
};

module.exports = { createQuickClient, createClientByAdmin, getMyProfile };