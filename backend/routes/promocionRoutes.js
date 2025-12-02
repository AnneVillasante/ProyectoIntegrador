/**
 * @fileoverview Defines the API routes for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public route to get all promotions
router.get('/', promocionController.obtenerTodas);

// Public route to get a single promotion
router.get('/:id', promocionController.obtenerPorId);

// Admin-only routes for creating, updating, and deleting promotions
router.post('/', protect, isAdmin, promocionController.crearPromocion);
router.put('/:id', protect, isAdmin, promocionController.actualizarPromocion);
router.delete('/:id', protect, isAdmin, promocionController.eliminarPromocion);

module.exports = router;