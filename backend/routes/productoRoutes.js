const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const multer = require('multer');
const { createStorage } = require('../config/cloudinary');

// Configuración de Multer para guardar imágenes de productos en Cloudinary
const productoStorage = createStorage({ folderName: 'productos' }); // Se recomienda pasar un objeto
const upload = multer({ storage: productoStorage });

// CRUD completo
router.get('/', productoController.list);
router.get('/:id', productoController.get);
router.post('/', upload.single('imagen'), productoController.create); // 'imagen' debe coincidir con el nombre en FormData
router.put('/:id', upload.single('imagen'), productoController.update);
router.delete('/:id', productoController.delete);

module.exports = router;
