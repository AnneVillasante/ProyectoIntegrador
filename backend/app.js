const path = require('path');
const fs = require('fs').promises; // Agregar este import
require('dotenv').config({
  path: path.resolve(__dirname, 'config/env.js'),
  debug: true
});
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRouter = require('./routes/auth');
const productsRouter = require('./routes/productRoutes');
const ProductService = require('./services/ProductService'); // Nuevo servicio

// ---- API server (puerto 4000) ----
const apiApp = express();
apiApp.use(express.json());
apiApp.use(cors({ origin: 'http://localhost:3000' }));

// Ruta ejemplo para comprobar conexión
apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));

// monta las rutas de auth en la API
apiApp.use('/api/auth', authRouter);

// montar API de productos
apiApp.use('/api/products', productsRouter);

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
const frontendRoot = path.join(__dirname, '../frontend');

// servir assets y páginas de forma explícita
staticApp.use('/assets', express.static(path.join(frontendRoot, 'assets')));
staticApp.use('/pages', express.static(path.join(frontendRoot, 'pages')));
staticApp.use('/components', express.static(path.join(frontendRoot, 'components')));
staticApp.use('/frontend', express.static(frontendRoot));

// accesos directos amigables
staticApp.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'index.html'));
});
staticApp.get('/login', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'login.html'));
});

// RENDER SERVER-SIDE de productos usando el servicio
staticApp.get('/productos', async (req, res) => {
  try {
    const products = await ProductService.getProductsForStaticRender();
    const cardsHtml = ProductService.generateProductCards(products);
    
    const filePath = path.join(frontendRoot, 'pages', 'productos.html');
    let html = await fs.readFile(filePath, 'utf8');
    html = html.replace('<!-- PRODUCTS_PLACEHOLDER -->', cardsHtml);
    
    res.send(html);
  } catch (err) {
    console.error('Error render productos:', err);
    res.status(500).send('Error interno al mostrar productos');
  }
});

// servir cualquier página estática en /<nombre> que exista en frontend/pages/<nombre>.html
staticApp.get('/:page', (req, res, next) => {
  const page = req.params.page;
  const filePath = path.join(frontendRoot, 'pages', `${page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) return next();
  });
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

module.exports = { apiApp, staticApp, pool };
