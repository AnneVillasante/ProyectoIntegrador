// backend/services/jsreportService.js

const renderReport = (jsreport) => async (htmlContent) => {
  console.log('--- GENERANDO PDF (INTENTO SEGURO) ---');
  
  return jsreport.render({
    template: { 
      content: htmlContent, 
      engine: 'none', 
      recipe: 'chrome-pdf',
      chrome: {
        launchOptions: {
          // Estos argumentos son vitales para que funcione en servidores y Windows
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
        },
        // ELIMINADO: mediaType (causaba el error)
        // ELIMINADO: waitForJS (dejamos el default)
        
        // Márgenes seguros para evitar cortes
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        printBackground: true
      }
    }
  });
};

module.exports = renderReport;