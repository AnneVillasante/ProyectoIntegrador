/**
 * @fileoverview Rutas para la API de devoluciones.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const devolucionController = require('../controllers/devolucionController');

// Obtener todas las devoluciones (Admin)
router.get('/', devolucionController.obtenerTodas);

// Obtener una devolución por su ID (Admin/Cliente)
router.get('/:id', devolucionController.obtenerPorId);

// Solicitar una nueva devolución (Cliente)
router.post('/', devolucionController.solicitarDevolucion);

// Actualizar el estado de una devolución (Admin)
router.patch('/:id', devolucionController.actualizarEstado);

module.exports = router;
