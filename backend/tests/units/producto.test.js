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
    
    // backend/tests/units/producto.test.js

test('Debería retornar estatus 200 y lista de productos', async () => {
    // 1. Preparación (Given)
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    
    // LO QUE DEVUELVE LA BD (Simulado)
    // Usamos 'idProducto' porque eso es lo que espera tu DTO, no 'id'
    const datosDeLaBD = [{ 
        idProducto: 1, 
        nombre: 'Vestido Lunaria',
        descripcion: 'Un vestido bonito', // Agregamos datos para que el DTO no devuelva vacíos
        categoria: 'Ropa',
        subcategoria: 'Vestidos'
    }];
    
    // LO QUE ESPERAMOS QUE RESPONDA LA API (DTO Transformado)
    // El DTO mantiene los nombres y agrega estructuras
    const respuestaEsperada = [{
        idProducto: 1,
        nombre: 'Vestido Lunaria',
        descripcion: 'Un vestido bonito',
        idCategoria: undefined, // El DTO asigna undefined si no vienen del DAO
        categoria: 'Ropa',
        imagen: undefined,
        precio: undefined,
        stock: undefined,
        idSubcategoria: undefined,
        subcategoria: 'Vestidos'
    }];
    
    // Cuando el DAO sea llamado, devolverá los datos crudos de la BD
    mockProductoDAO.getAll.mockResolvedValue(datosDeLaBD);

    // 2. Ejecución (When)
    await productoController.list(req, res);

    // 3. Verificación (Then)
    expect(res.statusCode).toBe(200);
    // Usamos JSON.parse para asegurar que comparamos objetos planos
    expect(JSON.parse(res._getData())).toEqual(respuestaEsperada);
});
});