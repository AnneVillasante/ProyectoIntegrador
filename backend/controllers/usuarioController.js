const usuarioModel = require('../models/usuarioModel');

exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.getAll();
    res.json(usuarios);
  } catch (err) {
    console.error('USUARIO LIST ERROR:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const data = req.body;
    const resultado = await usuarioModel.create(data);
    res.json({ success: true, data: resultado });
  } catch (err) {
    console.error('USUARIO CREATE ERROR:', err);
    res.status(500).json({ error: 'Error al crear usuario' });
  }
};

exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await usuarioModel.getById(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    console.error('USUARIO GET ERROR:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    await usuarioModel.update(id, data);
    res.json({ success: true, message: 'Usuario actualizado' });
  } catch (err) {
    console.error('USUARIO UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    await usuarioModel.delete(id);
    res.json({ success: true, message: 'Usuario eliminado' });
  } catch (err) {
    console.error('USUARIO DELETE ERROR:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};