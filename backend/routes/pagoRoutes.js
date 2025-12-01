// backend/routes/pagoRoutes.js
const express = require('express');
const router = express.Router();
const pagoController = require('../controllers/pagoController');

// Ruta para el webhook de Stripe
// Es importante que el body se reciba en formato raw, no JSON.
// Por eso se define antes de express.json() en el servidor principal.
router.post('/webhook', express.raw({ type: 'application/json' }), pagoController.stripeWebhook);

// Aquí podrían ir otras rutas de pago en el futuro

module.exports = router;