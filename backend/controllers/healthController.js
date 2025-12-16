const { checkDbHealth } = require('../config/db');

const checkHealth = async (req, res) => {
    try {
        const isDbConnected = await checkDbHealth();
        
        const status = {
            server: 'UP',
            database: isDbConnected ? 'UP' : 'DOWN',
            timestamp: new Date().toISOString()
        };

        // Si la base de datos no responde, devolvemos 503 (Service Unavailable)
        if (!isDbConnected) {
            return res.status(503).json(status);
        }

        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({
            server: 'ERROR',
            message: error.message
        });
    }
};

module.exports = {
    checkHealth
};