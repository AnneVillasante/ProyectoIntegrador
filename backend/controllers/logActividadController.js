/**
 * @fileoverview Controller for handling activity log-related API requests.
 *
 * @version 1.0
 * @author Lunaria
 */

const LogActividadService = require('../services/logActividadService');
const logger = require('../config/logger');

/**
 * Handles the request to get all activity logs.
 * @param {object} req - The Express request object.
 * @param {object} res - The Express response object.
 * @param {function} next - The Express next middleware function.
 */
const obtenerTodos = async (req, res, next) => {
  try {
    const logs = await LogActividadService.obtenerTodos();
    res.status(200).json(logs);
  } catch (error) {
    logger.error('Error obteniendo logs de actividad:', error);
    next(error);
  }
};

module.exports = { obtenerTodos };