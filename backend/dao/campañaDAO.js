/**
 * @fileoverview Data Access Object para el modelo Campaña usando mysql2.
 *
 * @version 1.0
 * @author Lunaria
 */

const db = require('../config/db');

class CampañaDAO {
  /**
   * @returns {Promise<Array<object>>}
   */
  static async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM campaña ORDER BY fechaInicio DESC');
    return rows;
  }

  /**
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM campaña WHERE idCampaña = ?', [id]);
    return rows[0] || null;
  }

  /**
   * @param {object} data
   * @returns {Promise<number>} El ID de la nueva campaña.
   */
  static async crear(data) {
    const { titulo, imagen, descripcion, fechaInicio, fechaFin } = data;
    const [result] = await db.execute(
      'INSERT INTO campaña (titulo, imagen, descripcion, fechaInicio, fechaFin) VALUES (?, ?, ?, ?, ?)',
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
      'UPDATE campaña SET titulo = ?, imagen = ?, descripcion = ?, fechaInicio = ?, fechaFin = ? WHERE idCampaña = ?',
      [titulo, imagen, descripcion, fechaInicio, fechaFin, id]
    );
    return result.affectedRows;
  }

  /**
   * @param {number} id
   * @returns {Promise<number>} El número de filas afectadas.
   */
  static async eliminar(id) {
    const [result] = await db.execute('DELETE FROM campaña WHERE idCampaña = ?', [id]);
    return result.affectedRows;
  }
}

module.exports = CampañaDAO;