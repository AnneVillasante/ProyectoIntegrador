const pagoService = require('../services/pagoService');
const db = require('../config/db');
// Se importa el servicio de renderizado de jsreport
const getJsreportRenderer = (req) => require('../services/jsreportService')(req.app.get('jsreport'));

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

        const idUsuario = req.user.id; // Obtenerlo del token
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
            // --- GENERACIÓN DE BOLETA PDF ---
            try {
                const { idPedido } = event.data.object.metadata;
                if (idPedido) {
                    const render = getJsreportRenderer(req);

                    // 1. Obtener datos completos del pedido y cliente
                    const [pedido] = await db.query(`
                        SELECT p.idPedido, p.fecha, p.total, p.subtotal, p.impuestos,
                               u.nombres, u.apellidos, u.dni, u.correo
                        FROM pedido p
                        JOIN cliente c ON p.idCliente = c.idCliente
                        JOIN usuario u ON c.fk_idUsuario = u.idUsuario
                        WHERE p.idPedido = ?
                    `, [idPedido]);

                    const [detalles] = await db.query(`
                        SELECT pr.nombre, dp.cantidad, dp.precioUnitario
                        FROM detallepedido dp
                        JOIN producto pr ON dp.idProducto = pr.idProducto
                        WHERE dp.idPedido = ?
                    `, [idPedido]);

                    // 2. Preparar datos para la plantilla 'boleta'
                    const boletaData = {
                        numeroPedido: pedido[0].idPedido,
                        fecha: pedido[0].fecha,
                        clienteNombre: `${pedido[0].nombres} ${pedido[0].apellidos}`,
                        clienteDocumento: pedido[0].dni,
                        clienteCorreo: pedido[0].correo,
                        items: detalles.map(item => ({
                            nombre: item.nombre,
                            cantidad: item.cantidad,
                            precioUnitario: parseFloat(item.precioUnitario).toFixed(2),
                            subtotal: (item.cantidad * item.precioUnitario).toFixed(2)
                        })),
                        subtotalVenta: parseFloat(pedido[0].subtotal).toFixed(2),
                        impuestos: parseFloat(pedido[0].impuestos).toFixed(2),
                        totalVenta: parseFloat(pedido[0].total).toFixed(2)
                    };

                    // 3. Renderizar el PDF
                    const pdfBuffer = await render('boleta', boletaData);
                    console.log(`Boleta para pedido ${idPedido} generada.`);

                    // TODO: Implementar servicio de envío de correo y adjuntar el `pdfBuffer.content`
                    // await emailService.sendInvoice(boletaData.clienteCorreo, pdfBuffer.content);
                }
            } catch (pdfError) {
                console.error(`Error generando boleta PDF para el pedido:`, pdfError);
            }
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