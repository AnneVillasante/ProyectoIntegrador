const carritoService = require('../services/carritoService');
const clienteService = require('../services/clienteService');
const logger = require('../config/logger');

/**
 * Middleware para determinar el identificador del carrito.
 * Un carrito puede pertenecer a un cliente (personal) o a un vendedor (venta física).
 */
const getCartIdentifier = async (req) => {
    const idUsuario = req.user.id;
    const userRole = req.user.rol; // 'Administrador' o 'Cliente'
    const cartType = req.query.type || 'personal'; // 'personal' o 'venta'. Por defecto 'personal'.

    if (cartType === 'venta' && (userRole === 'Administrador' || userRole === 'Vendedor')) {
        // Carrito de venta física, identificado por el ID del vendedor (admin)
        return { idVendedor: idUsuario };
    }

    // Carrito personal, identificado por el ID del cliente
    const cliente = await clienteService.getClientByUserId(idUsuario);
    if (!cliente) throw new Error('Perfil de cliente no encontrado para este usuario.');
    return { idCliente: cliente.idCliente };
};

exports.getCart = async (req, res) => {
    try {
        const identifier = await getCartIdentifier(req);
        const cart = await carritoService.getCart(identifier);
        res.status(200).json(cart);
    } catch (error) {
        logger.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al obtener el carrito.' });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        const identifier = await getCartIdentifier(req);
        const { idProducto, cantidad } = req.body;

        if (!idProducto || !cantidad) {
            return res.status(400).json({ error: 'idProducto y cantidad son requeridos.' });
        }

        const updatedCart = await carritoService.addItem(identifier, idProducto, cantidad);
        res.status(200).json(updatedCart);
    } catch (error) {
        logger.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al agregar producto al carrito.' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const identifier = await getCartIdentifier(req);

        const { idProducto } = req.params; // idProducto en la URL
        const { cantidad } = req.body;

        if (cantidad === undefined || cantidad === null) { // Permite cantidad 0 para eliminar el ítem
            return res.status(400).json({ error: 'La cantidad es requerida.' });
        }

        const updatedCart = await carritoService.updateItem(identifier, parseInt(idProducto), cantidad);
        res.status(200).json(updatedCart);
    } catch (error) {
        logger.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al actualizar la cantidad.' });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const identifier = await getCartIdentifier(req);

        const { idProducto } = req.params; // idProducto en la URL

        const updatedCart = await carritoService.removeItem(identifier, parseInt(idProducto));
        res.status(200).json(updatedCart);
    } catch (error) {
        logger.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al eliminar producto del carrito.' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const identifier = await getCartIdentifier(req);
        const clearedCart = await carritoService.clearCart(identifier);
        res.status(200).json(clearedCart);
    } catch (error) {
        logger.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al vaciar el carrito.' });
    }
};