const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');

// GET /api/cupones - Obtener todos los cupones
router.get('/', cuponController.getAllCoupons);

// GET /api/cupones/:id - Obtener un cupón por ID
router.get('/:id', cuponController.getCouponById);

// POST /api/cupones - Crear un nuevo cupón
router.post('/', cuponController.createCoupon);

// PUT /api/cupones/:id - Actualizar un cupón existente
router.put('/:id', cuponController.updateCoupon);

// DELETE /api/cupones/:id - Eliminar un cupón
router.delete('/:id', cuponController.deleteCoupon);

module.exports = router;

