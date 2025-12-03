const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint para que el frontend solicite un PaymentIntent para iniciar un pago.
// POST /api/pagos/crear-intento-pago
router.post('/crear-intento-pago', protect, pagoController.crearIntentoDePago);

// Endpoint de Webhook para que Stripe notifique a nuestro backend sobre el estado del pago.
// Es crucial para confirmar la transacción de forma segura.
// POST /api/pagos/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), pagoController.stripeWebhook);

module.exports = router;