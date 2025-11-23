const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');
const authMiddleware = require('../middleware/authMiddleware'); // Asumiendo que authMiddleware existe

// Todas las rutas de carrito requieren autenticación
router.use(authMiddleware);

// Obtener el carrito del usuario autenticado
router.get('/', carritoController.getCart);

// Agregar un producto al carrito o actualizar su cantidad si ya existe
router.post('/', carritoController.addItemToCart);

// Actualizar la cantidad de un producto específico en el carrito
// Si la cantidad es 0, se eliminará el producto
router.put('/:idProducto', carritoController.updateCartItem);

// Eliminar un producto específico del carrito
router.delete('/:idProducto', carritoController.removeItemFromCart);

// Vaciar completamente el carrito del usuario
router.delete('/', carritoController.clearCart);

module.exports = router;