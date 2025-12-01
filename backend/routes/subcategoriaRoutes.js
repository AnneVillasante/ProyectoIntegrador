const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar imágenes de subcategorías
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/subcategorias/'); // Directorio específico
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', subcategoriaController.getAll);
router.get('/categoria/:idCategoria', subcategoriaController.getByCategoria);
router.get('/:id', subcategoriaController.getById);
// Usar Multer para manejar la subida de un solo archivo en el campo 'imagen'
router.post('/', upload.single('imagen'), subcategoriaController.create);
router.put('/:id', upload.single('imagen'), subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

module.exports = router;