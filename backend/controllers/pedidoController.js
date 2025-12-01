// backend/controllers/pedidoController.js
const pedidoDAO = require('../dao/pedidoDAO');
const clienteService = require('../services/clienteService');
const pagoService = require('../services/pagoService');

exports.createOrder = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);

        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado para este usuario.' });
        }

        const idCliente = cliente.idCliente;
        const { items, total, metodoEntrega, direccionEntrega, metodoPago, paymentMethodId } = req.body;

        if (!items || items.length === 0 || !total || !metodoEntrega || !metodoPago) {
            return res.status(400).json({ error: 'Faltan datos para crear el pedido.' });
        }

        const pedidoData = {
            idCliente,
            items,
            total,
            metodoEntrega,
            direccionEntrega: metodoEntrega === 'delivery' ? direccionEntrega : null,
            metodoPago
        };

        // --- Lógica de Pago ---
        if (metodoPago === 'tarjeta') {
            if (!paymentMethodId) {
                return res.status(400).json({ error: 'Falta el ID del método de pago para la tarjeta.' });
            }

            // 1. Crear y confirmar la intención de pago en Stripe
            const montoEnCentimos = Math.round(total * 100); // Stripe usa la unidad mínima (céntimos)
            const paymentIntent = await pagoService.crearIntentoDePagoConConfirmacion(
                montoEnCentimos,
                'pen', // Moneda Soles Peruanos
                paymentMethodId,
                { idCliente: idCliente.toString() } // Metadata para Stripe
            );

            // 2. Manejar la respuesta de Stripe
            if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
                // Se necesita autenticación 3D Secure, el frontend se encargará
                return res.status(200).json({
                    requiresAction: true,
                    clientSecret: paymentIntent.client_secret
                });
            } else if (paymentIntent.status !== 'succeeded') {
                // El pago falló por otra razón (ej. fondos insuficientes)
                throw new Error('El pago con tarjeta falló. Por favor, verifica los datos de tu tarjeta.');
            }
            // Si el pago fue exitoso (succeeded), continuamos para crear el pedido
        }

        // --- Creación del Pedido en la Base de Datos (solo si el pago fue exitoso o no era con tarjeta) ---
        const nuevoPedido = await pedidoDAO.create(pedidoData);

        res.status(201).json({
            success: true,
            message: 'Pedido procesado exitosamente.',
            pedido: nuevoPedido
        });

    } catch (error) {
        console.error('Error al crear el pedido:', error);
        // Devuelve un mensaje de error más específico si viene de Stripe o de la base de datos
        res.status(500).json({ error: error.message || 'Error interno del servidor al crear el pedido.' });
    }
};