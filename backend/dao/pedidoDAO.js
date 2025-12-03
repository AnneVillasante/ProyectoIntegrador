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

    async findAll() {
        try {
            // Se hace un JOIN con las tablas cliente y usuario para obtener el nombre y correo del cliente.
            const sql = `
                SELECT 
                    p.idPedido, p.fecha, p.total, p.estado,
                    c.idCliente, c.nombres, c.apellidos,
                    u.correo
                FROM pedido p
                JOIN cliente c ON p.idCliente = c.idCliente
                JOIN usuario u ON c.idUsuario = u.idUsuario
                ORDER BY p.fecha DESC
            `;
            const [rows] = await db.query(sql);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener los pedidos: ${error.message}`);
        }
    }
}

module.exports = new PedidoDAO();
