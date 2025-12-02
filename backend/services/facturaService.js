/**
 * @fileoverview Lógica de negocio para facturas.
 *
 * @version 1.0
 * @author Lunaria
 */

const facturaDAO = require('../dao/facturaDAO');
const FacturaDTO = require('../dto/facturaDTO');

class FacturaService {
  static async obtenerTodas() {
    const facturas = await facturaDAO.obtenerTodas();
    return facturas.map(factura => new FacturaDTO(factura));
  }

  static async obtenerPorId(id) {
    const factura = await facturaDAO.obtenerPorId(id);
    if (!factura) {
      return null;
    }
    return new FacturaDTO(factura);
  }

  static async generarFactura(data) {
    const { idPedido, total, numeroFactura, urlDocumento } = data;

    if (!idPedido || total === undefined) {
      throw new Error('El ID del pedido y el total son requeridos.');
    }

    const idFactura = await facturaDAO.crear({
      idPedido,
      total,
      numeroFactura,
      urlDocumento,
    });

    const nuevaFactura = await facturaDAO.obtenerPorId(idFactura);
    return new FacturaDTO(nuevaFactura);
  }

  static async eliminar(id) {
    const affectedRows = await facturaDAO.eliminar(id);
    return affectedRows > 0;
  }
}

module.exports = FacturaService;
