const { isProduction } = require('../config/cloudinary');
const usuarioModel = require('../models/usuarioModel');
const UsuarioDto = require('../dto/usuarioDTO');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Importar la conexión a la BD

exports.obtenerUsuarios = async (req, res) => {
  try {
    const { rol } = req.query;
    let usuarios;

    if (rol === 'Cliente') {
      // Si se pide solo clientes, hacemos un JOIN para obtener también el idCliente
      const [rows] = await db.query(`
        SELECT u.*, c.idCliente 
        FROM usuario u 
        LEFT JOIN cliente c ON u.idUsuario = c.fk_idUsuario 
        WHERE u.rol = 'Cliente'
      `);
      usuarios = rows;
    } else {
      usuarios = await usuarioModel.getAll(rol); // Asumiendo que getAll puede filtrar por rol
    }
    res.json(usuarios);
  } catch (err) {
    console.error('USUARIO LIST ERROR:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

exports.crearUsuario = async (req, res) => {
  try {
    const { nombres, apellidos, correo, contrasena, telefono, dni, rol } = req.body;

    // 1. Validación de entradas
    if (!nombres || !correo || !contrasena) {
      return res.status(400).json({ error: 'Nombre, correo y contrasena son requeridos.' });
    }

    // 2. Hashear la contrasena
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = { 
      nombres, 
      apellidos, 
      correo, 
      contrasena: hashedPassword, 
      telefono, 
      dni,
      rol: rol || 'Cliente' // Asigna rol o 'Cliente' por defecto
    };

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

    // Si se sube una nueva foto de perfil, se añade su ruta al objeto de datos
    if (req.file) {
      if (isProduction()) {
        data.foto_perfil = req.file.path;
      } else {
        data.foto_perfil = `/uploads/perfiles/${req.file.filename}`;
      }
    }
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
    // Se asume que un middleware de autenticación anade el objeto 'user' a la request
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

    // Prevenir la actualización de la contrasena o el rol desde este endpoint
    delete data.contrasena;
    delete data.password;
    delete data.rol;

    // ¡Anadido! Llamar al modelo para que guarde los datos en la BD.
    await usuarioModel.update(id, data);

    // Devolver el usuario actualizado para refrescar el frontend
    const usuarioActualizado = await usuarioModel.getById(id);
    // Usamos el DTO para asegurarnos de no enviar datos sensibles como la contrasena.
    const usuarioDto = new UsuarioDto(usuarioActualizado);

    res.json({ success: true, message: 'Perfil actualizado correctamente', user: usuarioDto });
  } catch (err) {
    console.error('USER PROFILE UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
};

// Actualizar la contrasena del usuario autenticado
exports.actualizarMiPassword = async (req, res) => {
  try {
    const { id } = req.user;
    const { contrasena } = req.body;

    if (!contrasena) {
      return res.status(400).json({ error: 'La nueva contrasena es requerida.' });
    }

    // Hashear la nueva contrasena
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    await usuarioModel.update(id, { contrasena: hashedPassword });
    res.json({ success: true, message: 'Contrasena actualizada correctamente.' });
  } catch (err) {
    console.error('USER PASSWORD UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar la contrasena' });
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
    let imageUrl;
    if (isProduction()) {
        imageUrl = req.file.path;
    } else {
        imageUrl = `/uploads/perfiles/${req.file.filename}`;
    }

    // Actualizar la base de datos con la nueva ruta de la foto
    await usuarioModel.update(id, { foto_perfil: imageUrl });

    res.json({ success: true, message: 'Foto de perfil actualizada correctamente', filePath: imageUrl });
  } catch (err) {
    console.error('USER PHOTO UPLOAD ERROR:', err);
    res.status(500).json({ error: 'Error al subir la foto de perfil' });
  }
};

/**
 * Busca usuarios por nombre, apellido o correo.
 * Endpoint: GET /api/usuario/buscar?q=texto
 */
exports.buscarUsuarios = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'El término de búsqueda debe tener al menos 2 caracteres.' });
    }

    // Llama al modelo para realizar la búsqueda.
    const usuarios = await usuarioModel.search(q);

    // Mapea a DTO para no exponer datos sensibles.
    const usuariosDto = usuarios.map(u => new UsuarioDto(u));
    res.json(usuariosDto);
  } catch (err) {
    console.error('USUARIO SEARCH ERROR:', err);
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};
