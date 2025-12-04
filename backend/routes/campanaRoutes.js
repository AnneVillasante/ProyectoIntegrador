/**
 * @fileoverview Rutas para la API de campanas.
 *
 * @version 1.0
 * @author Lunaria
 */

const express = require('express');
const router = express.Router();
const campanaController = require('../controllers/campanaController');
const multer = require('multer');
// Importar middleware de seguridad
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Configuración de Multer para manejar la subida de archivos.
// Por ahora, lo configuramos para que no guarde el archivo en disco,
// solo para que procese los campos de texto del formulario.
// Si quisieras guardar la imagen, aquí se configuraría el `diskStorage`.
const upload = multer();

// Obtener todas las campanas
router.get('/', campanaController.obtenerTodas);

// Obtener una campana por ID
router.get('/:id', campanaController.obtenerPorId);

router.post('/', protect, isAdmin, upload.single('imagen'), campanaController.crear);
router.put('/:id', protect, isAdmin, upload.single('imagen'), campanaController.actualizar);
router.delete('/:id', protect, isAdmin, campanaController.eliminar);

module.exports = router;