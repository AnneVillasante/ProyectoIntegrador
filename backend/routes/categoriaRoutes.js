const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const upload = require('../middleware/multerConfig'); // Importar configuración de Multer

router.get('/', categoriaController.getAll);
// Usar Multer para manejar la subida de un solo archivo en el campo 'imagen'
router.post('/', upload.single('imagen'), categoriaController.create);
router.put('/:id', upload.single('imagen'), categoriaController.update);
router.delete('/:id', categoriaController.delete);

module.exports = router;
