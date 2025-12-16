const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

// Define el endpoint de salud
// No requiere autenticación, por lo que se coloca sin middleware
router.get('/', healthController.getHealthStatus);

module.exports = router;