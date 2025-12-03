/**
 * @fileoverview Data Access Object para el modelo Campana usando mysql2.
 *
 * @version 1.0
 * @author Lunaria
 */

const db = require('../config/db');

class CampanaDAO {
  /**
   * @returns {Promise<Array<object>>}
   */
  static async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM campana ORDER BY fechaInicio DESC');
    return rows;
  }

  /**
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM campana WHERE idCampana = ?', [id]);
    return rows[0] || null;
  }

  /**
   * @param {object} data
   * @returns {Promise<number>} El ID de la nueva campana.
   */
  static async crear(data) {
    const { titulo, imagen, descripcion, fechaInicio, fechaFin } = data;
    const [result] = await db.execute(
      'INSERT INTO campana (titulo, imagen, descripcion, fechaInicio, fechaFin) VALUES (?, ?, ?, ?, ?)',
      [titulo, imagen, descripcion, fechaInicio, fechaFin]
    );
    return result.insertId;
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise<number>} El número de filas afectadas.
   */
  static async actualizar(id, data) {
    const { titulo, imagen, descripcion, fechaInicio, fechaFin } = data;
    const [result] = await db.execute(
      'UPDATE campana SET titulo = ?, imagen = ?, descripcion = ?, fechaInicio = ?, fechaFin = ? WHERE idCampana = ?',
      [titulo, imagen, descripcion, fechaInicio, fechaFin, id]
    );
    return result.affectedRows;
  }

  /**
   * @param {number} id
   * @returns {Promise<number>} El número de filas afectadas.
   */
  static async eliminar(id) {
    const [result] = await db.execute('DELETE FROM campana WHERE idCampana = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = CampanaDAO;