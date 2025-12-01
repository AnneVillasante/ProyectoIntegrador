const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar imágenes de categorías
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categorias/'); // Directorio específico
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', categoriaController.getAll);
// Usar Multer para manejar la subida de un solo archivo en el campo 'imagen'
router.post('/', upload.single('imagen'), categoriaController.create);
router.put('/:id', upload.single('imagen'), categoriaController.update);
router.delete('/:id', categoriaController.delete);

module.exports = router;
