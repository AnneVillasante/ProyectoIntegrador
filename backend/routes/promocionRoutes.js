/**
 * @fileoverview Defines the API routes for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocionController');
// CAMBIO 1: Importar del archivo correcto (authMiddleware) y usar los nombres correctos (protect, isAdmin)
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route to get all promotions
router.get('/', promocionController.obtenerTodas);

// Public route to get a single promotion
router.get('/:id', promocionController.obtenerPorId);

// Admin-only routes
// CAMBIO 2: Usar 'protect' para verificar el token e 'isAdmin' para verificar el rol
const adminOnly = [protect, isAdmin]; 

router.post('/', adminOnly, promocionController.crearPromocion);
router.put('/:id', adminOnly, promocionController.actualizarPromocion);
router.delete('/:id', adminOnly, promocionController.eliminarPromocion);

module.exports = router;