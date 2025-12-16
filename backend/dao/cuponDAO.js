const pool = require('../config/db'); // Asumiendo que tienes un archivo de configuración de DB

class CuponDAO {
    async findAll() {
        const [rows] = await db.execute('SELECT * FROM cupon ORDER BY idCupon DESC');
        return rows;
    }

    async findById(id) {
        const [rows] = await db.execute('SELECT * FROM cupon WHERE idCupon = ?', [id]);
        return rows[0];
    }

    async create(cuponData) {
        const { codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo } = cuponData;
        const [result] = await db.execute(
            'INSERT INTO cupon (codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo) VALUES (?, ?, ?, ?, ?, ?)',
            [codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo]
        );
        return result.insertId;
    }

    async update(id, cuponData) {
        const { codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo } = cuponData;
        const [result] = await db.execute(
            `UPDATE cupon SET 
                codigo = ?, 
                descripcion = ?, 
                fechaExpiracion = ?, 
                tipoDescuento = ?, 
                valorDescuento = ?, 
                activo = ? 
            WHERE idCupon = ?`,
            [codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await db.execute('DELETE FROM cupon WHERE idCupon = ?', [id]);
        return result.affectedRows > 0;
    }

    async findByCode(codigo) {
        const [rows] = await db.execute('SELECT * FROM cupon WHERE codigo = ?', [codigo]);
        return rows[0];
    }
}

module.exports = new CuponDAO();

