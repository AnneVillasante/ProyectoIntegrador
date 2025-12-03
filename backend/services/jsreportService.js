// backend/services/jsreportService.js

const renderReport = (jsreport) => async (htmlContent) => {
  return jsreport.render({
    template: { 
      content: htmlContent, 
      engine: 'none', // 'none' porque ya le enviamos el HTML procesado
      recipe: 'chrome-pdf' 
    }
  });
};

module.exports = renderReport;