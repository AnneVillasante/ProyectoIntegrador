/**
 * @fileoverview Data Access Object para el modelo Devolucion.
 *
 * @version 1.0
 * @author Lunaria
 */

const Devolucion = require('../models/devolucionModel');

class DevolucionDAO {
  /**
   * @returns {Promise<Array<Devolucion>>}
   */
  static async obtenerTodas() {
    return await Devolucion.findAll();
  }

  /**
   * @param {number} id
   * @returns {Promise<Devolucion|null>}
   */
  static async obtenerPorId(id) {
    return await Devolucion.findByPk(id);
  }

  /**
   * @param {object} data
   * @returns {Promise<Devolucion>}
   */
  static async crear(data) {
    return await Devolucion.create(data);
  }

  /**
   * @param {number} id
   * @param {object} data
   * @returns {Promise<[number, Array<Devolucion>]>}
   */
  static async actualizar(id, data) {
    return await Devolucion.update(data, { where: { idDevolucion: id } });
  }
}

module.exports = DevolucionDAO;
