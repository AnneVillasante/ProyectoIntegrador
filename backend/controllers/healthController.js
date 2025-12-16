const { checkDbHealth } = require('../config/db');

/**
 * Endpoint para obtener el estado de salud de la aplicación.
 * @route GET /api/v1/health
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 */
exports.getHealthStatus = async (req, res) => {
    // Verificamos el estado de la conexión a la base de datos
    const dbStatus = await checkDbHealth();

    const status = {
        uptime: process.uptime(), // Tiempo que la aplicación lleva corriendo (en segundos)
        message: 'OK',
        timestamp: Date.now(),
        // Usamos el resultado de la función de la DB
        database: dbStatus ? 'UP' : 'DOWN' 
    };

    // Si la base de datos está caída, respondemos con un error 503 (Service Unavailable)
    if (!dbStatus) {
        // En un escenario real, aquí se usaría el logger.error
        return res.status(503).json({ 
            ...status, 
            message: 'Service Unavailable - Database is DOWN', 
            error: 'Database connection failed' 
        });
    }

    // Si todo está bien, respondemos con un 200 (OK)
    res.status(200).json(status);
};