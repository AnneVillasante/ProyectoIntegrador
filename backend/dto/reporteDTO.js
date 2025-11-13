class ReporteDTO {
  constructor({ idReporte, tipo, formato, fechaGeneracion, parametros, usuario, exportado }) {
    this.idReporte = idReporte;
    this.tipo = tipo;
    this.formato = formato || 'PDF';
    this.fechaGeneracion = fechaGeneracion;
    
    // Parsear parametros si es string, mantener si es objeto, null si no existe
    if (typeof parametros === 'string') {
      try {
        this.parametros = JSON.parse(parametros);
      } catch (e) {
        this.parametros = parametros;
      }
    } else if (parametros) {
      this.parametros = parametros;
    } else {
      this.parametros = null;
    }
    
    this.usuario = usuario || null;
    this.exportado = exportado || false;
  }
}

module.exports = ReporteDTO;

