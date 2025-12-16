const pool = require('../config/db');
const PagoDTO = require('../dto/pagoDTO');

class PagoDAO {
    async crearPago(pagoData) {
        try {
            const { idPedido, metodoPago, monto, fechaPago, estadoTransaccion, stripe_payment_intent_id } = pagoData;
            
            const sql = `
                INSERT INTO pago (idPedido, metodoPago, monto, fechaPago, estadoTransaccion, stripe_payment_intent_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const [result] = await pool.query(sql, [
                idPedido,
                metodoPago,
                monto,
                fechaPago,
                estadoTransaccion,
                stripe_payment_intent_id
            ]);

            // Devolvemos un DTO con el ID del pago recién creado
            return new PagoDTO({ ...pagoData, idPago: result.insertId });
        } catch (error) {
            throw new Error(`Error al crear el pago en la base de datos: ${error.message}`);
        }
    }

    async obtenerPagoPorIntentId(intentId) {
        try {
            const sql = 'SELECT * FROM pago WHERE stripe_payment_intent_id = ?';
            const [rows] = await pool.query(sql, [intentId]);
            
            if (rows.length === 0) return null;
            
            return new PagoDTO(rows[0]);
        } catch (error) {
            throw new Error(`Error al obtener el pago por Intent ID: ${error.message}`);
        }
    }

    async findAll() {
        try {
            const sql = 'SELECT * FROM pago ORDER BY fechaPago DESC';
            const [rows] = await pool.query(sql);
            // Mapeamos cada resultado a un DTO para mantener la consistencia
            return rows.map(row => new PagoDTO(row));
        } catch (error) {
            throw new Error(`Error al obtener todos los pagos: ${error.message}`);
        }
    }
}

module.exports = new PagoDAO();