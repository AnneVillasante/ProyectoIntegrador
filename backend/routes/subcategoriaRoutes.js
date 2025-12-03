const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const multer = require('multer');
const { createStorage } = require('../config/cloudinary');

// Configuración de Multer para guardar imágenes de subcategorías en Cloudinary
const subcategoriaStorage = createStorage('subcategorias');
const upload = multer({ storage: subcategoriaStorage });

router.get('/', subcategoriaController.getAll);
router.get('/categoria/:idCategoria', subcategoriaController.getByCategoria);
router.get('/:id', subcategoriaController.getById);
// Usar Multer para manejar la subida de un solo archivo en el campo 'imagen'
router.post('/', upload.single('imagen'), subcategoriaController.create);
router.put('/:id', upload.single('imagen'), subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

module.exports = router;