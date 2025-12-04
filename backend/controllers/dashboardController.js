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
        const [usuariosRes] = await db.query('SELECT COUNT(*) as total FROM usuario');
        const [productosRes] = await db.query('SELECT COUNT(*) as total FROM producto');

        const pedidosQuery = `SELECT COUNT(*) as total FROM pedido p ${whereClause}`;
        const [pedidosRes] = await db.query(pedidosQuery, params);

        const ingresosQuery = `SELECT SUM(total) as total FROM pedido p ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")`;
        const [ingresosRes] = await db.query(ingresosQuery, params);

        // 2. Consulta para el gráfico de ingresos
        const chartQuery = `
            SELECT 
                ${selectDate} as label,
                SUM(p.total) as value
            FROM pedido p
            ${whereClause.length > 0 ? `${whereClause} AND` : 'WHERE'} (p.estado = "pagado" OR p.estado = "entregado")
            GROUP BY ${groupBy}
            ORDER BY MIN(p.fecha) ASC  <-- CAMBIO AQUÍ (Agregamos MIN)
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
                ingresos: ingresosRes[0].total || 0.00,
            },
            chartData: chartData
        });

    } catch (error) {
        console.error('Error obteniendo métricas:', error);
        res.status(500).json({ error: 'Error al cargar métricas' });
    }
};