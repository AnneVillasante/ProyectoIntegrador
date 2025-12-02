/**
 * @fileoverview Data Access Object para el modelo Campaña.
 *
 * @version 1.0
 * @author Lunaria
 */

const Campaña = require('../models/campañaModel');

class CampañaDAO {
  /**
   * @returns {Promise<Array<Campaña>>}
   */
  static async obtenerTodas() {
    return await Campaña.findAll();
  }

  /**
   * @param {number} id
   * @returns {Promise<Campaña|null>}
   */
  static async obtenerPorId(id) {
    return await Campaña.findByPk(id);
  }

  /**
   * @param {object} data
   * @returns {Promise<Campaña>}
   */
  static async crear(data) {
    return await Campaña.create(data);
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise<[number, Array<Campaña>]>}
   */
  static async actualizar(id, data) {
    return await Campaña.update(data, { where: { idCampaña: id } });
  }

  /**
   * @param {number} id
   * @returns {Promise<number>}
   */
  static async eliminar(id) {
    return await Campaña.destroy({ where: { idCampaña: id } });
  }
}

module.exports = CampañaDAO;