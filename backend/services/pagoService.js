require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pagoDAO = require('../dao/pagoDAO');
const PagoDTO = require('../dto/pagoDTO');
const logger = require('../config/logger');

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
            logger.error("Error al crear el intento de pago en Stripe:", error);
            throw new Error(`Stripe Error: ${error.message}`);
        }
    }

    /**
     * Crea y confirma una intención de pago en un solo paso.
     * @param {number} monto - El monto a cobrar (en céntimos).
     * @param {string} moneda - La moneda ('pen', 'usd').
     * @param {string} paymentMethodId - El ID del método de pago creado en el frontend.
     * @param {object} metadata - Datos adicionales.
     * @returns {object} El PaymentIntent de Stripe.
     */
    async crearIntentoDePagoConConfirmacion(monto, moneda, paymentMethodId, metadata = {}) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: monto,
                currency: moneda,
                payment_method: paymentMethodId,
                confirm: true, // Intenta confirmar el pago inmediatamente
                metadata,
            });
            return paymentIntent;
        } catch (error) {
            logger.error("Error al crear y confirmar el intento de pago en Stripe:", error);
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

            return await pagoDAO.crearPago(pagoData);
        }
        // Podrías manejar otros eventos como 'payment_intent.payment_failed'
        return null;
    }

    /**
     * Obtiene todos los pagos registrados en la base de datos.
     * @returns {Promise<PagoDTO[]>} Una lista de pagos.
     */
    async obtenerTodos() {
        // Llama al método correspondiente en la capa de acceso a datos (DAO).
        return await pagoDAO.findAll();
    }
}

module.exports = new PagoService();