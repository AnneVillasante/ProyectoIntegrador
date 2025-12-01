/**
 * @fileoverview Data Transfer Object para Devolucion.
 *
 * @version 1.0
 * @author Lunaria
 */

class DevolucionDTO {
  constructor({ idDevolucion, idPedido, motivo, fechaSolicitud, estado, montoReembolsado }) {
    this.id = idDevolucion;
    this.idPedido = idPedido;
    this.motivo = motivo;
    this.fechaSolicitud = fechaSolicitud;
    this.estado = estado;
    this.montoReembolsado = montoReembolsado;
  }
}

module.exports = DevolucionDTO;
