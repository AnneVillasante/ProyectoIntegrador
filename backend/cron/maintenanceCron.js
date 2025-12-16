const cron = require('node-cron');
const logger = require('../config/logger');
const cuponService = require('../services/cuponService');

/**
 * Inicializa y programa todas las tareas CRON de mantenimiento.
 */
const initCrons = () => {
    // CRON: Desactivar cupones expirados
    // Se ejecuta a la 00:00 (medianoche) todos los días. Cron format: [min] [hour] [day of month] [month] [day of week]
    cron.schedule('0 0 * * *', async () => {
        logger.info('--- Ejecutando tarea CRON: Desactivación de cupones expirados. ---');
        try {
            // Llama a la función de mantenimiento del servicio
            const result = await cuponService.desactivarCuponesExpirados(); 
            logger.info(`CRON Exitoso: Se desactivaron ${result.count} cupones.`);
        } catch (error) {
            // Usamos logger.error para que se escriba en el archivo de errores
            logger.error('CRON Fallido: Error al desactivar cupones.', error);
        }
    }, {
        scheduled: true,
        // Es crucial especificar la zona horaria para que 00:00 sea la medianoche local
        timezone: "America/Lima" 
    });

    logger.info('Tareas programadas (Cron Jobs) inicializadas.');
};

module.exports = initCrons;