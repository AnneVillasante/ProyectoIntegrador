class Reporte {
  constructor(idReporte, tipo, formato, fechaGeneracion, parametros, usuario, exportado) {
    this.idReporte = idReporte;
    this.tipo = tipo;
    this.formato = formato || 'PDF';
    this.fechaGeneracion = fechaGeneracion || new Date();
    this.parametros = parametros || null;
    this.usuario = usuario || null;
    this.exportado = exportado || false;
  }
}

module.exports = Reporte;
