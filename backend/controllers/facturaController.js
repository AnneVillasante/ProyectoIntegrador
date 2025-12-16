/**
 * @fileoverview Controlador para las rutas de facturas.
 *
 * @version 1.0
 * @author Lunaria
 */

const FacturaService = require('../services/facturaService');
const logger = require('../config/logger');

const obtenerTodas = async (req, res, next) => {
  try {
    const facturas = await FacturaService.obtenerTodas();
    res.status(200).json(facturas);
  } catch (error) {
    logger.error('Error obteniendo todas las facturas:', error);
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const factura = await FacturaService.obtenerPorId(id);
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(200).json(factura);
  } catch (error) {
    logger.error('Error obteniendo factura por ID:', error);
    next(error);
  }
};

const generarFactura = async (req, res, next) => {
  try {
    const nuevaFactura = await FacturaService.generarFactura(req.body);
    res.status(201).json(nuevaFactura);
  } catch (error) {
    logger.error('Error generando factura:', error);
    error.statusCode = 400;
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exito = await FacturaService.eliminar(id);
    if (!exito) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    logger.error('Error eliminando factura:', error);
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  generarFactura,
  eliminar,
};
