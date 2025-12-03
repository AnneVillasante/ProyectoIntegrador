// backend/tests/integration/api.test.js
const request = require('supertest');
const { apiApp } = require('../../server/apiServer'); // Importamos la APP, no la URL
const pool = require('../../config/db'); // Importamos la DB para cerrarla al final

describe('Pruebas de Integración - Endpoints', () => {
    
    // Al finalizar todas las pruebas, cerramos la conexión a la base de datos
    // Esto evita que el test se quede "colgado" en GitLab
    afterAll(async () => {
        await pool.end();
    });

    // Prueba de Sistema: Verificar que la API responde
    test('GET /api/productos debería responder 200', async () => {
        // En lugar de request('http://localhost:3000'), usamos request(apiApp)
        const response = await request(apiApp).get('/api/productos');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Prueba de Manejo de Errores
    test('GET /ruta-inexistente debería responder 404', async () => {
        const response = await request(apiApp).get('/api/no-existe');
        expect(response.statusCode).toBe(404);
    });
});