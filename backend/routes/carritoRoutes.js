const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const { protect } = require('../middleware/authMiddleware');

// Todas las rutas del carrito requieren que el usuario esté autenticado.
router.use(protect);

// Obtener el carrito del usuario autenticado
router.get('/', carritoController.getCart); // GET /api/carrito

// Agregar un producto al carrito o actualizar su cantidad si ya existe
router.post('/', carritoController.addItemToCart); // POST /api/carrito

// Actualizar la cantidad de un producto específico en el carrito
// Si la cantidad es 0, se eliminará el producto
router.put('/:idProducto', carritoController.updateCartItem); // PUT /api/carrito/123

// Eliminar un producto específico del carrito
router.delete('/:idProducto', carritoController.removeItemFromCart); // DELETE /api/carrito/123

// Vaciar completamente el carrito del usuario
router.delete('/', carritoController.clearCart); // DELETE /api/carrito

module.exports = router;