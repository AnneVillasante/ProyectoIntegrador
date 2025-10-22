require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const ProductoDao = require('./dao/productoDao');
const ProductoDto = require('./dto/productoDto');
const pool = require('..backend/config/db');

// ---- API server (puerto 4000) ----
const apiApp = express();
apiApp.use(express.json());
// permitir peticiones desde el frontend servido en 3000
apiApp.use(cors({ origin: 'http://localhost:3000' }));

// Ruta ejemplo para comprobar conexión
apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));

// Ruta para obtener productos (usa tu DAO/DTO)
apiApp.get('/api/products', async (req, res) => {
  try {
    const products = await ProductoDao.getAllProducts(); // debe usar pool internamente
    const productDtos = products.map(p => new ProductoDto(
      p.idProducto, p.nombre, p.categoria, p.precio, p.stock
    ));
    res.json(productDtos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Iniciar API en el puerto 4000 y verificar conexión a MySQL
async function startApi() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    const API_PORT = process.env.API_PORT || 4000;
    apiServer = apiApp.listen(API_PORT, () => {
      console.log(`API escuchando en http://localhost:${API_PORT}`);
      console.log('Conexión a MySQL verificada');
    });
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
}

// ---- Static server (puerto 3000) ----
const staticApp = express();
// servir toda la carpeta frontend (index.html en frontend/pages/index.html)
staticApp.use(express.static(path.join(__dirname, '../frontend')));

// al acceder a / servir index.html (ruta relativa dentro frontend/pages)
staticApp.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

function startStatic() {
  const STATIC_PORT = process.env.STATIC_PORT || 3000;
  staticServer = staticApp.listen(STATIC_PORT, () => {
    console.log(`Frontend estático escuchando en http://localhost:${STATIC_PORT}`);
  });
}

// ---- Arranque ----
let apiServer;
let staticServer;

startApi();
startStatic();

// ---- Cierre limpio ----
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

// export opcional (no necesario pero útil para tests)
module.exports = { apiApp, staticApp, pool };

