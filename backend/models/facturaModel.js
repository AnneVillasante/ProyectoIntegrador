/**
 * @fileoverview Modelo de clase para Factura.
 *
 * @version 1.0
 * @author Lunaria
 */

class Factura {
  constructor(idFactura, idPedido, fechaEmision, total, numeroFactura, urlDocumento) {
    this.idFactura = idFactura;
    this.idPedido = idPedido;
    this.fechaEmision = fechaEmision;
    this.total = total;
    this.numeroFactura = numeroFactura;
    this.urlDocumento = urlDocumento;
  }
}

module.exports = Factura;
