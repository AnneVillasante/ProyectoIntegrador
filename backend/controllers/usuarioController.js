const usuarioModel = require('../models/usuarioModel');
const UsuarioDto = require('../dto/usuarioDTO');
const bcrypt = require('bcryptjs');

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
    const { nombres, apellidos, correo, contraseña, telefono, dni } = req.body;

    // 1. Validación de entradas
    if (!nombres || !correo || !contraseña) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son requeridos.' });
    }

    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = { nombres, apellidos, correo, contraseña: hashedPassword, telefono, dni };

    const resultado = await usuarioModel.create(nuevoUsuario);
    res.status(201).json({ success: true, message: 'Usuario creado correctamente', id: resultado.insertId });
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

// Obtener el perfil del usuario autenticado
exports.obtenerMiPerfil = async (req, res) => {
  try {
    // Se asume que un middleware de autenticación añade el objeto 'user' a la request
    const usuario = await usuarioModel.getById(req.user.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Esto evita la necesidad de usar 'delete'. Tu método actual también es válido.
    const usuarioDto = {
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      telefono: usuario.telefono,
      dni: usuario.dni,
      rol: usuario.rol,
      foto_perfil: usuario.foto_perfil
    };

    res.json(usuarioDto);
  } catch (err) {
    console.error('USER PROFILE GET ERROR:', err);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
  }
};

// Actualizar el perfil del usuario autenticado
exports.actualizarMiPerfil = async (req, res) => {
  try {
    const { id } = req.user;
    const data = req.body;

    // Prevenir la actualización de la contraseña o el rol desde este endpoint
    delete data.contraseña;
    delete data.password;
    delete data.rol;

    // ¡Añadido! Llamar al modelo para que guarde los datos en la BD.
    await usuarioModel.update(id, data);

    // Devolver el usuario actualizado para refrescar el frontend
    const usuarioActualizado = await usuarioModel.getById(id);
    // Usamos el DTO para asegurarnos de no enviar datos sensibles como la contraseña.
    const usuarioDto = new UsuarioDto(usuarioActualizado);

    res.json({ success: true, message: 'Perfil actualizado correctamente', user: usuarioDto });
  } catch (err) {
    console.error('USER PROFILE UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// Actualizar la contraseña del usuario autenticado
exports.actualizarMiPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { contraseña } = req.body;

    if (!contraseña) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida.' });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    await usuarioModel.update(id, { contraseña: hashedPassword });
    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (err) {
    console.error('USER PASSWORD UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar la contraseña' });
  }
};

// Subir/actualizar la foto de perfil del usuario autenticado
exports.subirFotoPerfil = async (req, res) => {
  try {
    const { id } = req.user; // ID del usuario autenticado

    if (!req.file) {
      return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    // La URL segura de la imagen subida a Cloudinary
    const imageUrl = req.file.path;

    // Actualizar la base de datos con la nueva ruta de la foto
    await usuarioModel.update(id, { foto_perfil: imageUrl });

    res.json({ success: true, message: 'Foto de perfil actualizada correctamente', filePath: imageUrl });
  } catch (err) {
    console.error('USER PHOTO UPLOAD ERROR:', err);
    res.status(500).json({ error: 'Error al subir la foto de perfil' });
  }
};
