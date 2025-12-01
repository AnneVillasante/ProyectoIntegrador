/**
 * @fileoverview Data Transfer Object para Campaña.
 *
 * @version 1.0
 * @author Lunaria
 */

class CampañaDTO {
  constructor({ idCampaña, titulo, imagen, descripcion, fechaInicio, fechaFin }) {
    this.id = idCampaña;
    this.titulo = titulo;
    this.imagen = imagen;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
  }
}

module.exports = CampañaDTO;