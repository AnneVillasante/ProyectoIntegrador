const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');
const upload = require('../middleware/multerConfig'); // Importar configuración de Multer

router.get('/', subcategoriaController.getAll);
router.get('/categoria/:idCategoria', subcategoriaController.getByCategoria);
router.get('/:id', subcategoriaController.getById);
// Usar Multer para manejar la subida de un solo archivo en el campo 'imagen'
router.post('/', upload.single('imagen'), subcategoriaController.create);
router.put('/:id', upload.single('imagen'), subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

module.exports = router;