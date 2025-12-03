// backend/utils/template.js
const path = require('path');
const fs = require('fs');

const obtenerLogoBase64 = () => {
  try {
    // Ajustamos la ruta para llegar desde backend/utils/ hasta frontend/assets/img/
    const imagePath = path.join(__dirname, '../../frontend/assets/img/Logo-000.png');
    if (fs.existsSync(imagePath)) {
      const bitmap = fs.readFileSync(imagePath);
      return `data:image/png;base64,${Buffer.from(bitmap).toString('base64')}`;
    }
    return '';
  } catch (error) {
    console.error('Error cargando logo:', error.message);
    return '';
  }
};

const generarPlantillaHtml = (titulo, datos, resumen = '') => {
  const fecha = new Date().toLocaleDateString('es-PE', { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
  });

  const logoSrc = obtenerLogoBase64();

  if (!datos || datos.length === 0) {
    return `<h1>${titulo}</h1><p>No hay datos disponibles.</p>`;
  }

  const columnas = Object.keys(datos[0]);
  const headers = columnas.map(col => `<th>${col}</th>`).join('');
  const filas = datos.map(row => `<tr>${columnas.map(col => `<td>${row[col]}</td>`).join('')}</tr>`).join('');

  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
      .header { display: flex; justify-content: space-between; border-bottom: 2px solid #6a1b9a; padding-bottom: 10px; margin-bottom: 20px; }
      .logo img { height: 60px; display: block; }
      .logo-text { font-size: 24px; font-weight: bold; color: #6a1b9a; }
      .report-info { text-align: right; font-size: 12px; color: #666; }
      h1 { text-align: center; color: #4a148c; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 12px; }
      th { background-color: #6a1b9a; color: white; padding: 10px; text-align: left; }
      td { border-bottom: 1px solid #ddd; padding: 10px; }
      .summary { background: #f3e5f5; padding: 10px; border-left: 4px solid #8e24aa; margin-bottom: 15px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="logo">
        ${logoSrc ? `<img src="${logoSrc}" />` : '<div class="logo-text">LUNARIA THREADS</div>'}
      </div>
      <div class="report-info">
        <p>${fecha}</p>
        <p>Sistema de Gestión</p>
      </div>
    </div>
    <h1>${titulo}</h1>
    ${resumen ? `<div class="summary"><strong>Resumen:</strong> ${resumen}</div>` : ''}
    <table>
      <thead><tr>${headers}</tr></thead>
      <tbody>${filas}</tbody>
    </table>
  </body>
  </html>
  `;
};

module.exports = { generarPlantillaHtml };