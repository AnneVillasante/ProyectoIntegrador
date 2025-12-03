// backend/routes/pedidoRoutes.js
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const { protect } = require('../middleware/authMiddleware'); // Importamos solo la función 'protect'

router.post('/', protect, pedidoController.createOrder); // Usamos 'protect' como middleware

// Ruta para obtener todos los pedidos (para el panel de administración)
router.get('/', protect, pedidoController.getAllOrders);

module.exports = router;
