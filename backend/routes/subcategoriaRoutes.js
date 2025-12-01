const express = require('express');
const router = express.Router();
const subcategoriaController = require('../controllers/subcategoriaController');

router.get('/', subcategoriaController.getAll);
router.get('/categoria/:idCategoria', subcategoriaController.getByCategoria);
router.get('/:id', subcategoriaController.getById);
router.post('/', subcategoriaController.create);
router.put('/:id', subcategoriaController.update);
router.delete('/:id', subcategoriaController.delete);

module.exports = router;