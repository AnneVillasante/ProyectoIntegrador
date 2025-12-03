// backend/controllers/pedidoController.js
const pedidoDAO = require('../dao/pedidoDAO');
const clienteService = require('../services/clienteService');
const clienteDAO = require('../dao/clienteDAO'); // Asegúrate de importar esto si usas búsqueda directa

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
        const idUsuarioLogueado = req.user.id;
        const rolUsuario = req.user.rol; // Asumiendo que el token trae el rol
        
        // ---------------------------------------------------------
        // 1. LÓGICA PARA DETERMINAR EL CLIENTE DEL PEDIDO
        // ---------------------------------------------------------
        let idClienteFinal = null;

        // CASO A: Es Administrador y quiere asignar la venta a otro cliente (por correo)
        if (rolUsuario === 'Administrador' && req.body.correoCliente) {
            // Buscamos al cliente por su correo
            // Nota: Asegúrate de tener este método en tu DAO, o usa una query directa
            const clienteDestino = await clienteDAO.findByCorreo(req.body.correoCliente);
            
            if (!clienteDestino) {
                return res.status(404).json({ error: `No se encontró ningún cliente registrado con el correo: ${req.body.correoCliente}` });
            }
            idClienteFinal = clienteDestino.idCliente;
            
        } 
        // CASO B: Flujo normal (Cliente comprando para sí mismo o Admin comprando para su perfil personal)
        else {
            const clientePerfil = await clienteService.getClientByUserId(idUsuarioLogueado);
            if (!clientePerfil) {
                return res.status(404).json({ error: 'Perfil de cliente no encontrado para este usuario.' });
            }
            idClienteFinal = clientePerfil.idCliente;
        }

        // ---------------------------------------------------------
        // 2. CREACIÓN DEL PEDIDO (Resto del código igual)
        // ---------------------------------------------------------
        const { items, total, metodoEntrega, direccionEntrega, metodoPago } = req.body;

        if (!items || items.length === 0 || !total || !metodoEntrega || !metodoPago) {
            return res.status(400).json({ error: 'Faltan datos para crear el pedido.' });
        }

        const pedidoData = {
            idCliente: idClienteFinal, // <--- USAMOS EL ID CALCULADO ARRIBA
            items,
            total,
            metodoEntrega,
            direccionEntrega: metodoEntrega === 'delivery' ? direccionEntrega : null,
            metodoPago
        };

        const nuevoPedido = await pedidoDAO.create(pedidoData);

        // AQUI PODRÍAS AGREGAR EL ENVÍO DE CORREO SI LO DESEAS
        // enviarCorreoConfirmacion(req.body.correoCliente || correoDelUsuario, nuevoPedido);

        res.status(201).json({
            success: true,
            message: 'Pedido creado exitosamente.',
            pedido: nuevoPedido
        });

    } catch (error) {
        console.error('Error al crear el pedido:', error);
        if (error.message && error.message.includes('Stock insuficiente')) {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Error interno del servidor al crear el pedido.' });
    }
};