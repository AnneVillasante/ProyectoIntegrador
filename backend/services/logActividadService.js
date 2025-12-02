/**
 * @fileoverview Service layer for activity log business logic.
 *
 * @version 1.0
 * @author Lunaria
 */

const logActividadModel = require('../models/logActividadModel');
const LogActividadDTO = require('../dto/logActividadDTO');

class LogActividadService {
  /**
   * Retrieves all activity logs.
   * @returns {Promise<Array<LogActividadDTO>>} A list of activity logs.
   */
  async obtenerTodos() {
    const logs = await logActividadModel.obtenerTodos();
    return logs.map((log) => new LogActividadDTO(log));
  }

  /**
   * Creates a new activity log.
   * @param {number} idUsuario - The user's ID.
   * @param {string} accion - The action performed.
   * @param {string} descripcion - A description of the action.
   * @returns {Promise<number>} The ID of the new log entry.
   */
  async registrar(idUsuario, accion, descripcion) {
    if (!idUsuario || !accion) {
      throw new Error('idUsuario and accion are required to register an activity.');
    }
    return logActividadModel.registrar(idUsuario, accion, descripcion);
  }
}

module.exports = new LogActividadService();