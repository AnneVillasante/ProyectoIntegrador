const UsuarioDao = require('../dao/usuarioDao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioDto = require('../dto/usuarioDto');

const JWT_SECRET = process.env.JWT_SECRET || 'cambiar_esto_en_produccion';
const JWT_EXPIRES = '7d';

exports.login = async (req, res) => {
  try {
    const idValue = req.body.correo || req.body.nombre || req.body.identifier || req.body.email || req.body.username;
    const pwd = req.body.contraseña || req.body.password;
    if (!idValue || !pwd) return res.status(400).json({ error: 'Faltan credenciales' });

    const user = await UsuarioDao.findByIdentifier(idValue);
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    const match = await bcrypt.compare(pwd, user.contraseña);
    if (!match) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

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
    const nombre = req.body.nombre || req.body.username || req.body.regName;
    const correo = req.body.correo || req.body.email || req.body.regEmail;
    const contraseña = req.body.contraseña || req.body.password || req.body.regPassword;
    const rol = req.body.rol || 'cliente';

    if (!nombre || !correo || !contraseña) return res.status(400).json({ error: 'Faltan campos' });

    const existing = await UsuarioDao.findByCorreo(correo);
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const id = await UsuarioDao.create({ nombre, correo, contraseña, rol });
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error('REGISTER ERROR:', err);
    if (err && err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Usuario ya existe' });
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};
