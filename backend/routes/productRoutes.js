const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productoDAO = require('../dao/productoDAO');

// Rutas API
router.get('/api/productos', async (req, res) => {
  try {
    const productos = await productoDAO.obtenerProductos();
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// CRUD completo (si lo usas en panel admin)
router.get('/', productController.list);
router.get('/:id', productController.get);
router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

module.exports = router;
