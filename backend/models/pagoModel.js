// backend/models/pagoModel.js

/**
 * Representa la estructura de un objeto de Pago.
 * No es un modelo de base de datos, solo una clase para estructurar datos.
 */
class Pago {
  constructor({ idPago, idPedido, metodoPago, monto, fechaPago, estadoTransaccion, stripe_payment_intent_id }) {
    this.idPago = idPago;
    this.idPedido = idPedido;
    this.metodoPago = metodoPago;
    this.monto = monto;
    this.fechaPago = fechaPago;
    this.estadoTransaccion = estadoTransaccion;
    this.stripe_payment_intent_id = stripe_payment_intent_id;
  }
}

module.exports = Pago;