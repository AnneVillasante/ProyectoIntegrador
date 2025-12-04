// backend/app.js
require('./config/config');

const pool = require('./config/db');
// Importamos SOLO el servidor unificado (que ahora maneja todo)
const { startApi } = require('./server/apiServer'); 

let apiServer;

(async () => {
  try {
    // Iniciamos únicamente el servidor principal
    apiServer = await startApi();
  } catch (error) {
    console.error('Error fatal al iniciar la aplicación:', error);
    process.exit(1);
  }
})();

async function shutdown() {
  console.log('Cerrando servidor y pool MySQL...');
  try {
    if (apiServer) await new Promise(r => apiServer.close(r));
    await pool.end();
  } catch (e) {
    console.error('Error durante shutdown:', e);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
