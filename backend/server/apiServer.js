// backend/server/apiServer.js
const express = require('express');
const cors = require('cors');
const jsreport = require('jsreport')({ // 1. Importar e inicializar jsreport
  templatingEngines: {
    allowedModules: ['moment']
  }
});
const helmet = require('helmet');
const pool = require('../config/db');
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
const campañaRoutes = require('../routes/campañaRoutes');
const devolucionRoutes = require('../routes/devolucionRoutes');
const facturaRoutes = require('../routes/facturaRoutes');
const logActividadRoutes = require('../routes/logActividadRoutes');

const apiApp = express();

// 2. Adjuntar la instancia de jsreport a la aplicación
apiApp.set('jsreport', jsreport);

// CORS configurado para permitir solicitudes desde el frontend
apiApp.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Configuración de Helmet permisiva para desarrollo
apiApp.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:4000"], // Permite conectar al backend
      scriptSrc: ["'self'", "https://js.stripe.com"], // Permite Stripe
      frameSrc: ["'self'", "https://js.stripe.com"], // Permite iframes de Stripe
      imgSrc: ["'self'", "data:", "https:", "http://localhost:4000"], // Permite imágenes locales y externas
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"], // ✅ Permite fuentes
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"], // Permite estilos externos
    },
  })
);

// Ruta de Webhook ANTES de express.json() para recibir el body en formato raw
apiApp.use('/api/pagos', pagoRoutes);

// Middleware para parsear JSON para el resto de las rutas de la API
apiApp.use(express.json());

// Servir archivos estáticos desde la carpeta 'uploads'
apiApp.use('/uploads', express.static('uploads'));
apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));
apiApp.use('/api/auth', authRouter);
apiApp.use('/api/productos', productosRouter);
apiApp.use('/api/usuario', usuarioRouter);
apiApp.use('/api/categorias', categoriaRoutes);
apiApp.use('/api/subcategorias', subcategoriaRoutes);
apiApp.use('/api/reportes', reporteRoutes);
apiApp.use('/api/carrito', carritoRoutes);
apiApp.use('/api/cliente', clienteRoutes);
apiApp.use('/api/pedidos', pedidoRoutes);
apiApp.use('/api/promociones', promocionRoutes);
apiApp.use('/api/campanas', campañaRoutes);
apiApp.use('/api/devoluciones', devolucionRoutes);
apiApp.use('/api/facturas', facturaRoutes);
apiApp.use('/api/logs', logActividadRoutes);

async function startApi() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    const API_PORT = process.env.API_PORT || 4000;

    // 3. Iniciar el servidor de jsreport
    await jsreport.init();
    console.log('jsreport server iniciado.');


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
