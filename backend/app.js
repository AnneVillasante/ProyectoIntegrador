// backend/app.js
require('./config/config');

const pool = require('./config/db');
const { startApi } = require('./server/apiServer'); // Ya no necesitamos staticServer

let apiServer;

(async () => {
  // Solo iniciamos el servidor unificado
  apiServer = await startApi();
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
