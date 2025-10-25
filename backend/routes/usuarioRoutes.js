const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Definir rutas limpias y profesionales
router.get('/', usuarioController.obtenerUsuarios);
router.post('/', usuarioController.crearUsuario);

module.exports = router;