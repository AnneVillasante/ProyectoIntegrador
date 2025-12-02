/**
 * @fileoverview Model class for Devolucion.
 * Represents the structure of a return object.
 *
 * @version 1.0
 * @author Lunaria
 */

class Devolucion {
  constructor({ idDevolucion, idPedido, motivo, fechaSolicitud, estado, montoReembolsado }) {
    this.idDevolucion = idDevolucion;
    this.idPedido = idPedido;
    this.motivo = motivo;
    this.fechaSolicitud = fechaSolicitud;
    this.estado = estado;
    this.montoReembolsado = montoReembolsado;
  }
}

module.exports = Devolucion;
