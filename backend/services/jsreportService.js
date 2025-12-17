// backend/services/jsreportService.js

const reportTemplates = require('../utils/reportTemplate');
const ticketTemplates = require('../utils/ticketTemplate');

const templates = { ...reportTemplates, ...ticketTemplates };

// Esta función es genérica. No cambia aunque agregues más reportes.
const renderReport = (jsreport) => async (tipo, data) => {
  // 1. Verificamos si la plantilla existe en el archivo importado
  if (!templates[tipo]) {
    throw new Error(`La plantilla para el reporte de tipo "${tipo}" no existe en los archivos de plantillas.`);
  }

  // 2. Renderizamos usando la plantilla encontrada y los datos que recibimos
  return jsreport.render({
    template: { 
      content: templates[tipo].content, // Usamos el HTML importado
      engine: 'handlebars', 
      recipe: 'chrome-pdf', 
      // Helper global para fechas
      helpers: `function formatDate(d, f) { 
        const moment = require('moment');
        return moment(d).format(f); 
      }` 
    },
    data: { ...data, now: new Date() }, // Insertamos los datos + fecha actual
  });
};

module.exports = renderReport;