// backend/app.js
require('./config/config');

const pool = require('./config/db');
const logger = require('./config/logger');
// Importamos SOLO el servidor unificado (que ahora maneja todo)
const { startApi } = require('./server/apiServer'); 
const initCrons = require('./cron/maintenanceCron'); // <-- Importamos la inicialización de crons

let apiServer;

(async () => {
  try {
    // Iniciamos únicamente el servidor principal
    apiServer = await startApi();
    initCrons(); // <-- ¡Llamamos a esta función para iniciar los cron jobs!
    logger.info(`Servidor API iniciado en modo ${process.env.NODE_ENV || 'development'}`); // Usamos logger.info
  } catch (error) {
    logger.error('Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
})();

async function shutdown() {
  logger.warn('Cerrando servidor y pool MySQL...'); // Usamos logger.warn o .info
  try {
    if (apiServer) await new Promise(r => apiServer.close(r));
    await pool.end();
    logger.info('Servidor y pool MySQL cerrados correctamente.');
  } catch (e) {
    logger.error('Error durante shutdown:', e); // Usamos logger.error
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
