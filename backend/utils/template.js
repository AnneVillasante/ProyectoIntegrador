// Úsala en tu servicio de reportes antes de llamar a la generación del PDF
const generarPlantillaHtml = (titulo, datos) => {
    // Si no hay datos, mostramos un mensaje
    if (!datos || datos.length === 0) {
        return `<h1>${titulo}</h1><p>No hay datos para mostrar.</p>`;
    }

    // Obtenemos las columnas dinámicamente basándonos en el primer objeto
    const columnas = Object.keys(datos[0]);

    // Creamos las cabeceras de la tabla
    const headers = columnas.map(col => 
        `<th style="background-color: #4CAF50; color: white; padding: 10px; text-transform: capitalize;">${col}</th>`
    ).join('');

    // Creamos las filas de la tabla
    const filas = datos.map(row => {
        const celdas = columnas.map(col => `<td style="border: 1px solid #ddd; padding: 8px;">${row[col]}</td>`).join('');
        return `<tr>${celdas}</tr>`;
    }).join('');

    // Retornamos el HTML completo
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            tr:hover { background-color: #ddd; }
        </style>
    </head>
    <body>
        <h1>${titulo}</h1>
        <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
        <table>
            <thead>
                <tr>${headers}</tr>
            </thead>
            <tbody>
                ${filas}
            </tbody>
        </table>
    </body>
    </html>
    `;
};

module.exports = { generarPlantillaHtml };