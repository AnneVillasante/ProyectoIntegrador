/**
 * @fileoverview Controlador para las rutas de campañas.
 *
 * @version 1.0
 * @author Lunaria
 */

const CampañaService = require('../services/campañaService');

const obtenerTodas = async (req, res, next) => {
  try {
    const campañas = await CampañaService.obtenerTodas();
    res.status(200).json(campañas);
  } catch (error) {
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaña = await CampañaService.obtenerPorId(id);
    if (!campaña) {
      return res.status(404).json({ message: 'Campaña no encontrada' });
    }
    res.status(200).json(campaña);
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    const nuevaCampaña = await CampañaService.crear(req.body);
    res.status(201).json(nuevaCampaña);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campañaActualizada = await CampañaService.actualizar(id, req.body);
    if (!campañaActualizada) {
      return res.status(404).json({ message: 'Campaña no encontrada' });
    }
    res.status(200).json(campañaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await CampañaService.eliminar(id);
    if (!resultado) {
      return res.status(404).json({ message: 'Campaña no encontrada' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};