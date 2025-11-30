// backend/config/config.js
const dotenv = require('dotenv');
const path = require('path');

// Carga las variables de entorno desde el archivo .env en la misma carpeta de config
dotenv.config({ path: path.resolve(__dirname, '.env') });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'cambiar_esto_en_produccion',
  // Aquí puedes añadir otras variables que necesites globalmente
};
