const pool = require('../config/db');

const reporteDAO = {
  create: async (reporte) => {
    const { tipo, formato, parametros, usuario, exportado } = reporte;
    const [result] = await pool.query(`
      INSERT INTO reporte (tipo, formato, parametros, usuario, exportado)
      VALUES (?, ?, ?, ?, ?)`,
      [tipo, formato || 'PDF', parametros ? JSON.stringify(parametros) : null, usuario || null, exportado || false]
    );
    return result.insertId;
  },

  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT * FROM reporte
      ORDER BY fechaGeneracion DESC
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query('SELECT * FROM reporte WHERE idReporte = ?', [id]);
    return rows[0];
  },

  getByTipo: async (tipo) => {
    const [rows] = await pool.query('SELECT * FROM reporte WHERE tipo = ? ORDER BY fechaGeneracion DESC', [tipo]);
    return rows;
  },

  update: async (id, reporte) => {
    const { exportado } = reporte;
    await pool.query('UPDATE reporte SET exportado = ? WHERE idReporte = ?', [exportado, id]);
  },

  updateExportado: async (id, exportado) => {
    const value = exportado ? 1 : 0;
    await pool.query('UPDATE reporte SET exportado = ? WHERE idReporte = ?', [value, id]);
  },

  delete: async (id) => {
    await pool.query('DELETE FROM reporte WHERE idReporte = ?', [id]);
  }
};

module.exports = reporteDAO;
