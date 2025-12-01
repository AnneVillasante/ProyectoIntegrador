// backend/tests/integration/api.test.js
const request = require('supertest');
const baseURL = 'http://localhost:3000'; // Asumimos que tu server está corriendo

describe('Pruebas de Integración - Endpoints', () => {
    
    // Prueba de Sistema: Verificar que la API responde
    test('GET /api/productos debería responder 200', async () => {
        const response = await request(baseURL).get('/api/productos');
        expect(response.statusCode).toBe(200);
        // Verificamos que sea un array
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    // Prueba de Manejo de Errores
    test('GET /ruta-inexistente debería responder 404', async () => {
        const response = await request(baseURL).get('/api/no-existe');
        expect(response.statusCode).toBe(404);
    });
});