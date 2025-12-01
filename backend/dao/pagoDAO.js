const Pago = require('../models/pagoModel');
const PagoDTO = require('../dto/pagoDTO');

class PagoDAO {
    async crearPago(pagoData) {
        try {
            const pago = await Pago.create(pagoData);
            return new PagoDTO(pago);
        } catch (error) {
            throw new Error(`Error al crear el pago en la base de datos: ${error.message}`);
        }
    }

    async obtenerPagoPorIntentId(intentId) {
        const pago = await Pago.findOne({ where: { stripe_payment_intent_id: intentId } });
        return pago ? PagoDTO.fromModel(pago) : null;
    }
}

module.exports = new PagoDAO();