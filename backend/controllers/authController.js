const UsuarioDao = require('../dao/usuarioDAO');
const ClienteService = require('../services/clienteService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioDto = require('../dto/usuarioDTO');
const { JWT_SECRET } = require('../config/config');

const JWT_EXPIRES = '7d';

exports.login = async (req, res) => {
  try {
    const idValue = req.body.correo || req.body.identifier; // Simplificado para usar correo o un identificador genérico
    const pwd = req.body.contrasena || req.body.password; // Acepta 'contrasena' o 'password'
    if (!idValue || !pwd) return res.status(400).json({ error: 'Faltan credenciales' });

    const user = await UsuarioDao.findByCorreo(idValue);
    if (!user) return res.status(401).json({ error: 'Usuario o contrasena inválidos' });

    const match = await bcrypt.compare(pwd, user.contrasena);
    if (!match) return res.status(401).json({ error: 'Usuario o contrasena inválidos' });

    const dto = new UsuarioDto(user);
    const token = jwt.sign({ id: user.idUsuario, rol: user.rol }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ success: true, user: dto, token });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    res.status(500).json({ error: 'Error en login' });
  }
};

exports.register = async (req, res) => {
  try {
    const { nombres, apellidos, correo, telefono, dni, contrasena, rol } = req.body;

    if (!nombres || !apellidos || !correo || !telefono || !dni || !contrasena) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const existing = await UsuarioDao.findByCorreo(correo);
    if (existing) return res.status(409).json({ error: 'El correo ya está registrado' });

    // Hashear la contrasena antes de guardarla
    const hashedContrasena = await bcrypt.hash(contrasena, 10);

    const id = await UsuarioDao.create({ 
      nombres, 
      apellidos, 
      correo, 
      telefono, 
      dni, 
      contrasena: hashedContrasena, // Usar la contrasena hasheada
      rol: rol || 'Cliente' 
    });
    await ClienteService.createClient({
        nombres,
        apellidos,
        correo,
        dni,
        telefono,
        fk_idUsuario: idUsuarioCreado // Vinculamos con la llave foránea
    });
    
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Usuario ya existe' });
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};
