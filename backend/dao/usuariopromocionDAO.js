/**
 * @fileoverview Data Access Object for the usuariopromocion table.
 *
 * @version 1.0
 * @author Lunaria
 */

const db = require('../config/db');

const usuariopromocionDAO = {
  /**
   * Assigns a promotion to a user.
   * @param {number} idUsuario The user's ID.
   * @param {number} idPromocion The promotion's ID.
   * @returns {Promise<object>} The created association.
   */
  async asignar(idUsuario, idPromocion) {
    const [result] = await db.execute(
      'INSERT INTO usuariopromocion (idUsuario, idPromocion, estado) VALUES (?, ?, ?)',
      [idUsuario, idPromocion, 'Pendiente']
    );
    return { idUsuario, idPromocion, affectedRows: result.affectedRows };
  },

  /**
   * Finds all promotions for a given user.
   * @param {number} idUsuario The user's ID.
   * @returns {Promise<Array<object>>} A list of user promotions with promotion details.
   */
  async obtenerPorUsuario(idUsuario) {
    const [rows] = await db.query(
      `SELECT up.*, p.titulo, p.descripcion, p.tipoDescuento, p.valorDescuento 
       FROM usuariopromocion up
       JOIN promocion p ON up.idPromocion = p.idPromocion
       WHERE up.idUsuario = ?`,
      [idUsuario]
    );
    return rows;
  },

  /**
   * Updates the status of a user's promotion.
   * @param {number} idUsuario The user's ID.
   * @param {number} idPromocion The promotion's ID.
   * @param {'Pendiente' | 'Usado'} estado The new status.
   * @returns {Promise<number>} The number of affected rows.
   */
  async actualizarEstado(idUsuario, idPromocion, estado) {
    const fechaUso = estado === 'Usado' ? new Date() : null;
    const [result] = await db.execute(
      'UPDATE usuariopromocion SET estado = ?, fechaUso = ? WHERE idUsuario = ? AND idPromocion = ?',
      [estado, fechaUso, idUsuario, idPromocion]
    );
    return result.affectedRows;
  },
};

module.exports = usuariopromocionDAO;