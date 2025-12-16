/**
 * @fileoverview Data Access Object para la tabla 'factura'.
 *
 * @version 1.0
 * @author Lunaria
 */

const pool = require('../config/db');

const facturaDAO = {
  /**
   * @returns {Promise<Array<object>>}
   */
  async obtenerTodas() {
    const [rows] = await pool.query('SELECT * FROM factura ORDER BY fechaEmision DESC');
    return rows;
  },

  /**
   * @param {number} id
   * @returns {Promise<object|null>}
   */
  async obtenerPorId(id) {
    const [rows] = await pool.query('SELECT * FROM factura WHERE idFactura = ?', [id]);
    return rows[0] || null;
  },

  /**
   * @param {object} facturaData
   * @returns {Promise<number>} El ID de la nueva factura.
   */
  async crear(facturaData) {
    const { idPedido, total, numeroFactura, urlDocumento } = facturaData;
    const [result] = await pool.query(
      'INSERT INTO factura (idPedido, fechaEmision, total, numeroFactura, urlDocumento) VALUES (?, NOW(), ?, ?, ?)',
      [idPedido, total, numeroFactura, urlDocumento]
    );
    return result.insertId;
  },

  /**
   * @param {number} id
   * @returns {Promise<number>} El número de filas eliminadas.
   */
  async eliminar(id) {
    const [result] = await pool.query('DELETE FROM factura WHERE idFactura = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = facturaDAO;
