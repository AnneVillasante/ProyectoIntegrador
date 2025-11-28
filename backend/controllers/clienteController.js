// backend/controllers/clienteController.js
const clienteService = require('../services/clienteService');

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

module.exports = { createClientByAdmin };