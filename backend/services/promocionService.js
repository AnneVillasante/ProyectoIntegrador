/**
 * @fileoverview Business logic for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const promocionDAO = require('../dao/promocionDAO');
const PromocionDTO = require('../dto/promocionDTO');

class PromocionService {
  async crearPromocion(promocionData) {
    // Basic validation
    if (!promocionData.titulo || !promocionData.tipoDescuento || !promocionData.valorDescuento) {
      throw new Error('Title, discount type, and discount value are required.');
    }
    const idNuevaPromocion = await promocionDAO.crear(promocionData);
    const promocionCreada = await promocionDAO.obtenerPorId(idNuevaPromocion);
    return new PromocionDTO(promocionCreada);
  }

  async obtenerTodas() {
    const promociones = await promocionDAO.obtenerTodas();
    return promociones.map((p) => new PromocionDTO(p));
  }

  async obtenerPorId(id) {
    const promocion = await promocionDAO.obtenerPorId(id);
    if (!promocion) {
      return null;
    }
    return new PromocionDTO(promocion);
  }

  async actualizarPromocion(id, promocionData) {
    const affectedRows = await promocionDAO.actualizar(id, promocionData);
    if (affectedRows === 0) {
      return null;
    }
    const promocionActualizada = await promocionDAO.obtenerPorId(id);
    return new PromocionDTO(promocionActualizada);
  }

  async eliminarPromocion(id) {
    const result = await promocionDAO.eliminar(id);
    if (result === 0) {
      throw new Error('Promotion not found or could not be deleted.');
    }
    return { message: 'Promotion deleted successfully.' };
  }
}

module.exports = new PromocionService();