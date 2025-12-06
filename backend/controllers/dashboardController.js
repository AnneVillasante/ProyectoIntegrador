// backend/controllers/dashboardController.js
const db = require('../config/db'); // Asumo que usas este pool para consultas directas

const getDateClauses = (filter, fechaInicio, fechaFin) => {
    let whereClause = '';
    let groupBy = `DATE(p.fecha)`;
    let selectDate = `DATE_FORMAT(p.fecha, '%d %b')`; // Formato por defecto: '01 Jan'
    const params = [];

    switch (filter) {
        case 'today':
            whereClause = 'WHERE DATE(p.fecha) = CURDATE()';
            groupBy = `HOUR(p.fecha)`;
            selectDate = `CONCAT(HOUR(p.fecha), ':00')`;
            break;
        case 'week':
            whereClause = 'WHERE YEARWEEK(p.fecha, 1) = YEARWEEK(CURDATE(), 1)';
            break;
        case 'month':
            whereClause = 'WHERE YEAR(p.fecha) = YEAR(CURDATE()) AND MONTH(p.fecha) = MONTH(CURDATE())';
            break;
        case 'year':
            whereClause = 'WHERE YEAR(p.fecha) = YEAR(CURDATE())';
            groupBy = `MONTH(p.fecha)`;
            selectDate = `DATE_FORMAT(p.fecha, '%b')`; // Formato: 'Jan', 'Feb', etc.
            break;
        case 'custom':
            if (fechaInicio && fechaFin) {
                whereClause = 'WHERE DATE(p.fecha) BETWEEN ? AND ?';
                params.push(fechaInicio, fechaFin);
                
                // Decidir el agrupamiento basado en el rango
                const start = new Date(fechaInicio);
                const end = new Date(fechaFin);
                const diffDays = (end - start) / (1000 * 60 * 60 * 24);
                if (diffDays > 60) { // Si el rango es mayor a 2 meses, agrupar por mes
                    groupBy = `MONTH(p.fecha)`;
                    selectDate = `DATE_FORMAT(p.fecha, '%b %Y')`;
                }
            }
            break;
        case 'all':
        default:
            groupBy = `YEAR(p.fecha)`;
            selectDate = `YEAR(p.fecha)`;
            break;
    }
    return { whereClause, groupBy, selectDate, params };
};

exports.getMetrics = async (req, res) => {
    try {
        const { filter, fechaInicio, fechaFin } = req.query;
        const { whereClause, groupBy, selectDate, params } = getDateClauses(filter, fechaInicio, fechaFin);

        // 1. Consultas de resumen (tarjetas)
        const summaryPromises = [
            db.query('SELECT COUNT(*) as total FROM usuario'), // Total Usuarios
            db.query('SELECT COUNT(*) as total FROM producto'), // Total Productos
            db.query(`SELECT COUNT(*) as total FROM pedido p ${whereClause}`, params), // Total Pedidos (filtrado)
            db.query(`SELECT SUM(total) as total, COUNT(p.idPedido) as count FROM pedido p ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")`, params), // Ingresos y conteo de pedidos pagados (filtrado)
            db.query(`SELECT estado, COUNT(*) as count FROM pedido p ${whereClause} GROUP BY estado`, params), // Pedidos por estado
            db.query(`
                SELECT pr.nombre, SUM(dp.cantidad) as totalVendido
                FROM detallepedido dp
                JOIN producto pr ON dp.idProducto = pr.idProducto
                JOIN pedido p ON dp.idPedido = p.idPedido
                ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")
                GROUP BY pr.idProducto, pr.nombre
                ORDER BY totalVendido DESC
                LIMIT 5
            `, params), // Top 5 productos más vendidos - CORREGIDO: Se añaden los params
            db.query('SELECT nombre, stock FROM producto WHERE stock <= 5 ORDER BY stock ASC LIMIT 5'), // Productos con bajo stock
            db.query(`
                SELECT u.nombres, u.apellidos, SUM(p.total) as totalComprado
                FROM pedido p
                JOIN cliente c ON p.idCliente = c.idCliente
                JOIN usuario u ON c.fk_idUsuario = u.idUsuario
                ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")
                GROUP BY u.idUsuario, u.nombres, u.apellidos
                ORDER BY totalComprado DESC
                LIMIT 5
            `, params) // Top 5 clientes - CORREGIDO: Se añaden los params
        ];

        const [
            [usuariosRes],
            [productosRes],
            [pedidosRes],
            [ingresosRes],
            [pedidosPorEstadoRes],
            [topProductosRes],
            [bajoStockRes],
            [topClientesRes]
        ] = await Promise.all(summaryPromises);

        const ingresos = ingresosRes[0].total || 0;
        const pedidosPagadosCount = ingresosRes[0].count || 0;

        // 2. Consulta para el gráfico de ingresos
        const chartQuery = `
            SELECT 
                ${selectDate} as label,
                SUM(p.total) as value
            FROM pedido p
            ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")
            GROUP BY ${groupBy}, label
            ORDER BY MIN(p.fecha) ASC 
        `;
        const [chartDataRes] = await db.query(chartQuery, params);

        // Formatear datos para Chart.js
        const chartData = {
            labels: chartDataRes.map(item => item.label),
            values: chartDataRes.map(item => item.value)
        };

        res.json({
            summary: {
                usuarios: usuariosRes[0].total,
                productos: productosRes[0].total,
                pedidos: pedidosRes[0].total,
                ingresos: parseFloat(ingresos).toFixed(2),
                ticketPromedio: (pedidosPagadosCount > 0 ? (ingresos / pedidosPagadosCount) : 0).toFixed(2)
            },
            chartData: chartData,
            details: {
                pedidosPorEstado: pedidosPorEstadoRes.reduce((acc, item) => {
                    acc[item.estado] = item.count;
                    return acc;
                }, {}),
                topProductos: topProductosRes,
                productosBajoStock: bajoStockRes,
                topClientes: topClientesRes
            }
        });

    } catch (error) {
        console.error('Error obteniendo métricas:', error);
        res.status(500).json({ error: 'Error al cargar métricas' });
    }
};