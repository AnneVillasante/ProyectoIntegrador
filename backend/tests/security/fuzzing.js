const axios = require('axios'); // Asegúrate de tener axios: npm install axios
const logger = require('../../config/logger');
const TARGET_URL = 'http://localhost:3000/api/auth/login';

const payloads = [
    { email: "' OR 1=1 --", password: "password" }, // SQL Injection básico
    { email: "admin@test.com", password: Array(1000).fill('a').join('') }, // Buffer overflow attempt
    { email: { $gt: "" }, password: "password" }, // NoSQL Injection (aunque usas MySQL, es bueno probar)
    { js: "<script>alert(1)</script>" } // XSS payload
];

async function runFuzzing() {
    logger.info('🔥 Iniciando Pruebas de Fuzzing/Seguridad...');
    
    for (const payload of payloads) {
        try {
            logger.info(`Probando payload: ${JSON.stringify(payload).substring(0, 50)}...`);
            await axios.post(TARGET_URL, payload);
        } catch (error) {
            // Si el servidor responde 400 o 401, es bueno (lo bloqueó).
            // Si responde 500, ¡encontramos un bug!
            if (error.response && error.response.status === 500) {
                logger.error('❌ ALERTA: Error 500 detectado con payload:', payload);
                logger.error('   Posible vulnerabilidad de manejo de excepciones.');
            } else {
                logger.info(`✅ Servidor respondió: ${error.response ? error.response.status : error.message} (Controlado)`);
            }
        }
    }
    logger.info('🏁 Fuzzing finalizado.');
}

runFuzzing();   