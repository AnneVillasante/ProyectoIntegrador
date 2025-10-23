const express = require('express');
const router = express.Router();
const UsuarioDao = require('../dao/usuarioDao');
const bcrypt = require('bcryptjs');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Faltan credenciales' });

    const user = await UsuarioDao.findByUsername(username);
    if (!user) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Usuario o contraseña inválidos' });

    delete user.password; // no enviar contraseña
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error en login' });
  }
});

// POST /api/auth/register  (opcional)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Faltan campos' });

    const existing = await UsuarioDao.findByUsername(username);
    if (existing) return res.status(409).json({ error: 'Usuario ya existe' });

    const id = await UsuarioDao.create({ username, email, password });
    res.status(201).json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

module.exports = router;
