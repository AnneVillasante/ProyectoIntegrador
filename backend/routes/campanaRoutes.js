/**
 * @fileoverview Rutas para la API de campanas.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const campanaController = require('../controllers/campanaController');
// Importar middleware de seguridad
const { protect, isAdmin } = require('../middleware/authMiddleware');


// Obtener todas las campanas
router.get('/', campanaController.obtenerTodas);

// Obtener una campana por ID
router.get('/:id', campanaController.obtenerPorId);

router.post('/', protect, isAdmin, campanaController.crear);
router.put('/:id', protect, isAdmin, campanaController.actualizar);
router.delete('/:id', protect, isAdmin, campanaController.eliminar);

module.exports = router;