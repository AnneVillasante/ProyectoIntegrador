// backend/utils/template.js
const generarPlantillaHtml = (titulo, datos, resumen = '') => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>body { font-family: Arial; padding: 20px; }</style>
      </head>
      <body>
        <h1 style="color: red;">PRUEBA DE VIDA</h1>
        <p>Si ves esto, Chrome funciona.</p>
        <hr>
        <h2>${titulo}</h2>
        <pre>${JSON.stringify(datos, null, 2)}</pre>
      </body>
    </html>
  `;
};
module.exports = { generarPlantillaHtml };