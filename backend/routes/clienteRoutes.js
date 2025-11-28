// backend/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const { createClientByAdmin } = require('../controllers/clienteController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// POST /api/clientes - Ruta protegida para que solo admins creen clientes
router.post('/', [protect, isAdmin], createClientByAdmin);

module.exports = router;