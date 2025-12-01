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

const getMyProfile = async (req, res) => {
  try {
    // req.user es añadido por el middleware 'protect' y contiene el id del usuario del token
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

module.exports = { createClientByAdmin, getMyProfile };