/**
 * @fileoverview Model class for Campaña.
 * Represents the structure of a campaign object.
 *
 * @version 1.0
 * @author Lunaria
 */

class Campaña {
  constructor({ idCampaña, titulo, imagen, descripcion, fechaInicio, fechaFin }) {
    this.idCampaña = idCampaña;
    this.titulo = titulo;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}

module.exports = Campaña;