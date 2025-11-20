const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware'); 
const multer = require('multer');

// Configuración de Multer para guardar las imágenes de perfil
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/perfiles/'); // Asegúrate de que la carpeta 'uploads/perfiles' exista en tu backend
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

// Rutas de perfil de usuario (protegidas)
router.use(authMiddleware); // Aplica el middleware a las rutas de abajo
router.get('/perfil', usuarioController.obtenerMiPerfil);
router.put('/perfil', usuarioController.actualizarMiPerfil);
router.put('/perfil/password', usuarioController.actualizarMiPassword);
router.post('/perfil/foto', upload.single('profileImage'), usuarioController.subirFotoPerfil); // Nueva ruta para subir foto

// Rutas CRUD completas
router.get('/', usuarioController.obtenerUsuarios);
router.get('/:id', usuarioController.obtenerUsuario);
router.post('/', usuarioController.crearUsuario);
router.put('/:id', usuarioController.actualizarUsuario);
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;