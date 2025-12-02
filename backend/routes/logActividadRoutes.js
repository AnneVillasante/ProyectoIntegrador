/**
 * @fileoverview Defines the API routes for activity logs.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const logActividadController = require('../controllers/logActividadController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @route GET /api/logs
 * @description Get all activity logs.
 * @access Private (Admin only)
 */
router.get('/', authenticate, authorize(['Administrador']), logActividadController.obtenerTodos);

module.exports = router;