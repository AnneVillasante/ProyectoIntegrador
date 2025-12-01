const carritoService = require('../services/carritoService');
const clienteService = require('../services/clienteService'); // Importar el servicio de cliente

exports.getCart = async (req, res) => {
    try {
        const idUsuario = req.user.id; // Este es el idUsuario del token
        const cliente = await clienteService.getClientByUserId(idUsuario);

        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado para este usuario.' });
        }

        const idCliente = cliente.idCliente;
        const cart = await carritoService.getCart(idCliente);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al obtener el carrito.' });
    }
};

exports.addItemToCart = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);
        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado.' });
        }
        const idCliente = cliente.idCliente;

        const { idProducto, cantidad } = req.body;

        if (!idProducto || !cantidad) {
            return res.status(400).json({ error: 'idProducto y cantidad son requeridos.' });
        }

        const updatedCart = await carritoService.addItem(idCliente, idProducto, cantidad);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al agregar producto al carrito.' });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);
        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado.' });
        }
        const idCliente = cliente.idCliente;

        const { idProducto } = req.params; // idProducto en la URL
        const { cantidad } = req.body;

        if (cantidad === undefined || cantidad === null) { // Permite cantidad 0 para eliminar el ítem
            return res.status(400).json({ error: 'La cantidad es requerida.' });
        }

        const updatedCart = await carritoService.updateItem(idCliente, parseInt(idProducto), cantidad);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al actualizar la cantidad.' });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);
        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado.' });
        }
        const idCliente = cliente.idCliente;

        const { idProducto } = req.params; // idProducto en la URL

        const updatedCart = await carritoService.removeItem(idCliente, parseInt(idProducto));
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al eliminar producto del carrito.' });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const idUsuario = req.user.id;
        const cliente = await clienteService.getClientByUserId(idUsuario);
        if (!cliente) {
            return res.status(404).json({ error: 'Perfil de cliente no encontrado.' });
        }
        const idCliente = cliente.idCliente;

        const clearedCart = await carritoService.clearCart(idCliente);
        res.status(200).json(clearedCart);
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ error: error.message || 'Error interno del servidor al vaciar el carrito.' });
    }
};