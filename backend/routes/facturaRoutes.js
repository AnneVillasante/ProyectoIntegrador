/**
 * @fileoverview Rutas para la API de facturas.
 *
 * @version 1.0
 * @author Lunaria
 */
 
const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
 
// Obtener todas las facturas
router.get('/', facturaController.obtenerTodas);
 
// Obtener una factura por su ID
router.get('/:id', facturaController.obtenerPorId);
 
// Generar una nueva factura
router.post('/', facturaController.generarFactura);
 
// Eliminar una factura (uso administrativo)
router.delete('/:id', facturaController.eliminar);
 
module.exports = router;
