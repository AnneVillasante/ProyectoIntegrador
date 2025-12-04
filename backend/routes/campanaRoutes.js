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
const { protect, isAdmin } = require('../middleware/authMiddleware');

// --- CAMBIO 1: Importar configuración de Cloudinary ---
const { createStorage } = require('../config/cloudinary');

// --- CAMBIO 2: Crear el almacenamiento específico para campanas ---
const storage = createStorage('campanas'); // Las imágenes irán a la carpeta 'campanas' en tu Cloudinary
const upload = multer({ storage: storage });

router.get('/', campanaController.obtenerTodas);
router.get('/:id', campanaController.obtenerPorId);

// --- CAMBIO 3: Usar 'upload.single' con la configuración nueva ---
// 'imagen' debe coincidir con el nombre que usas en el frontend (formData.append('imagen', ...))
router.post('/', protect, isAdmin, upload.single('imagen'), campanaController.crear);
router.put('/:id', protect, isAdmin, upload.single('imagen'), campanaController.actualizar);
router.delete('/:id', protect, isAdmin, campanaController.eliminar);

module.exports = router;