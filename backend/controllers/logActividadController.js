/**
 * @fileoverview Controller for handling activity log-related API requests.
 *
 * @version 1.0
 * @author Lunaria
 */

const LogActividadService = require('../services/logActividadService');

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
    next(error);
  }
};

module.exports = { obtenerTodos };