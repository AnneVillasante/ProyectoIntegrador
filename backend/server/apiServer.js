// backend/server/apiServer.js
const express = require('express');
const cors = require('cors');
const pool = require('../config/db');
const authRouter = require('../routes/authRoutes');
const productosRouter = require('../routes/productoRoutes');
const usuarioRouter = require('../routes/usuarioRoutes');
const categoriaRoutes = require('../routes/categoriaRoutes');
const subcategoriaRoutes = require('../routes/subcategoriaRoutes');
const reporteRoutes = require('../routes/reporteRoutes');
const carritoRoutes = require('../routes/carritoRoutes');

const apiApp = express();
apiApp.use(express.json());
// CORS configurado para permitir solicitudes desde el frontend
apiApp.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Servir archivos estáticos desde la carpeta 'uploads'
apiApp.use('/uploads', express.static('uploads'));
apiApp.get('/health', (req, res) => res.json({ status: 'ok' }));
apiApp.use('/api/auth', authRouter);
apiApp.use('/api/productos', productosRouter);
apiApp.use('/api/usuarios', usuarioRouter);
apiApp.use('/api/categorias', categoriaRoutes);
apiApp.use('/api/subcategorias', subcategoriaRoutes);
apiApp.use('/api/reportes', reporteRoutes);
apiApp.use('/api/carrito', carritoRoutes);

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
