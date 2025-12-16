const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
/**
 * Función que verifica la salud de la conexión al pool de la base de datos.
 * Intenta obtener una conexión y ejecutar una consulta simple.
 * @returns {Promise<boolean>} Devuelve true si la conexión es exitosa, false en caso contrario.
 */
async function checkDbHealth() {
  let connection;
  try {
    // Intenta obtener una conexión del pool
    connection = await pool.getConnection();
    
    // Ejecuta una consulta ligera para verificar el estado de la conexión
    await connection.query('SELECT 1 + 1 AS solution'); 
    
    return true; // Éxito
  } catch (error) {
    // Si hay un error (por ejemplo, DB no disponible), lo capturamos
    return false; // Error
  } finally {
    // Asegúrate de liberar la conexión, si se obtuvo
    if (connection) connection.release();
  }
}

// Exportamos tanto el pool como la nueva función de chequeo de salud
module.exports = {
  pool,
  checkDbHealth
};
