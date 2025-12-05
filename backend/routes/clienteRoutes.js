// backend/routes/clienteRoutes.js
const express = require('express');
const router = express.Router();
const { createClientByAdmin, getMyProfile, createQuickClient, searchClients } = require('../controllers/clienteController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/clientes?q=... - Ruta para buscar clientes (protegida para admins)
router.get('/', [protect, isAdmin], searchClients);

// POST /api/clientes - Ruta protegida para que solo admins creen clientes
router.post('/', [protect, isAdmin], createClientByAdmin);

// GET /api/clientes/perfil - Ruta protegida para que un usuario obtenga su propio perfil
router.get('/perfil', protect, getMyProfile);

// POST /api/clientes/quick-create - Crea un cliente rápido (sin usuario) para ventas físicas
router.post('/quick-create', [protect, isAdmin], createQuickClient);

module.exports = router;