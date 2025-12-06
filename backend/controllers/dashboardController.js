// backend/controllers/dashboardController.js
const db = require('../config/db');

// Función auxiliar para filtros de fecha (Reutilizada y mejorada)
const getDateClauses = (filter, fechaInicio, fechaFin, tableAlias = 'p', dateField = 'fecha') => {
    let whereClause = '';
    let groupBy = `DATE(${tableAlias}.${dateField})`;
    let selectDate = `DATE_FORMAT(${tableAlias}.${dateField}, '%d %b')`;
    const params = [];

    switch (filter) {
        case 'today':
            whereClause = `WHERE DATE(${tableAlias}.${dateField}) = CURDATE()`;
            groupBy = `HOUR(${tableAlias}.${dateField})`;
            selectDate = `CONCAT(HOUR(${tableAlias}.${dateField}), ':00')`;
            break;
        case 'week':
            whereClause = `WHERE YEARWEEK(${tableAlias}.${dateField}, 1) = YEARWEEK(CURDATE(), 1)`;
            break;
        case 'month':
            whereClause = `WHERE YEAR(${tableAlias}.${dateField}) = YEAR(CURDATE()) AND MONTH(${tableAlias}.${dateField}) = MONTH(CURDATE())`;
            break;
        case 'year':
            whereClause = `WHERE YEAR(${tableAlias}.${dateField}) = YEAR(CURDATE())`;
            groupBy = `MONTH(${tableAlias}.${dateField})`;
            selectDate = `DATE_FORMAT(${tableAlias}.${dateField}, '%b')`;
            break;
        case 'custom':
            if (fechaInicio && fechaFin) {
                whereClause = `WHERE DATE(${tableAlias}.${dateField}) BETWEEN ? AND ?`;
                params.push(fechaInicio, fechaFin);
            }
            break;
        case 'all':
        default:
            groupBy = `YEAR(${tableAlias}.${dateField})`;
            selectDate = `YEAR(${tableAlias}.${dateField})`;
            break;
    }
    return { whereClause, groupBy, selectDate, params };
};

