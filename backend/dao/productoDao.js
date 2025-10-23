const pool = require('../config/db'); // Asegúrate de tener un archivo db.js que exporte tu pool de conexión

class ProductoDao {
    async getAllProducts() {
        const [rows] = await pool.query('SELECT idProducto, nombre, categoria, precio, stock FROM Producto');
        return rows;
    }

    async getById(id) {
        const [rows] = await pool.query('SELECT idProducto, nombre, categoria, precio, stock FROM Producto WHERE idProducto = ?', [id]);
        return rows[0];
    }

    async create(product) {
        const [result] = await pool.query(
            'INSERT INTO Producto (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
            [product.nombre, product.categoria, product.precio, product.stock]
        );
        return result.insertId;
    }

    async update(id, product) {
        await pool.query(
            'UPDATE Producto SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE idProducto = ?',
            [product.nombre, product.categoria, product.precio, product.stock, id]
        );
    }

    async delete(id) {
        await pool.query('DELETE FROM Producto WHERE idProducto = ?', [id]);
    }
}

module.exports = new ProductoDao();