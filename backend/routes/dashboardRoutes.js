// backend/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware'); // Si usas protección

router.get('/metricas', protect, dashboardController.getMetrics);

module.exports = router;