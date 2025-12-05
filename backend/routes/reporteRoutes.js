const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');

// Rutas para generar reportes
// El cuerpo de la solicitud puede incluir { formato: 'pdf' | 'csv' | 'json', usuario: 'nombreUsuario' }
router.post('/usuarios', reporteController.generateUsuarioReport);
router.post('/productos', reporteController.generateProductosReport);
router.post('/ventas', reporteController.generateVentasReport);

// Ruta para generar un ticket de venta específico
router.get('/ticket/:idPedido', reporteController.generateTicket);

// Rutas para gestionar el historial de reportes
router.get('/', reporteController.listAll);
router.get('/:id', reporteController.getById);
router.get('/tipo/:tipo', reporteController.getByTipo);
router.delete('/:id', reporteController.delete);

// El módulo ahora exporta el router directamente.
// La instancia de jsreport debe ser adjuntada al objeto `app` en tu archivo principal (ej: app.js o server.js)
// y se accederá a ella a través de `req.app.get('jsreport')` en el controlador.
module.exports = router;
