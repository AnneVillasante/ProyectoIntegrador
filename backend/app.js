// backend/app.js
require('dotenv').config({ path: require('path').resolve(__dirname, 'config/env.js'), debug: true });
const pool = require('./config/db');
const { startApi } = require('./server/apiServer');
const { startStatic } = require('./server/staticServer');

let apiServer, staticServer;

(async () => {
  apiServer = await startApi();
  staticServer = startStatic();
})();

async function shutdown() {
  console.log('Cerrando servidores y pool MySQL...');
  try {
    if (apiServer) await new Promise(r => apiServer.close(r));
    if (staticServer) await new Promise(r => staticServer.close(r));
    await pool.end();
  } catch (e) {
    console.error('Error durante shutdown:', e);
  } finally {
    process.exit(0);
  }
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
