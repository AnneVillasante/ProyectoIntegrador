/**
 * @fileoverview Lógica de negocio para campañas.
 *
 * @version 1.0
 * @author Lunaria
 */

const CampañaDAO = require('../dao/campañaDAO');
const CampañaDTO = require('../dto/campañaDTO');

class CampañaService {
  static async obtenerTodas() {
    const campañas = await CampañaDAO.obtenerTodas();
    return campañas.map(campaña => new CampañaDTO(campaña));
  }

  static async obtenerPorId(id) {
    const campaña = await CampañaDAO.obtenerPorId(id);
    if (!campaña) {
      return null;
    }
    return new CampañaDTO(campaña);
  }

  static async crear(data) {
    const { titulo, imagen, descripcion, fechaInicio, fechaFin } = data;

    if (!titulo || !fechaInicio || !fechaFin) {
      throw new Error('Título, fecha de inicio y fecha de fin son requeridos.');
    }

    const nuevaCampaña = await CampañaDAO.crear({
      titulo,
      imagen,
      descripcion,
      fechaInicio,
      fechaFin,
    });
    return new CampañaDTO(nuevaCampaña);
  }

  static async actualizar(id, data) {
    const campaña = await CampañaDAO.obtenerPorId(id);
    if (!campaña) {
      return null;
    }

    await CampañaDAO.actualizar(id, data);
    const campañaActualizada = await CampañaDAO.obtenerPorId(id);
    return new CampañaDTO(campañaActualizada);
  }

  static async eliminar(id) {
    const campaña = await CampañaDAO.obtenerPorId(id);
    if (!campaña) {
      return null;
    }
    await CampañaDAO.eliminar(id);
    return { id };
  }
}

module.exports = CampañaService;