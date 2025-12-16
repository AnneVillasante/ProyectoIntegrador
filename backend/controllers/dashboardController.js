// backend/controllers/dashboardController.js
const pool = require('../config/db');
const logger = require('../config/logger');

// Función auxiliar para filtros de fecha
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
        
        // Cláusulas para Pedidos
        const { whereClause, groupBy, selectDate, params } = getDateClauses(filter, fechaInicio, fechaFin, 'p', 'fecha');
        
        // Cláusula para "Nuevos Clientes" (filtro temporal)
        const clienteDateClause = getDateClauses(filter, fechaInicio, fechaFin, 'c', 'fecha_registro');

        const baseWhere = whereClause.length > 0 ? `${whereClause} AND` : 'WHERE';
        const completedOrdersCondition = `(p.estado = "pagado" OR p.estado = "entregado")`;

        const [
            [resumenIngresosRows],      // Ingresos y pedidos filtrados
            [totalUsuariosRows],        // Total histórico usuarios
            [totalProductosRows],       // Total histórico productos
            [pedidosPorEstado],         // Gráfico Dona (Array de filas)
            [metodosPago],              // Gráfico Pie (Array de filas)
            [topProductos],             // Gráfico Barras (Array de filas)
            [chartData]                 // Gráfico Líneas (Array de filas)
        ] = await Promise.all([
            // 1. Resumen Ingresos/Pedidos (Filtrado por fecha)
            pool.query(`SELECT IFNULL(SUM(total),0) as totalIngresos, COUNT(*) as totalPedidos FROM pedido p ${baseWhere} ${completedOrdersCondition}`, params),
            
            // 2. Totales Históricos (Para tarjetas informativas fijas, opcionalmente filtrables si se desea)
            pool.query(`SELECT COUNT(*) as count FROM usuario`),
            pool.query(`SELECT COUNT(*) as count FROM producto`),

            // 3. Pedidos por Estado (Filtrado)
            pool.query(`SELECT estado as label, COUNT(*) as value FROM pedido p ${whereClause} GROUP BY estado`, params),

            // 4. Métodos de Pago (Filtrado)
            pool.query(`SELECT metodoPago as label, COUNT(*) as value FROM pedido p ${baseWhere} ${completedOrdersCondition} GROUP BY metodoPago`, params),

            // 5. Top 5 Productos (Filtrado)
            pool.query(`
                SELECT pr.nombre as label, SUM(dp.cantidad) as value
                FROM detallepedido dp
                JOIN producto pr ON dp.idProducto = pr.idProducto
                JOIN pedido p ON dp.idPedido = p.idPedido
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY pr.idProducto, pr.nombre
                ORDER BY value DESC LIMIT 5
            `, params),

            // 6. Datos Gráfico Líneas (Filtrado)
            pool.query(`
                SELECT ${selectDate} as label, SUM(p.total) as value
                FROM pedido p
                ${baseWhere} ${completedOrdersCondition}
                GROUP BY ${groupBy}, label
                ORDER BY MIN(p.fecha) ASC
            `, params)
        ]);

        // Extracción segura de datos (usando optional chaining ?. y valores por defecto)
        const resumenIngresos = resumenIngresosRows[0] || {};
        const totalUsuarios = totalUsuariosRows[0] || {};
        const totalProductos = totalProductosRows[0] || {};

        const ingresos = parseFloat(resumenIngresos.totalIngresos || 0);
        const pedidos = parseInt(resumenIngresos.totalPedidos || 0);

        // Estructura que el Frontend espera ahora
        res.json({
            summary: {
                usuarios: totalUsuarios.count || 0,
                productos: totalProductos.count || 0,
                pedidos: pedidos,
                ingresos: ingresos.toFixed(2)
            },
            charts: {
                income: { labels: chartData.map(d => d.label), data: chartData.map(d => d.value) },
                status: { labels: pedidosPorEstado.map(d => d.label), data: pedidosPorEstado.map(d => d.value) },
                products: { labels: topProductos.map(d => d.label), data: topProductos.map(d => d.value) },
                payments: { labels: metodosPago.map(d => d.label), data: metodosPago.map(d => d.value) }
            }
        });

    } catch (error) {
        logger.error('Error metrics:', error);
        res.status(500).json({ error: 'Error al obtener métricas', details: error.message });
    }
};