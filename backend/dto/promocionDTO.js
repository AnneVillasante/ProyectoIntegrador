/**
 * @fileoverview Data Transfer Object for Promocion.
 *
 * @version 1.0
 * @author Lunaria
 */

class PromocionDTO {
  constructor({
    idPromocion,
    titulo,
    descripcion,
    fechaInicio,
    fechaFin,
    idCampaña,
    tipoDescuento,
    valorDescuento,
    montoMinimoCompra,
    activo,
    idCategoriaAplicable,
  }) {
    this.idPromocion = idPromocion;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.idCampaña = idCampaña;
    this.tipoDescuento = tipoDescuento;
    this.valorDescuento = valorDescuento;
    this.montoMinimoCompra = montoMinimoCompra;
    this.activo = activo;
    this.idCategoriaAplicable = idCategoriaAplicable;
  }
}

module.exports = PromocionDTO;