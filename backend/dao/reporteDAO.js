const db = require('../config/db');

const reporteDAO = {
  create: async (reporte) => {
    const { tipo, formato, parametros, usuario, exportado } = reporte;
    const [result] = await db.query(`
      INSERT INTO reporte (tipo, formato, parametros, usuario, exportado)
      VALUES (?, ?, ?, ?, ?)`,
      [tipo, formato || 'PDF', parametros ? JSON.stringify(parametros) : null, usuario || null, exportado || false]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [rows] = await db.query(`
      SELECT * FROM reporte
      ORDER BY fechaGeneracion DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM reporte WHERE idReporte = ?', [id]);
    return rows[0];
  },

  getByTipo: async (tipo) => {
    const [rows] = await db.query('SELECT * FROM reporte WHERE tipo = ? ORDER BY fechaGeneracion DESC', [tipo]);
    return rows;
  },

  update: async (id, reporte) => {
    const { exportado } = reporte;
    await db.query('UPDATE reporte SET exportado = ? WHERE idReporte = ?', [exportado, id]);
  },

  delete: async (id) => {
    await db.query('DELETE FROM reporte WHERE idReporte = ?', [id]);
  }
};

module.exports = reporteDAO;

