/**
 * @fileoverview Lógica de negocio para campanas.
 *
 * @version 1.0
 * @author Lunaria
 */

const CampanaDAO = require('../dao/campanaDAO');
const CampanaDTO = require('../dto/campanaDTO');

class CampanaService {
  static async obtenerTodas() {
    const campanas = await CampanaDAO.obtenerTodas();
    return campanas.map(campana => new CampanaDTO(campana));
  }

  static async obtenerPorId(id) {
    const campana = await CampanaDAO.obtenerPorId(id);
    if (!campana) {
      return null;
    }
    return new CampanaDTO(campana);
  }

  static async crear(data) {
    const { titulo, imagen, descripcion, fechaInicio, fechaFin } = data;

    if (!titulo || !fechaInicio || !fechaFin) {
      throw new Error('Título, fecha de inicio y fecha de fin son requeridos.');
    }

    const nuevaCampana = await CampanaDAO.crear({
      titulo,
      imagen,
      descripcion,
      fechaInicio,
      fechaFin,
    });
    return new CampanaDTO(nuevaCampana);
  }

  static async actualizar(id, data) {
    const campana = await CampanaDAO.obtenerPorId(id);
    if (!campana) {
      return null;
    }

    await CampanaDAO.actualizar(id, data);
    const campanaActualizada = await CampanaDAO.obtenerPorId(id);
    return new CampanaDTO(campanaActualizada);
  }

  static async eliminar(id) {
    const campana = await CampanaDAO.obtenerPorId(id);
    if (!campana) {
      return null;
    }
    await CampanaDAO.eliminar(id);
    return { id };
  }
}

module.exports = CampanaService;