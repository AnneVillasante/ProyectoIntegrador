// backend/server/apiServer.js
const express = require('express');
const cors = require('cors');
const pool = require('../config/db');
const authRouter = require('../routes/auth');
const productsRouter = require('../routes/productRoutes');
const usuarioRouter = require('../routes/usuarioRoutes');

const apiApp = express();
apiApp.use(express.json());
apiApp.use(cors({ origin: 'http://localhost:3000' }));

apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));
apiApp.use('/api/auth', authRouter);
apiApp.use('/api/products', productsRouter);
apiApp.use('/api/usuarios', usuarioRouter);

async function startApi() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    const API_PORT = process.env.API_PORT || 4000;
    const apiServer = apiApp.listen(API_PORT, () =>
      console.log(`API escuchando en http://localhost:${API_PORT}`)
    );
    return apiServer;
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
}

module.exports = { apiApp, startApi };
