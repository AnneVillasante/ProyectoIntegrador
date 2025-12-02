/**
 * @fileoverview Lógica de negocio para devoluciones.
 *
 * @version 1.0
 * @author Lunaria
 */

const DevolucionDAO = require('../dao/devolucionDAO');
const DevolucionDTO = require('../dto/devolucionDTO');

class DevolucionService {
  static async obtenerTodas() {
    const devoluciones = await DevolucionDAO.obtenerTodas();
    return devoluciones.map(devolucion => new DevolucionDTO(devolucion));
  }

  static async obtenerPorId(id) {
    const devolucion = await DevolucionDAO.obtenerPorId(id);
    if (!devolucion) {
      return null;
    }
    return new DevolucionDTO(devolucion);
  }

  static async solicitarDevolucion(data) {
    const { idPedido, motivo } = data;

    if (!idPedido || !motivo) {
      throw new Error('El ID del pedido y el motivo son requeridos.');
    }

    const nuevaDevolucion = await DevolucionDAO.crear({
      idPedido,
      motivo,
      fechaSolicitud: new Date(),
      estado: 'solicitada', // Estado inicial
    });
    return new DevolucionDTO(nuevaDevolucion);
  }

  static async actualizarEstado(id, data) {
    const { estado, montoReembolsado } = data;
    const devolucion = await DevolucionDAO.obtenerPorId(id);
    if (!devolucion) {
      return null;
    }

    if (!estado) {
      throw new Error('El nuevo estado es requerido.');
    }

    await DevolucionDAO.actualizar(id, { estado, montoReembolsado });
    const devolucionActualizada = await DevolucionDAO.obtenerPorId(id);
    return new DevolucionDTO(devolucionActualizada);
  }
}

module.exports = DevolucionService;
