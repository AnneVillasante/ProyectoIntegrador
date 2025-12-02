/**
 * @fileoverview Defines the API routes for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocionController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route to get all promotions
router.get('/', promocionController.obtenerTodas);

// Public route to get a single promotion
router.get('/:id', promocionController.obtenerPorId);

// Admin-only routes
const adminOnly = [authenticate, authorize(['Administrador'])];
router.post('/', adminOnly, promocionController.crearPromocion);
router.put('/:id', adminOnly, promocionController.actualizarPromocion);
router.delete('/:id', adminOnly, promocionController.eliminarPromocion);

module.exports = router;