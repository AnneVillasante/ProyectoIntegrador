const cuponService = require('../services/cuponService');
const logger = require('../config/logger');

const getAllCoupons = async (req, res) => {
    try {
        const cupones = await cuponService.getAllCoupons();
        res.json(cupones);
    } catch (error) {
        logger.error('Error obteniendo cupones:', error);
        res.status(500).json({ message: error.message });
    }
};

const getCouponById = async (req, res) => {
    try {
        const cupon = await cuponService.getCouponById(req.params.id);
        if (!cupon) {
            return res.status(404).json({ message: 'Cupón no encontrado' });
        }
        res.json(cupon);
    } catch (error) {
        logger.error('Error obteniendo cupón por ID:', error);
        res.status(500).json({ message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const newCoupon = await cuponService.createCoupon(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        logger.error('Error creando cupón:', error);
        res.status(400).json({ message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await cuponService.updateCoupon(req.params.id, req.body);
        res.json(updatedCoupon);
    } catch (error) {
        logger.error('Error actualizando cupón:', error);
        res.status(400).json({ message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await cuponService.deleteCoupon(req.params.id);
        res.status(204).send(); // No Content
    } catch (error) {
        logger.error('Error eliminando cupón:', error);
        res.status(400).json({ message: error.message });
    }
};

const validateCoupon = async (req, res) => {
    try {
        const { codigo_cupon } = req.body;
        const result = await cuponService.validateCoupon(codigo_cupon);
        res.json(result);
    } catch (error) {
        logger.error('Error validando cupón:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
};
