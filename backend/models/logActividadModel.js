/**
 * @fileoverview Model for interacting with the logactividad table in the database.
 *
 * @version 1.0
 * @author Lunaria
 */

const db = require('../config/db');

class LogActividadModel {
  /**
   * Creates a new activity log entry.
   * @param {number} idUsuario - The ID of the user performing the action.
   * @param {string} accion - The action performed.
   * @param {string} descripcion - A description of the activity.
   * @returns {Promise<number>} The ID of the newly created log entry.
   */
  async registrar(idUsuario, accion, descripcion) {
    const [result] = await db.promise().execute(
      'INSERT INTO logactividad (idUsuario, accion, descripcion, fechaHora) VALUES (?, ?, ?, ?)',
      [idUsuario, accion, descripcion, new Date()]
    );
    return result.insertId;
  }

  /**
   * Retrieves all activity logs from the database.
   * @returns {Promise<Array<Object>>} A list of all activity logs.
   */
  async obtenerTodos() {
    const [rows] = await db
      .promise()
      .query('SELECT * FROM logactividad ORDER BY fechaHora DESC');
    return rows;
  }
}

module.exports = new LogActividadModel();