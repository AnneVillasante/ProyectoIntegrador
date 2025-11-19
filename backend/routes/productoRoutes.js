const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// CRUD completo
router.get('/', productoController.list);
router.get('/:id', productoController.get);
router.post('/', productoController.create);
router.put('/:id', productoController.update);
router.delete('/:id', productoController.delete);

module.exports = router;
