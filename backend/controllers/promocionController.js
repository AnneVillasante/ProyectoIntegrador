/**
 * @fileoverview Controller for handling promotion-related API requests.
 *
 * @version 1.0
 * @author Lunaria
 */

const PromocionService = require('../services/promocionService');

const crearPromocion = async (req, res, next) => {
  try {
    const promocion = await PromocionService.crearPromocion(req.body);
    res.status(201).json(promocion);
  } catch (error) {
    next(error);
  }
};

const obtenerTodas = async (req, res, next) => {
  try {
    const promociones = await PromocionService.obtenerTodas();
    res.status(200).json(promociones);
  } catch (error) {
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const promocion = await PromocionService.obtenerPorId(req.params.id);
    if (!promocion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(promocion);
  } catch (error) {
    next(error);
  }
};

const actualizarPromocion = async (req, res, next) => {
  try {
    const promocion = await PromocionService.actualizarPromocion(req.params.id, req.body);
    if (!promocion) {
      return res.status(404).json({ message: 'Promotion not found' });
    }
    res.status(200).json(promocion);
  } catch (error) {
    next(error);
  }
};

const eliminarPromocion = async (req, res, next) => {
  try {
    await PromocionService.eliminarPromocion(req.params.id);
    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearPromocion,
  obtenerTodas,
  obtenerPorId,
  actualizarPromocion,
  eliminarPromocion,
};