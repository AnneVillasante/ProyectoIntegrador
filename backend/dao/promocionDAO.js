/**
 * @fileoverview Data Access Object for promotions.
 *
 * @version 1.0
 * @author Lunaria
 */

const db = require('../config/db');

const promocionDAO = {
  async crear(promocionData) {
    const { titulo, descripcion, fechaInicio, fechaFin, idCampaña, tipoDescuento, valorDescuento, montoMinimoCompra, activo, idCategoriaAplicable } = promocionData;
    const [result] = await db.execute(
      `INSERT INTO promocion (titulo, descripcion, fechaInicio, fechaFin, idCampaña, tipoDescuento, valorDescuento, montoMinimoCompra, activo, idCategoriaAplicable) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [titulo, descripcion, fechaInicio, fechaFin, idCampaña, tipoDescuento, valorDescuento, montoMinimoCompra, activo, idCategoriaAplicable]
    );
    return result.insertId;
  },

  async obtenerTodas() {
    const [rows] = await db.query('SELECT * FROM promocion ORDER BY fechaInicio DESC');
    return rows;
  },

  async obtenerPorId(id) {
    const [rows] = await db.query('SELECT * FROM promocion WHERE idPromocion = ?', [id]);
    return rows[0] || null;
  },

  async actualizar(id, promocionData) {
    const { titulo, descripcion, fechaInicio, fechaFin, idCampaña, tipoDescuento, valorDescuento, montoMinimoCompra, activo, idCategoriaAplicable } = promocionData;
    const [result] = await db.execute(
      `UPDATE promocion SET 
        titulo = ?, 
        descripcion = ?, 
        fechaInicio = ?, 
        fechaFin = ?, 
        idCampaña = ?, 
        tipoDescuento = ?, 
        valorDescuento = ?, 
        montoMinimoCompra = ?, 
        activo = ?, 
        idCategoriaAplicable = ? 
       WHERE idPromocion = ?`,
      [titulo, descripcion, fechaInicio, fechaFin, idCampaña, tipoDescuento, valorDescuento, montoMinimoCompra, activo, idCategoriaAplicable, id]
    );
    return result.affectedRows;
  },

  async eliminar(id) {
    const [result] = await db.execute('DELETE FROM promocion WHERE idPromocion = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = promocionDAO;