// backend/utils/ticketTemplate.js

// Estilos específicos para tickets térmicos de 58mm
const stylesTicket = `
  @page {
    size: 58mm auto;
    margin: 0;
  }
  body { font-family: 'Courier New', monospace; width: 58mm; margin: 0; padding: 5px; font-size: 11px; } 
  .center { text-align: center; } 
  .line { border-bottom: 1px dashed #000; margin: 5px 0; } 
  table { width: 100%; } 
  td { vertical-align: top; } 
  .total-big { font-size: 14px; font-weight: bold; text-align: right; }
`;

module.exports = {
  ticket: {
    content: `
      <html>
        <head>
            <style>${stylesTicket}</style>
        </head>
        <body>
          <div class="center">
            <h2>LUNARIA</h2>
            <p>Ticket #{{numeroPedido}}</p>
          </div>
          <div class="line"></div>
          <table>
            {{#each items}}
            <tr><td colspan="2">{{this.nombre}}</td></tr>
            <tr><td>{{this.cantidad}} x {{this.precioUnitario}}</td><td style="text-align: right;">{{this.subtotal}}</td></tr>
            {{/each}}
          </table>
          <div class="line"></div>
          <p class="total-big">TOTAL: S/ {{totalVenta}}</p>
          <div class="center"><p>Gracias por su compra</p></div>
        </body>
      </html>`
  }
};
