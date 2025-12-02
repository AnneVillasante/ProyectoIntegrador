// backend/controllers/pedidoController.js
const pedidoDAO = require('../dao/pedidoDAO');
const clienteService = require('../services/clienteService');

exports.getAllOrders = async (req, res) => {
    try {
        const pedidos = await pedidoDAO.findAll();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor al obtener los pedidos.' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);

        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado para este usuario.' });
        }

        const idCliente = cliente.idCliente;
        const { items, total, metodoEntrega, direccionEntrega, metodoPago } = req.body;

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

        const nuevoPedido = await pedidoDAO.create(pedidoData);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente.',
            pedido: nuevoPedido
        });

    } catch (error) {
        console.error('Error al crear el pedido:', error);
        if (error.message.includes('Stock insuficiente')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear el pedido.' });
    }
};