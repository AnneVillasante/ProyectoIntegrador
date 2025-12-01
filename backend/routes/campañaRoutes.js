/**
 * @fileoverview Rutas para la API de campañas.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const campañaController = require('../controllers/campañaController');

// Obtener todas las campañas
router.get('/', campañaController.obtenerTodas);

// Obtener una campaña por ID
router.get('/:id', campañaController.obtenerPorId);

// Crear una nueva campaña
router.post('/', campañaController.crear);

// Actualizar una campaña existente
router.put('/:id', campañaController.actualizar);

// Eliminar una campaña
router.delete('/:id', campañaController.eliminar);

module.exports = router;