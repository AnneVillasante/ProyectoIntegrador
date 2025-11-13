const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Generar reportes
router.post('/ventas', reporteController.generateVentasReport);
router.post('/productos', reporteController.generateProductosReport);
router.post('/usuarios', reporteController.generateUsuariosReport);

// Obtener reportes
router.get('/', reporteController.listAll);
router.get('/:id', reporteController.getById);
router.get('/tipo/:tipo', reporteController.getByTipo);

// Eliminar reporte
router.delete('/:id', reporteController.delete);

module.exports = router;
