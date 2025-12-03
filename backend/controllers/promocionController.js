/**
 * @fileoverview Controller for handling promotion-related API requests.
 *
 * @version 1.0
 * @author Lunaria
 */

const PromocionService = require('../services/promocionService');

const crearPromocion = async (req, res) => {
  try {
    const promocion = await PromocionService.crearPromocion(req.body);
    res.status(201).json(promocion);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la promoción', error: error.message });
  }
};

const obtenerTodas = async (req, res) => {
  try {
    const promociones = await PromocionService.obtenerTodas();
    res.status(200).json(promociones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las promociones', error: error.message });
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const promocion = await PromocionService.obtenerPorId(req.params.id);
    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.status(200).json(promocion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la promoción', error: error.message });
  }
};

const actualizarPromocion = async (req, res) => {
  try {
    const promocion = await PromocionService.actualizarPromocion(req.params.id, req.body);
    if (!promocion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.status(200).json(promocion);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la promoción', error: error.message });
  }
};

const eliminarPromocion = async (req, res) => {
  try {
    await PromocionService.eliminarPromocion(req.params.id);
    res.status(204).send(); // No Content
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la promoción', error: error.message });
  }
};

module.exports = {
  crearPromocion,
  obtenerTodas,
  obtenerPorId,
  actualizarPromocion,
  eliminarPromocion,
};