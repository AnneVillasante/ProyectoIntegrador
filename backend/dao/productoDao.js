const pool = require('../config/db'); // Asegúrate de tener un archivo db.js que exporte tu pool de conexión

class ProductoDao {
    async getAllProducts() {
        const [rows] = await pool.query('SELECT idProducto, nombre, categoria, precio, stock FROM producto');
        return rows;
    }

    async getById(id) {
        const [rows] = await pool.query('SELECT idProducto, nombre, categoria, precio, stock FROM producto WHERE idProducto = ?', [id]);
        return rows[0];
    }

    async create(product) {
        const [result] = await pool.query(
            'INSERT INTO producto (nombre, categoria, precio, stock) VALUES (?, ?, ?, ?)',
            [product.nombre, product.categoria, product.precio, product.stock]
        );
        return result.insertId;
    }

    async update(id, product) {
        await pool.query(
            'UPDATE producto SET nombre = ?, categoria = ?, precio = ?, stock = ? WHERE idProducto = ?',
            [product.nombre, product.categoria, product.precio, product.stock, id]
        );
    }

    async delete(id) {
        await pool.query('DELETE FROM producto WHERE idProducto = ?', [id]);
    }
}

module.exports = new ProductoDao();