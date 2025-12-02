class PagoDTO {
    constructor({ idPago, monto, metodoPago, fechaPago, estadoTransaccion, stripe_payment_intent_id, idPedido }) {
        this.idPago = idPago;
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.fechaPago = fechaPago;
        this.estadoTransaccion = estadoTransaccion;
        this.stripe_payment_intent_id = stripe_payment_intent_id;
        this.idPedido = idPedido;
    }
}

module.exports = PagoDTO;