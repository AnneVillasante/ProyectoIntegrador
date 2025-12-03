/**
 * @fileoverview Data Transfer Object para Campana.
 *
 * @version 1.0
 * @author Lunaria
 */

class CampanaDTO {
  constructor({ idCampana, titulo, imagen, descripcion, fechaInicio, fechaFin }) {
    this.id = idCampana;
    this.titulo = titulo;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}

module.exports = CampanaDTO;