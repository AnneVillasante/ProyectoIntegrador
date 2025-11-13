const path = require("path");
const fs = require("fs");
const jsreport = require("jsreport");
const Reporte = require("../models/Reporte");

let jsreportInstance;

// Inicializa JSReport al iniciar el servidor
(async () => {
  jsreportInstance = await jsreport({ tempDirectory: path.join(__dirname, "../temp") }).init();
})();

// Crear un nuevo reporte y registrarlo
exports.generarReporte = async (req, res) => {
  try {
    const { nombre, tipo, usuario, datos } = req.body;

    // Renderiza el PDF con JSReport
    const report = await jsreportInstance.render({
      template: {
        content: `
          <h1 style="text-align:center;">Reporte Administrativo</h1>
          <p><strong>Nombre:</strong> {{nombre}}</p>
          <p><strong>Tipo:</strong> {{tipo}}</p>
          <p><strong>Usuario:</strong> {{usuario}}</p>
          <hr/>
          <h3>Datos:</h3>
          <pre>{{JSON.stringify(datos, null, 2)}}</pre>
        `,
        engine: "handlebars",
        recipe: "chrome-pdf",
      },
      data: { nombre, tipo, usuario, datos }
    });

    // Guarda el PDF generado
    const rutaArchivo = path.join(__dirname, `../reports/${nombre}.pdf`);
    fs.writeFileSync(rutaArchivo, report.content);

    // Registra en la base de datos
    const nuevoReporte = await Reporte.create({
      nombre,
      tipo,
      usuario,
      rutaArchivo
    });

    res.status(200).json({
      mensaje: "Reporte generado correctamente",
      reporte: nuevoReporte
    });
  } catch (error) {
    console.error("Error al generar reporte:", error);
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

// Listar reportes
exports.listarReportes = async (req, res) => {
  try {
    const reportes = await Reporte.findAll({ order: [["fechaGeneracion", "DESC"]] });
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error: "Error al listar reportes" });
  }
};
