// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET } = require('../config/config');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Adjuntar el usuario a la solicitud
      const [rows] = await pool.promise().query('SELECT idUsuario as id, correo, rol FROM usuario WHERE idUsuario = ?', [decoded.id]);
      req.user = rows[0];

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado.' });
      }

      next();
    } catch (error) {
      // Ser más específico con el error puede ayudar en la depuración
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'No autorizado, el token es inválido.' });
      }
      console.error('Error en middleware de protección:', error);
      return res.status(401).json({ message: 'No autorizado, problema con el token.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token.' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Administrador') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};

module.exports = { protect, isAdmin };