exports.getMetrics = async (req, res) => {
    try {
        const { filter, fechaInicio, fechaFin } = req.query;
        
        // Configuramos cláusulas para la tabla PEDIDO (alias 'p')
        const { whereClause, groupBy, selectDate, params } = getDateClauses(filter, fechaInicio, fechaFin, 'p', 'fecha');
        
        // Configuramos cláusulas para la tabla CLIENTE (alias 'c') para métricas de registro
        const clienteDateClause = getDateClauses(filter, fechaInicio, fechaFin, 'c', 'fecha_registro');

        // Filtro base para pedidos completados (pagados o entregados)
        const baseWhere = whereClause.length > 0 ? `${whereClause} AND` : 'WHERE';
        const completedOrdersCondition = `(p.estado = "pagado" OR p.estado = "entregado")`;

        // --- EJECUCIÓN PARALELA DE CONSULTAS ---
        const [
            // A. MÉTRICAS DE VENTAS
            [ingresosRes],          // Total ingresos y conteo
            [pedidosPorEstadoRes],  // Estado de pedidos
            [ventasPorMetodoPago],  // Método de pago
            [ventasPorEntrega],     // Método de entrega
            [topProductosRes],      // Productos más vendidos
            [productosSinVentas],   // Productos que nadie ha comprado
            [chartDataRes],         // Gráfico de ventas lineal

            // B. MÉTRICAS DE CLIENTES
            [nuevosClientesRes],    // Nuevos clientes
            [topClientesRes],       // Clientes VIP (Más compras)
            [clientesRecurrentes],  // Clientes con > 1 compra

            // C. MARKETING (Requiere columna idCupon en pedido)
            [usoCuponesRes],        // Cupones más usados

            // D. CARRITO
            [carritoStats],         // Carritos activos vs abandonados
            [productosEnCarrito],   // Lo más añadido al carrito

            // E. LOGS
            [topAccionesRes],       // Acciones más frecuentes
            [loginsDiarios]         // Logins hoy
        ] = await Promise.all([
            // A.1 Resumen General
            db.query(`SELECT SUM(total) as totalIngresos, COUNT(*) as totalPedidos FROM pedido p ${baseWhere} ${completedOrdersCondition}`, params),
            
            // A.2 Pedidos por Estado
            db.query(`SELECT estado, COUNT(*) as count FROM pedido p ${whereClause} GROUP BY estado`, params),
            
            // A.3 Ventas por Método de Pago
            db.query(`SELECT metodoPago, COUNT(*) as count, SUM(total) as total FROM pedido p ${baseWhere} ${completedOrdersCondition} GROUP BY metodoPago`, params),
            
            // A.4 Ventas por Método de Entrega
            db.query(`SELECT metodoEntrega, COUNT(*) as count FROM pedido p ${baseWhere} ${completedOrdersCondition} GROUP BY metodoEntrega`, params),

            // A.5 Top Productos Vendidos
            db.query(`
                SELECT pr.nombre, SUM(dp.cantidad) as totalVendido, SUM(dp.subtotal) as ingresosGenerados
                FROM detallepedido dp
                JOIN producto pr ON dp.idProducto = pr.idProducto
                JOIN pedido p ON dp.idPedido = p.idPedido
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY pr.idProducto, pr.nombre
                ORDER BY totalVendido DESC LIMIT 5
            `, params),

            // A.6 Productos Sin Ventas (Inventario muerto)
            db.query(`
                SELECT nombre, stock, precio 
                FROM producto 
                WHERE idProducto NOT IN (SELECT DISTINCT idProducto FROM detallepedido)
                LIMIT 5
            `),

            // A.7 Gráfico Lineal de Ingresos
            db.query(`
                SELECT ${selectDate} as label, SUM(p.total) as value
                FROM pedido p
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY ${groupBy}, label
                ORDER BY MIN(p.fecha) ASC
            `, params),

            // B.1 Nuevos Clientes (Usamos params del filtro de cliente)
            db.query(`SELECT COUNT(*) as total FROM cliente c ${clienteDateClause.whereClause}`, clienteDateClause.params),

            // B.2 Top Clientes (LTV - Lifetime Value)
            db.query(`
                SELECT u.nombres, u.apellidos, COUNT(p.idPedido) as numeroPedidos, SUM(p.total) as totalGastado
                FROM pedido p
                JOIN cliente c ON p.idCliente = c.idCliente
                JOIN usuario u ON c.fk_idUsuario = u.idUsuario
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY u.idUsuario, u.nombres, u.apellidos
                ORDER BY totalGastado DESC LIMIT 5
            `, params),

            // B.3 Clientes Recurrentes (Más de 1 pedido histórico)
            db.query(`
                SELECT COUNT(*) as count FROM (
                    SELECT idCliente FROM pedido GROUP BY idCliente HAVING COUNT(idPedido) > 1
                ) as recurrentes
            `),

            // C.1 Uso de Cupones (Si agregaste la columna idCupon)
            db.query(`
                SELECT c.codigo, COUNT(p.idPedido) as usos, SUM(p.total) as ventasGeneradas
                FROM pedido p
                JOIN cupon c ON p.idCupon = c.idCupon
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY c.idCupon, c.codigo
                ORDER BY usos DESC LIMIT 5
            `, params),

            // D.1 Estadísticas de Carrito (Activos vs Posiblemente Abandonados > 24h)
            db.query(`
                SELECT 
                    COUNT(*) as totalCarritos,
                    SUM(CASE WHEN fechaActualizacion < DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as abandonados
                FROM carrito
            `),

            // D.2 Productos más añadidos al carrito (Intención de compra)
            db.query(`
                SELECT p.nombre, SUM(cd.cantidad) as cantidadEnCarritos
                FROM carritodetalle cd
                JOIN producto p ON cd.idProducto = p.idProducto
                GROUP BY p.idProducto, p.nombre
                ORDER BY cantidadEnCarritos DESC LIMIT 5
            `),

            // E.1 Logs - Top Acciones
            db.query(`SELECT accion, COUNT(*) as count FROM logactividad GROUP BY accion ORDER BY count DESC LIMIT 10`),

            // E.2 Logs - Logins Hoy
            db.query(`SELECT COUNT(*) as count FROM logactividad WHERE accion LIKE '%login%' AND DATE(fechaHora) = CURDATE()`)
        ]);

        // --- PROCESAMIENTO DE DATOS ---
        
        const ingresosTotal = ingresosRes[0].totalIngresos || 0;
        const totalPedidosPagados = ingresosRes[0].totalPedidos || 0;
        const ticketPromedio = totalPedidosPagados > 0 ? (ingresosTotal / totalPedidosPagados) : 0;

        // Construir respuesta JSON estructurada
        res.json({
            sales: {
                totalRevenue: parseFloat(ingresosTotal).toFixed(2),
                totalOrders: totalPedidosPagados,
                averageTicket: ticketPromedio.toFixed(2),
                chartData: {
                    labels: chartDataRes.map(item => item.label),
                    values: chartDataRes.map(item => item.value)
                },
                ordersByStatus: pedidosPorEstadoRes,
                salesByPaymentMethod: ventasPorMetodoPago,
                salesByDeliveryMethod: ventasPorEntrega,
                topSellingProducts: topProductosRes,
                deadStock: productosSinVentas
            },
            customers: {
                newCustomers: nuevosClientesRes[0].total,
                returningCustomersCount: clientesRecurrentes[0].count,
                topClientsLTV: topClientesRes // Clientes más valiosos
            },
            marketing: {
                topCoupons: usoCuponesRes,
                // Nota: Para "uso de promociones" requeriría lógica similar si se guardan en el pedido
            },
            cart: {
                totalActiveCarts: carritoStats[0].totalCarritos,
                abandonedCarts: carritoStats[0].abandonados, // Carritos sin mover en 24h
                mostAddedProducts: productosEnCarrito
            },
            logs: {
                topActions: topAccionesRes,
                loginsToday: loginsDiarios[0].count
            }
        });

    } catch (error) {
        console.error('Error obteniendo métricas avanzadas:', error);
        // Devolvemos estructura vacía segura en caso de error para no romper el frontend
        res.status(500).json({ 
            error: 'Error al cargar métricas', 
            details: error.message 
        });
    }
};