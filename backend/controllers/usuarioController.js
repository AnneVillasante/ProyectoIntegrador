const usuarioModel = require('../models/usuarioModel');

exports.obtenerUsuarios = async (req, res) => {
  const usuarios = await usuarioModel.getAll();
  res.json(usuarios);
};

exports.crearUsuario = async (req, res) => {
  const data = req.body;
  const resultado = await usuarioModel.create(data);
  res.json({ success: true, data: resultado });
};
