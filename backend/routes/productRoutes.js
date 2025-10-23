const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.list);
router.get('/:id', productController.get);

// Puedes añadir rutas POST/PUT/DELETE que usen autenticación si lo deseas
module.exports = router;