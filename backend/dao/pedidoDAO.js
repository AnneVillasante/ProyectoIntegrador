// backend/dao/pedidoDAO.js
const db = require('../config/db');
const carritoDAO = require('./carritoDAO');

class PedidoDAO {
    async create(pedidoData) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Verificar stock de todos los productos antes de cualquier inserción
            for (const item of pedidoData.items) {
                const [rows] = await connection.query('SELECT stock FROM producto WHERE idProducto = ?', [item.idProducto]);
                if (rows.length === 0 || rows[0].stock < item.cantidad) {
                    throw new Error(`Stock insuficiente para el producto ID ${item.idProducto}.`);
                }
            }

            // 2. Insertar en la tabla `pedido`
            const pedidoSql = 'INSERT INTO pedido (idCliente, fecha, total, estado, metodoEntrega, direccionEntrega, metodoPago) VALUES (?, NOW(), ?, ?, ?, ?, ?)';
            const [pedidoResult] = await connection.query(pedidoSql, [
                pedidoData.idCliente,
                pedidoData.total,
                'Procesando', // Estado inicial
                pedidoData.metodoEntrega,
                pedidoData.direccionEntrega,
                pedidoData.metodoPago
            ]);
            const idPedido = pedidoResult.insertId;

            // 3. Insertar en `detallepedido` y actualizar stock
            const detalleSql = 'INSERT INTO detallepedido (idPedido, idProducto, cantidad, precioUnitario, subtotal) VALUES (?, ?, ?, ?, ?)';
            const updateStockSql = 'UPDATE producto SET stock = stock - ? WHERE idProducto = ?';

            for (const item of pedidoData.items) {
                const subtotal = item.cantidad * item.precioUnitario;
                await connection.query(detalleSql, [idPedido, item.idProducto, item.cantidad, item.precioUnitario, subtotal]);
                await connection.query(updateStockSql, [item.cantidad, item.idProducto]);
            }

            // 4. Limpiar el carrito del usuario
            await carritoDAO.clearUserCart(pedidoData.idCliente);

            await connection.commit();

            return { idPedido, ...pedidoData };

        } catch (error) {
            await connection.rollback();
            console.error("Error en la transacción de creación de pedido:", error);
            throw error; // Re-lanzar para que el controlador lo maneje
        } finally {
            connection.release();
        }
    }
}

module.exports = new PedidoDAO();
