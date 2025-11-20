const carritoModel = require('../models/carritoModel');
const productoDAO = require('./productoDAO'); // Necesario para verificar stock y precio del producto

class CarritoDAO {
    async getOrCreateCart(idCliente) {
        return carritoModel.getOrCreateCart(idCliente);
    }

    async getCartWithItems(idCliente) {
        const cart = await carritoModel.getOrCreateCart(idCliente);
        if (!cart) return null;

        const items = await carritoModel.getCartItems(cart.idCarrito);
        return { cart, items };
    }

    async addItemToCart(idCliente, idProducto, cantidad) {
        const cart = await carritoModel.getOrCreateCart(idCliente);
        const product = await productoDAO.getById(idProducto); // Asumiendo que productoDAO tiene un método getById

        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        if (product.stock < cantidad) {
            throw new Error('Cantidad solicitada excede el stock disponible.');
        }

        // Obtener el ítem existente en el carrito para verificar la cantidad total
        const existingCartItem = await carritoModel.getCartItemByProduct(cart.idCarrito, idProducto);
        const currentQuantityInCart = existingCartItem ? existingCartItem.cantidad : 0;

        if (product.stock < (currentQuantityInCart + cantidad)) {
             throw new Error(`No hay suficiente stock para agregar ${cantidad} unidades. Stock disponible: ${product.stock - currentQuantityInCart}`);
        }

        return carritoModel.addOrUpdateItem(cart.idCarrito, idProducto, cantidad, product.precio);
    }

    async updateCartItemQuantity(idCliente, idProducto, cantidad) {
        const cart = await carritoModel.getOrCreateCart(idCliente);
        const product = await productoDAO.getById(idProducto);

        if (!product) {
            throw new Error('Producto no encontrado.');
        }
        if (product.stock < cantidad) {
            throw new Error(`Cantidad solicitada excede el stock disponible. Stock: ${product.stock}`);
        }
        
        return carritoModel.updateItemQuantity(cart.idCarrito, idProducto, cantidad);
    }

    async removeItemFromCart(idCliente, idProducto) {
        const cart = await carritoModel.getOrCreateCart(idCliente);
        return carritoModel.removeItem(cart.idCarrito, idProducto);
    }

    async clearUserCart(idCliente) {
        const cart = await carritoModel.getOrCreateCart(idCliente);
        return carritoModel.clearCart(cart.idCarrito);
    }
}

module.exports = new CarritoDAO();