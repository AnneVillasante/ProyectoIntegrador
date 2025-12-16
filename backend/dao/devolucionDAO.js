/**
 * @fileoverview Data Access Object para el modelo Devolucion usando mysql2.
 *
 * @version 1.0
 * @author Lunaria
 */

const pool = require('../config/db');

class DevolucionDAO {
  /**
   * @returns {Promise<Array<object>>}
   */
  static async obtenerTodas() {
    const [rows] = await pool.query('SELECT * FROM devolucion ORDER BY fechaSolicitud DESC');
    return rows;
  }

  /**
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  static async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM devolucion WHERE idDevolucion = ?', [id]);
    return rows[0] || null;
  }

  /**
   * @param {object} data
   * @returns {Promise<number>} El ID de la nueva devolución.
   */
  static async crear(data) {
    const { idPedido, motivo, estado, montoReembolsado } = data;
    const [result] = await db.execute(
      'INSERT INTO devolucion (idPedido, motivo, fechaSolicitud, estado, montoReembolsado) VALUES (?, ?, NOW(), ?, ?)',
      [idPedido, motivo, estado, montoReembolsado]
    );
    return result.insertId;
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise<number>} El número de filas afectadas.
   */
  static async actualizar(id, data) {
    const { idPedido, motivo, estado, montoReembolsado } = data;
    const [result] = await db.execute(
      'UPDATE devolucion SET idPedido = ?, motivo = ?, estado = ?, montoReembolsado = ? WHERE idDevolucion = ?',
      [idPedido, motivo, estado, montoReembolsado, id]
    );
    return result.affectedRows;
  }
}

module.exports = DevolucionDAO;
