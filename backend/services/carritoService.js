const carritoDAO = require('../dao/carritoDAO');
const { CarritoDTO } = require('../dto/carritoDTO');

class CarritoService {
    async getCart(idCliente) {
        const { cart, items } = await carritoDAO.getCartWithItems(idCliente);
        return new CarritoDTO(cart, items);
    }

    async addItem(idCliente, idProducto, cantidad) {
        if (cantidad <= 0) {
            throw new Error('La cantidad debe ser mayor que cero.');
        }
        await carritoDAO.addItemToCart(idCliente, idProducto, cantidad);
        return this.getCart(idCliente); // Devuelve el carrito actualizado
    }

    async updateItem(idCliente, idProducto, cantidad) {
        if (cantidad < 0) {
            throw new Error('La cantidad no puede ser negativa.');
        }
        if (cantidad === 0) {
            await carritoDAO.removeItemFromCart(idCliente, idProducto);
        } else {
            await carritoDAO.updateCartItemQuantity(idCliente, idProducto, cantidad);
        }
        return this.getCart(idCliente); // Devuelve el carrito actualizado
    }

    async removeItem(idCliente, idProducto) {
        await carritoDAO.removeItemFromCart(idCliente, idProducto);
        return this.getCart(idCliente); // Devuelve el carrito actualizado
    }

    async clearCart(idCliente) {
        await carritoDAO.clearUserCart(idCliente);
        return this.getCart(idCliente); // Devuelve un carrito vacío
    }
}

module.exports = new CarritoService();