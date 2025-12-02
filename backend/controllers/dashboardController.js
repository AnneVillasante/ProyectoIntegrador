// backend/controllers/dashboardController.js
const db = require('../config/db'); // Asumo que usas este pool para consultas directas

exports.getMetrics = async (req, res) => {
    try {
        // Ejecutamos consultas en paralelo para mayor velocidad
        const [usuarios] = await db.query('SELECT COUNT(*) as total FROM usuario');
        const [productos] = await db.query('SELECT COUNT(*) as total FROM producto');
        const [pedidos] = await db.query('SELECT COUNT(*) as total FROM pedido');
        const [ventas] = await db.query('SELECT SUM(total) as total FROM pedido WHERE estado = "pagado" OR estado = "entregado"');
        
        // Stock bajo (ejemplo: menos de 10 unidades)
        const [stockBajo] = await db.query('SELECT COUNT(*) as total FROM producto WHERE stock < 10');

        res.json({
            usuarios: usuarios[0].total,
            productos: productos[0].total,
            pedidos: pedidos[0].total,
            ingresos: ventas[0].total || 0.00,
            stockBajo: stockBajo[0].total
        });
    } catch (error) {
        console.error('Error obteniendo métricas:', error);
        res.status(500).json({ error: 'Error al cargar métricas' });
    }
};