const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Rutas de perfil de usuario (protegidas)
router.use(authMiddleware); // Aplica el middleware a las rutas de abajo
router.get('/perfil', usuarioController.obtenerMiPerfil);
router.put('/perfil', usuarioController.actualizarMiPerfil);
router.put('/perfil/password', usuarioController.actualizarMiPassword);

// Rutas CRUD completas
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;