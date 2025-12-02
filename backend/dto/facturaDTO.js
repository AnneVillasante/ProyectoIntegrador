/**
 * @fileoverview Data Transfer Object para Factura.
 *
 * @version 1.0
 * @author Lunaria
 */

class FacturaDTO {
  constructor({ idFactura, idPedido, fechaEmision, total, numeroFactura, urlDocumento }) {
    this.id = idFactura;
    this.idPedido = idPedido;
    this.fechaEmision = fechaEmision;
    this.total = parseFloat(total);
    this.numeroFactura = numeroFactura;
    this.urlDocumento = urlDocumento;
  }
}

module.exports = FacturaDTO;
