const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar imágenes de productos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/productos/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    // Generar un nombre de archivo único para evitar colisiones
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// CRUD completo
router.get('/', productoController.list);
router.get('/:id', productoController.get);
router.post('/', upload.single('imagen'), productoController.create); // 'imagen' debe coincidir con el nombre en FormData
router.put('/:id', upload.single('imagen'), productoController.update);
router.delete('/:id', productoController.delete);

module.exports = router;
