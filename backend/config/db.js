const mysql = require('mysql2');

// Crear la conexión
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Sapphire_27',
  database: 'LunariaThreadsDB'
});

// Verificar la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos con ID ' + connection.threadId);
});

module.exports = connection;
