const pagoService = require('../services/pagoService');

const obtenerTodos = async (req, res) => {
    try {
        const pagos = await pagoService.obtenerTodos();
        res.status(200).json(pagos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pagos', error: error.message });
    }
};

const crearIntentoDePago = async (req, res) => {
    try {
        // El monto debe venir en la unidad principal (ej. soles)
        const { monto, moneda = 'pen', idPedido } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({ message: 'El monto debe ser un número positivo.' });
        }

        // Convertir a la unidad mínima de la moneda (céntimos)
        const montoEnCentimos = Math.round(monto * 100);

        const metadata = { idPedido, idUsuario };

        const paymentIntent = await pagoService.crearIntentoDePago(montoEnCentimos, moneda, metadata);

        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
    }
};

const stripeWebhook = async (req, res) => {
    // La validación de la firma del webhook es crucial para la seguridad,
    // pero se omite aquí por simplicidad. En producción, DEBES implementarla.
    const event = req.body;

    try {
        const pagoGuardado = await pagoService.confirmarYGuardarPago(event);

        if (pagoGuardado) {
            console.log('Pago confirmado y guardado:', pagoGuardado);
            // Aquí podrías emitir un evento, actualizar el estado del pedido, etc.
        }

        res.status(200).json({ received: true });
    } catch (error) {
        console.error("Error en el webhook de Stripe:", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

module.exports = {
    obtenerTodos,
    crearIntentoDePago,
    stripeWebhook,
};