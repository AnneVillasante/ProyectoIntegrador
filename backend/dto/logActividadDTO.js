/**
 * @fileoverview Data Transfer Object for LogActividad.
 *
 * @version 1.0
 * @author Lunaria
 */

class LogActividadDTO {
  constructor({ idLog, idUsuario, accion, fechaHora, descripcion }) {
    this.idLog = idLog;
    this.idUsuario = idUsuario;
    this.accion = accion;
    this.fechaHora = fechaHora;
    this.descripcion = descripcion;
  }
}

module.exports = LogActividadDTO;