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
      // --- CORRECCIÓN DE SEGURIDAD ---
      // Si imagen no existe (es undefined), pasamos null explícitamente
      imagen: imagen || null, 
      descripcion: descripcion || null,
      // ------------------------------
      fechaInicio,
      fechaFin,
    });
    return new CampanaDTO(nuevaCampana);
  }

  static async actualizar(id, data) {
    const campanaExistente = await CampanaDAO.obtenerPorId(id);
    if (!campanaExistente) {
      return null;
    }

    // Lógica para mantener la imagen anterior si no se sube una nueva
    let imagenFinal = campanaExistente.imagen; // Por defecto, mantenemos la vieja
    if (data.imagen) {
      imagenFinal = data.imagen; // Si viene una nueva, la usamos
    }

    const datosParaActualizar = {
      titulo: data.titulo || campanaExistente.titulo,
      descripcion: data.descripcion || campanaExistente.descripcion,
      fechaInicio: data.fechaInicio || campanaExistente.fechaInicio,
      fechaFin: data.fechaFin || campanaExistente.fechaFin,
      imagen: imagenFinal // Usamos la variable que calculamos arriba
    };

    await CampanaDAO.actualizar(id, datosParaActualizar);
    
    // Recuperamos la versión actualizada para devolverla
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