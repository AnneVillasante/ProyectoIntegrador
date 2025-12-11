// backend/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { protect } = require('../middleware/authMiddleware');

// 1. Crear un pedido
router.post('/', protect, pedidoController.createOrder);

// 2. Obtener todos los pedidos
router.get('/', protect, pedidoController.getAllOrders);

// 3. Obtener un pedido por ID (¡Esta es la que te falta!)
router.get('/:id', protect, pedidoController.getOrderById);

// 4. Actualizar estado de un pedido (Para el botón "Actualizar Estado" del modal)
router.put('/:id', protect, pedidoController.updateOrderStatus);

// 5. Eliminar un pedido
router.delete('/:id', protect, pedidoController.deleteOrder);

module.exports = router;
