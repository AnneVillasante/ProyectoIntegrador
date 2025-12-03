// backend/tests/unit/producto.test.js

// Simulamos el modelo de datos para no conectar a MySQL real
const mockProductoDAO = {
    getAll: jest.fn(),
    getById: jest.fn()
};

// Importamos el controlador (Asegúrate de que tu controlador use inyección de dependencias o adapta esto)
// Si tu controlador importa directamente el modelo, Jest puede interceptarlo así:
jest.mock('../../dao/productoDAO', () => mockProductoDAO);

const productoController = require('../../controllers/productoController');
const httpMocks = require('node-mocks-http'); // Necesitarás: npm install --save-dev node-mocks-http

describe('Pruebas Unitarias - ProductoController', () => {
    
    test('Debería retornar estatus 200 y lista de productos', async () => {
        // 1. Preparación (Given)
        const req = httpMocks.createRequest();
        const res = httpMocks.createResponse();
        const mockProductos = [{ id: 1, nombre: 'Vestido Lunaria' }];
        
        // Cuando el DAO sea llamado, devolverá esto falsamente
        mockProductoDAO.getAll.mockResolvedValue(mockProductos);

        // 2. Ejecución (When)
        // Nota: Asegúrate de que tu metodo se llame 'obtenerProductos' o ajusta el nombre
        await productoController.obtenerProductos(req, res);

        // 3. Verificación (Then)
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(mockProductos);
    });
});