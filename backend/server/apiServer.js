// backend/server/apiServer.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const ProductService = require('../services/productoService');

// Configuramos jsreport con puerto 0, pero el verdadero control
// lo haremos más abajo en startApi.
const jsreport = require('jsreport')({
  httpPort: 0,
  httpsPort: 0,
  sandbox: {
    allowedModules: ['moment']
  }
});

const helmet = require('helmet');
const pool = require('../config/db');

// Importación de rutas
const authRouter = require('../routes/authRoutes');
const productosRouter = require('../routes/productoRoutes');
const usuarioRouter = require('../routes/usuarioRoutes');
const categoriaRoutes = require('../routes/categoriaRoutes');
const subcategoriaRoutes = require('../routes/subcategoriaRoutes');
const reporteRoutes = require('../routes/reporteRoutes');
const carritoRoutes = require('../routes/carritoRoutes');
const clienteRoutes = require('../routes/clienteRoutes');
const pedidoRoutes = require('../routes/pedidoRoutes');
const pagoRoutes = require('../routes/pagoRoutes');
const promocionRoutes = require('../routes/promocionRoutes');
const campanaRoutes = require('../routes/campanaRoutes');
const devolucionRoutes = require('../routes/devolucionRoutes');
const facturaRoutes = require('../routes/facturaRoutes');
const logActividadRoutes = require('../routes/logActividadRoutes');
const cuponRoutes = require('../routes/cuponRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');

const apiApp = express();

// Adjuntar jsreport
apiApp.set('jsreport', jsreport);

// CORS
apiApp.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://lunaria-threads.onrender.com'], 
  credentials: true
}));

// Helmet
apiApp.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4000", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:4000"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
    },
  })
);

apiApp.use(express.json());

// ---------------------------------------------------------------------
// LOGICA DEL SERVIDOR ESTÁTICO
// ---------------------------------------------------------------------
const frontendRoot = path.join(__dirname, '../../frontend');

apiApp.use('/assets', express.static(path.join(frontendRoot, 'assets')));
apiApp.use('/pages', express.static(path.join(frontendRoot, 'pages')));
apiApp.use('/components', express.static(path.join(frontendRoot, 'components')));
apiApp.use('/js', express.static(path.join(frontendRoot, 'js')));
apiApp.use('/frontend', express.static(frontendRoot));
apiApp.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas de API
apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));
apiApp.use('/api/auth', authRouter);
apiApp.use('/api/productos', productosRouter);
apiApp.use('/api/usuario', usuarioRouter);
apiApp.use('/api/categorias', categoriaRoutes);
apiApp.use('/api/subcategorias', subcategoriaRoutes);
apiApp.use('/api/reportes', reporteRoutes);
apiApp.use('/api/carritos', carritoRoutes); // Corregido a plural por consistencia
apiApp.use('/api/clientes', clienteRoutes); // Corregido a plural
apiApp.use('/api/pedidos', pedidoRoutes);
apiApp.use('/api/pagos', pagoRoutes);
apiApp.use('/api/promociones', promocionRoutes);
apiApp.use('/api/campanas', campanaRoutes);
apiApp.use('/api/devoluciones', devolucionRoutes);
apiApp.use('/api/facturas', facturaRoutes);
apiApp.use('/api/logs', logActividadRoutes);
apiApp.use('/api/cupones', cuponRoutes);
apiApp.use('/api/dashboard', dashboardRoutes);

// Rutas de Vistas
apiApp.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'index.html'));
});
apiApp.get('/favicon.ico', (req, res) => res.status(204).send());
apiApp.get('/login', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'login.html'));
});
apiApp.get('/perfil', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'components', 'perfil.html'));
});
apiApp.get('/carrito', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'carrito.html'));
});
apiApp.get('/compra', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'compra.html'));
});
apiApp.get('/admin', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'admin_panel.html'));
});
apiApp.get('/dashboard', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'admin_panel.html'));
});
apiApp.get('/admin/cupones', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'admin_panel.html'));
});
apiApp.get('/admin/pos', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'carrito_cliente.html'));
});
apiApp.get('/admin/pos/pago', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'venta_fisica_pago.html'));
});

// Render de productos (SSR)
apiApp.get('/productos', async (req, res) => {
  try {
    const { categoria } = req.query;
    const products = await ProductService.getProductsForStaticRender(categoria);
    const cardsHtml = ProductService.generateProductCards(products);
    
    const filePath = path.join(frontendRoot, 'pages', 'productos.html');
    let html = await fs.readFile(filePath, 'utf-8');
    html = html.replace('', cardsHtml)
               .replace('<h1 class="productos-title">Colección Destacada</h1>', `<h1 class="productos-title">${categoria ? `Categoría: ${categoria}` : 'Colección Destacada'}</h1>`);
    
    res.send(html);
  } catch (err) {
    console.error('Error render productos:', err);
    res.status(500).send('Error interno al mostrar productos');
  }
});

async function startApi() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    
    // --- CORRECCIÓN: OCULTAR PUERTO AQUÍ ---
    // Guardamos el puerto de Render en una variable temporal
    const RENDER_PORT = process.env.PORT;
    // Lo borramos del entorno para que jsreport NO lo vea al iniciar
    if (process.env.PORT) delete process.env.PORT;

    console.log('Iniciando jsreport (sin puerto)...');
    await jsreport.init();
    console.log('jsreport iniciado correctamente.');

    // --- RESTAURAR PUERTO ---
    // Devolvemos el puerto a su lugar para que Express lo use
    if (RENDER_PORT) process.env.PORT = RENDER_PORT;

    // Usamos el puerto restaurado
    const PORT = process.env.PORT || 4000;

    const apiServer = apiApp.listen(PORT, () =>
      console.log(`Servidor unificado escuchando en puerto ${PORT}`)
    );
    return apiServer;
  } catch (err) {
    console.error('Error iniciando servidor:', err);
    process.exit(1);
  }
}

module.exports = { apiApp, startApi };
