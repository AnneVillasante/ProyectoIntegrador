// backend/utils/template.js

// Importamos la configuración para acceder a la URL base del servidor
const { BASE_URL } = require('../config/config');

const generarPlantillaHtml = (titulo, datos, resumen = '') => {
  const fecha = new Date().toLocaleDateString('es-PE', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  // Si no hay datos
  if (!datos || datos.length === 0) {
    return `<h1>${titulo}</h1><p>No hay datos disponibles para este reporte.</p>`;
  }

  // Columnas dinámicas
  const columnas = Object.keys(datos[0]);

  // Cabeceras de tabla
  const headers = columnas.map(col => `<th>${col}</th>`).join('');

  // Filas de tabla
  const filas = datos.map(row => {
    const celdas = columnas.map(col => `<td>${row[col]}</td>`).join('');
    return `<tr>${celdas}</tr>`;
  }).join('');

  // HTML COMPLETO CON DISEÑO "LUNARIA THREADS"
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <style>
      body { 
        font-family: 'Helvetica', 'Arial', sans-serif; 
        color: #333; 
        margin: 0; 
        padding: 20px;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #6a1b9a; /* Color Morado Lunaria */
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      .logo img {
        height: 50px; /* Ajusta la altura de tu logo */
        width: auto;
      }
      .report-info {
        text-align: right;
        font-size: 12px;
        color: #666;
      }
      h1 {
        text-align: center;
        color: #4a148c;
        margin-bottom: 5px;
        font-size: 22px;
      }
      .summary {
        background-color: #f3e5f5;
        border-left: 4px solid #8e24aa;
        padding: 10px;
        margin-bottom: 20px;
        font-size: 14px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      thead {
        background-color: #6a1b9a;
        color: white;
      }
      th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 10px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 10px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">
        <!-- ✅ AQUÍ VA TU LOGO: Reemplaza la URL por la ruta a tu imagen -->
        <img src="${BASE_URL}/assets/img/Logo-000.png" alt="Logo Lunaria Threads">
      </div>
      <div class="report-info">
        <p>Generado el: ${fecha}</p>
        <p>Sistema de Gestión</p>
      </div>
    </div>

    <h1>${titulo}</h1>

    ${resumen ? `<div class="summary"><strong>Resumen:</strong> ${resumen}</div>` : ''}

    <table>
      <thead>
        <tr>${headers}</tr>
      </thead>
      <tbody>
        ${filas}
      </tbody>
    </table>

    <div class="footer">
      &copy; ${new Date().getFullYear()} Lunaria Threads. Reporte confidencial para uso interno.
    </div>
  </body>
  </html>
  `;
};

module.exports = { generarPlantillaHtml };