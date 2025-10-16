require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Agregar esta línea para servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Configuración de la conexión (lee de .env)
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'Sapphire_27',
  database: process.env.MYSQL_DATABASE || 'LunariaThreadsDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/index.html'));
});

// Ejemplo: obtener usuarios (ajusta la consulta a tu esquema)
app.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users LIMIT 100');
    res.json(rows);
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).json({ error: 'Error en la consulta' });
  }
});

// Iniciar servidor y verificar conexión a MySQL
async function startServer() {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('Conectado a MySQL');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Error conectando a MySQL:', err);
    process.exit(1);
  }
}

startServer();

// Cerrar pool al terminar el proceso
process.on('SIGINT', async () => {
  console.log('Cerrando conexión MySQL...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Cerrando conexión MySQL...');
  await pool.end();
  process.exit(0);
});

module.exports = app;

