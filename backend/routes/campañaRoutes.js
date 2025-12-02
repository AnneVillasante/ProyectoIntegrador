/**
 * @fileoverview Rutas para la API de campañas.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const campañaController = require('../controllers/campañaController');
// Importar middleware de seguridad
const { protect, isAdmin } = require('../middleware/authMiddleware');


// Obtener todas las campañas
router.get('/', campañaController.obtenerTodas);

// Obtener una campaña por ID
router.get('/:id', campañaController.obtenerPorId);

router.post('/', protect, isAdmin, campañaController.crear);
router.put('/:id', protect, isAdmin, campañaController.actualizar);
router.delete('/:id', protect, isAdmin, campañaController.eliminar);

module.exports = router;