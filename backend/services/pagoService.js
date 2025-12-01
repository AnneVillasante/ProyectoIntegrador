require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pagoDAO = require('../dao/pagoDAO');
const PagoDTO = require('../dto/pagoDTO');

class PagoService {

    /**
     * Crea una intención de pago en Stripe.
     * @param {number} monto - El monto a cobrar (en la unidad mínima, ej. céntimos).
     * @param {string} moneda - La moneda en formato ISO (ej. 'pen', 'usd').
     * @param {object} metadata - Datos adicionales como idPedido, idUsuario.
     * @returns {object} El PaymentIntent de Stripe.
     */
    async crearIntentoDePago(monto, moneda, metadata = {}) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: monto,
                currency: moneda,
                metadata,
            });
            return paymentIntent;
        } catch (error) {
            console.error("Error al crear el intento de pago en Stripe:", error);
            throw new Error(`Stripe Error: ${error.message}`);
        }
    }

    /**
     * Confirma y guarda un pago después de que Stripe lo procesa.
     * @param {object} stripeEvent - El objeto de evento de Stripe (ej. payment_intent.succeeded).
     * @returns {PagoDTO} El DTO del pago guardado.
     */
    async confirmarYGuardarPago(stripeEvent) {
        if (stripeEvent.type === 'payment_intent.succeeded') {
            const paymentIntent = stripeEvent.data.object;

            const pagoData = new PagoDTO({
                monto: paymentIntent.amount, // Guardar en céntimos (INTEGER)
                metodoPago: 'Stripe',
                estadoTransaccion: 'succeeded',
                stripe_payment_intent_id: paymentIntent.id,
                idPedido: paymentIntent.metadata.idPedido,
                fechaPago: new Date(paymentIntent.created * 1000) // Stripe usa timestamps de Unix
            });

            return await pagoDAO.crearPago(PagoDTO.toModel(pagoData));
        }
        // Podrías manejar otros eventos como 'payment_intent.payment_failed'
        return null;
    }
}

module.exports = new PagoService();