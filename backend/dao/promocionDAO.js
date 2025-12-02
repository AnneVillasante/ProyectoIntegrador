/**
 * @fileoverview Data Access Object for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const Promocion = require('../models/promocionModel');

const promocionDAO = {
  async crear(promocionData) {
    return await Promocion.create(promocionData);
  },

  async obtenerTodas() {
    return await Promocion.findAll();
  },

  async obtenerPorId(id) {
    return await Promocion.findByPk(id);
  },

  async actualizar(id, promocionData) {
    const [updated] = await Promocion.update(promocionData, {
      where: { idPromocion: id },
    });
    if (updated) {
      return await this.obtenerPorId(id);
    }
    return null;
  },

  async eliminar(id) {
    return await Promocion.destroy({
      where: { idPromocion: id },
    });
  },
};

module.exports = promocionDAO;