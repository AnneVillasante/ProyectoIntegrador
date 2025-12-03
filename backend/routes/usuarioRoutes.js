const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { protect, isAdmin } = require('../middleware/authMiddleware'); 
const multer = require('multer');
const { createStorage } = require('../config/cloudinary');

// Configuración de Multer para guardar imágenes de perfil en Cloudinary
const perfilStorage = createStorage('perfiles');
const upload = multer({ storage: perfilStorage });

// Rutas de perfil de usuario (protegidas)
router.use(protect); // Aplica el middleware 'protect' a todas las rutas de abajo
router.get('/perfil', usuarioController.obtenerMiPerfil);
router.put('/perfil', usuarioController.actualizarMiPerfil);
router.put('/perfil/password', usuarioController.actualizarMiPassword);
router.post('/perfil/foto', upload.single('profileImage'), usuarioController.subirFotoPerfil); // Nueva ruta para subir foto

// Rutas CRUD completas (solo para administradores)
router.get('/', isAdmin, usuarioController.obtenerUsuarios);
router.get('/:id', isAdmin, usuarioController.obtenerUsuario);
router.post('/', isAdmin, usuarioController.crearUsuario);
router.put('/:id', isAdmin, usuarioController.actualizarUsuario);
router.delete('/:id', isAdmin, usuarioController.eliminarUsuario);

module.exports = router;