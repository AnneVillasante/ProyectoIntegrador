const pool = require('../db'); // Asegúrate de tener un archivo db.js que exporte tu pool de conexión

class ProductoDao {
    async getAllProducts() {
        const [rows] = await pool.query('SELECT * FROM Producto');
        return rows;
    }
}

module.exports = new ProductoDao();