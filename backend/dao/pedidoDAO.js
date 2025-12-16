// backend/dao/pedidoDAO.js
const pool = require('../config/db');
const carritoDAO = require('./carritoDAO');
const logger = require('../config/logger');

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
            logger.error("Error en la transacción de creación de pedido:", error);
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
                    p.idPedido,
                    p.fecha,
                    p.total,
                    p.estado,
                    p.metodoPago,
                    c.idCliente,
                    c.nombres,
                    c.apellidos
                FROM pedido p
                LEFT JOIN cliente c ON p.idCliente = c.idCliente
                ORDER BY p.fecha DESC
            `;
            const [rows] = await pool.query(sql);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener los pedidos: ${error.message}`);
        }
    }
// ... (código anterior create y findAll)

    // ✅ NUEVO: Obtener pedido por ID con sus detalles
    async findById(idPedido) {
        const sql = `
            SELECT p.*, c.nombres, c.apellidos, c.correo, c.dni, c.telefono
            FROM pedido p
            JOIN cliente c ON p.idCliente = c.idCliente
            WHERE p.idPedido = ?
        `;
        const [rows] = await pool.query(sql, [idPedido]);
        
        if (rows.length === 0) return null;
        
        const pedido = rows[0];

        // Obtener los productos del pedido
        const [detalles] = await pool.query(`
            SELECT dp.*, pr.nombre as nombreProducto, pr.imagen
            FROM detallepedido dp
            JOIN producto pr ON dp.idProducto = pr.idProducto
            WHERE dp.idPedido = ?
        `, [idPedido]);

        pedido.items = detalles;
        return pedido;
    }

    // ✅ NUEVO: Actualizar estado del pedido
    async updateStatus(idPedido, estado) {
        const sql = 'UPDATE pedido SET estado = ? WHERE idPedido = ?';
        const [result] = await pool.query(sql, [estado, idPedido]);
        return result.affectedRows > 0;
    }

    // ✅ NUEVO: Eliminar pedido (Cuidado: esto elimina historial)
    async delete(idPedido) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            // Primero eliminar detalles por la FK
            await connection.query('DELETE FROM detallepedido WHERE idPedido = ?', [idPedido]);
            // Luego eliminar pagos asociados si existen (opcional, depende de tu lógica)
            await connection.query('DELETE FROM pago WHERE idPedido = ?', [idPedido]);
            // Finalmente eliminar el pedido
            const [result] = await connection.query('DELETE FROM pedido WHERE idPedido = ?', [idPedido]);
            await connection.commit();
            return result.affectedRows > 0;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}
// ...
module.exports = new PedidoDAO();
