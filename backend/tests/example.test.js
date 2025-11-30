// backend/tests/ejemplo.test.js

describe('Pruebas Iniciales del Sistema', () => {
    
    // Prueba 1: Verificar que las matemáticas funcionan (Prueba básica de Jest)
    test('Debería sumar 1 + 1 correctamente', () => {
        expect(1 + 1).toBe(2);
    });

    // Prueba 2: Verificar que podemos validar objetos (útil para respuestas API futura)
    test('Debería tener la estructura correcta de respuesta', () => {
        const data = { nombre: 'Lunaria', status: 'activo' };
        expect(data).toEqual({ nombre: 'Lunaria', status: 'activo' });
    });
});