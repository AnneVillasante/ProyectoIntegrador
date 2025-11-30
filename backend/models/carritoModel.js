const pool = require('../config/db');

class CarritoModel {
    // --- Operaciones del Carrito (Cabecera) ---

    async getOrCreateCart(idCliente) {
        let [cart] = await pool.query('SELECT * FROM carrito WHERE idCliente = ?', [idCliente]);
        if (cart.length > 0) {
            return cart[0];
        } else {
            const [result] = await pool.query('INSERT INTO carrito (idCliente) VALUES (?)', [idCliente]);
            return { idCarrito: result.insertId, idCliente, fechaCreacion: new Date(), fechaActualizacion: new Date() };
        }
    }

    async getCartById(idCarrito) {
        const [cart] = await pool.query('SELECT * FROM carrito WHERE idCarrito = ?', [idCarrito]);
        return cart[0];
    }

    async clearCart(idCarrito) {
        await pool.query('DELETE FROM carritodetalle WHERE idCarrito = ?', [idCarrito]);
    }

    // --- Operaciones de Ítems del Carrito ---

    async getCartItems(idCarrito) {
        const [items] = await pool.query(`
            SELECT 
                ci.idDetalleCarrito, 
                ci.idProducto,
                p.nombre AS nombreProducto,
                p.imagen AS imagenProducto, -- Asumiendo que tienes una columna 'imagen' en tu tabla 'producto'
                ci.cantidad,
                ci.precioUnitario,
                ci.subtotal
            FROM carritodetalle ci
            JOIN producto p ON ci.idProducto = p.idProducto
            WHERE ci.idCarrito = ?
        `, [idCarrito]);
        return items;
    }

    async getCartItemByProduct(idCarrito, idProducto) {
        const [item] = await pool.query('SELECT * FROM carritodetalle WHERE idCarrito = ? AND idProducto = ?', [idCarrito, idProducto]);
        return item[0];
    }

    async addOrUpdateItem(idCarrito, idProducto, cantidad, precioUnitario) {
        const existingItem = await this.getCartItemByProduct(idCarrito, idProducto);

        const subtotal = parseFloat(cantidad) * parseFloat(precioUnitario);

        if (existingItem) {
            // Actualizar cantidad y precio unitario (por si ha cambiado)
            const newQuantity = existingItem.cantidad + cantidad;
            const newSubtotal = newQuantity * parseFloat(precioUnitario);
            await pool.query('UPDATE carritodetalle SET cantidad = ?, precioUnitario = ?, subtotal = ? WHERE idDetalleCarrito = ?', [newQuantity, precioUnitario, newSubtotal, existingItem.idDetalleCarrito]);
            return { idDetalleCarrito: existingItem.idDetalleCarrito, idProducto, cantidad: newQuantity, precioUnitario };
        } else {
            // Añadir nuevo ítem
            const [result] = await pool.query(
                'INSERT INTO carritodetalle (idCarrito, idProducto, cantidad, precioUnitario, subtotal) VALUES (?, ?, ?, ?, ?)', 
                [idCarrito, idProducto, cantidad, precioUnitario, subtotal]
            );
            return { idDetalleCarrito: result.insertId, idProducto, cantidad, precioUnitario };
        }
    }

    async updateItemQuantity(idCarrito, idProducto, cantidad) {
        if (cantidad <= 0) {
            // Si la cantidad es 0 o menos, eliminar el ítem
            return this.removeItem(idCarrito, idProducto);
        }
        // También actualizamos el subtotal al cambiar la cantidad
        const [item] = await pool.query('SELECT precioUnitario FROM carritodetalle WHERE idCarrito = ? AND idProducto = ?', [idCarrito, idProducto]);
        const [result] = await pool.query('UPDATE carritodetalle SET cantidad = ?, subtotal = ? WHERE idCarrito = ? AND idProducto = ?', [cantidad, cantidad * item[0].precioUnitario, idCarrito, idProducto]);
        return result.affectedRows > 0;
    }

    async removeItem(idCarrito, idProducto) {
        const [result] = await pool.query('DELETE FROM carritodetalle WHERE idCarrito = ? AND idProducto = ?', [idCarrito, idProducto]);
        return result.affectedRows > 0;
    }
}

module.exports = new CarritoModel();