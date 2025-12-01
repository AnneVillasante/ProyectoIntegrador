// backend/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const { createClientByAdmin, getMyProfile } = require('../controllers/clienteController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// POST /api/clientes - Ruta protegida para que solo admins creen clientes
router.post('/', [protect, isAdmin], createClientByAdmin);

// GET /api/clientes/perfil - Ruta protegida para que un usuario obtenga su propio perfil
router.get('/perfil', protect, getMyProfile);

module.exports = router;