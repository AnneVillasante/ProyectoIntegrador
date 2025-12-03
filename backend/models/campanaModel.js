/**
 * @fileoverview Model class for Campana.
 * Represents the structure of a campaign object.
 *
 * @version 1.0
 * @author Lunaria
 */

class Campana {
  constructor({ idCampana, titulo, imagen, descripcion, fechaInicio, fechaFin }) {
    this.idCampana = idCampana;
    this.titulo = titulo;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}

module.exports = Campana;