/**
 * @fileoverview Controlador para las rutas de devoluciones.
 *
 * @version 1.0
 * @author Lunaria
 */

const DevolucionService = require('../services/devolucionService');
const logger = require('../config/logger');

const obtenerTodas = async (req, res, next) => {
  try {
    const devoluciones = await DevolucionService.obtenerTodas();
    res.status(200).json(devoluciones);
  } catch (error) {
    logger.error('Error obteniendo todas las devoluciones:', error);
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const devolucion = await DevolucionService.obtenerPorId(id);
    if (!devolucion) {
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }
    res.status(200).json(devolucion);
  } catch (error) {
    logger.error('Error obteniendo devolución por ID:', error);
    next(error);
  }
};

const solicitarDevolucion = async (req, res, next) => {
  try {
    const nuevaDevolucion = await DevolucionService.solicitarDevolucion(req.body);
    res.status(201).json(nuevaDevolucion);
  } catch (error) {
    logger.error('Error solicitando devolución:', error);
    error.statusCode = 400;
    next(error);
  }
};

const actualizarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const devolucionActualizada = await DevolucionService.actualizarEstado(id, req.body);
    if (!devolucionActualizada) {
      return res.status(404).json({ message: 'Devolución no encontrada' });
    }
    res.status(200).json(devolucionActualizada);
  } catch (error) {
    logger.error('Error actualizando estado de devolución:', error);
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  solicitarDevolucion,
  actualizarEstado,
};
