const cuponService = require('../services/cuponService');

const getAllCoupons = async (req, res) => {
    try {
        const cupones = await cuponService.getAllCoupons();
        res.json(cupones);
    } catch (error) {
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
        res.status(500).json({ message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const newCoupon = await cuponService.createCoupon(req.body);
        res.status(201).json(newCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const updatedCoupon = await cuponService.updateCoupon(req.params.id, req.body);
        res.json(updatedCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        await cuponService.deleteCoupon(req.params.id);
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
};

