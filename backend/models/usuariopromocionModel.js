/**
 * @fileoverview Model class for UsuarioPromocion.
 * Represents the structure of a user-promotion link.
 *
 * @version 1.0
 * @author Lunaria
 */

class UsuarioPromocion {
  constructor({ idUsuario, idPromocion, estado, fechaUso }) {
    this.idUsuario = idUsuario;
    this.idPromocion = idPromocion;
    this.estado = estado;
    this.fechaUso = fechaUso;
  }
}

module.exports = UsuarioPromocion;