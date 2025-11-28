const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1', // Valor por defecto para desarrollo
  port: Number(process.env.MYSQL_PORT || '3306'), // Simplificado y con valor por defecto
  user: process.env.MYSQL_USER || 'root', // Valor por defecto para desarrollo
  password: process.env.MYSQL_PASSWORD, // ¡Importante! No tener contraseñas por defecto en el código
  database: process.env.MYSQL_DATABASE || 'LunariaThreadsDB', // Valor por defecto para desarrollo
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
