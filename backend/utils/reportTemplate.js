// backend/utils/reportTemplates.js

// Estilos compartidos para no repetir código
const styles = {
  admin: `body { font-family: Arial, sans-serif; font-size: 12px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; font-weight: bold; }`,
  ticket: `body { font-family: 'Courier New', monospace; font-size: 10px; width: 58mm; margin: 0; padding: 5px; } .center { text-align: center; } .line { border-bottom: 1px dashed #000; margin: 5px 0; } table { width: 100%; } td { padding: 2px 0; } .total { font-weight: bold; font-size: 12px; text-align: right; }`
};

module.exports = {
  // 1. REPORTES ADMINISTRATIVOS (Ya existentes)
  usuarios: {
    content: `
      <html><head><style>${styles.admin}</style></head><body>
        <h1>Reporte de Usuarios</h1>
        <p>Generado: {{formatDate now "DD/MM/YYYY HH:mm:ss"}}</p>
        <table>
          <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
          {{#each items}}
          <tr><td>{{this.ID}}</td><td>{{this.Nombres}} {{this.Apellidos}}</td><td>{{this.Correo}}</td><td>{{this.Rol}}</td></tr>
          {{/each}}
        </table>
        <p>Total: {{totalUsuarios}}</p>
      </body></html>`
  },
  productos: {
    content: `
      <html><head><style>${styles.admin}</style></head><body>
        <h1>Reporte de Productos</h1>
        <p>Generado: {{formatDate now "DD/MM/YYYY HH:mm:ss"}}</p>
        <table>
          <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>
          {{#each items}}
          <tr><td>{{this.ID}}</td><td>{{this.Nombre}}</td><td>{{this.Categoría}}</td><td>{{this.Precio}}</td><td>{{this.Stock}}</td></tr>
          {{/each}}
        </table>
      </body></html>`
  },
  ventas: {
    content: `
      <html><head><style>${styles.admin}</style></head><body>
        <h1>Reporte General de Ventas</h1>
        <p>Generado: {{formatDate now "DD/MM/YYYY HH:mm:ss"}}</p>
        <table>
          <tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr>
          {{#each items}}
          <tr><td>{{this.["ID Pedido"]}}</td><td>{{this.Fecha}}</td><td>{{this.Cliente}}</td><td>{{this.Total}}</td></tr>
          {{/each}}
        </table>
        <p>Monto Total: S/ {{totalMonto}}</p>
      </body></html>`
  },

  // 2. BOLETA DE VENTA (Para enviar por correo - Diseño Formal)
  boleta: {
    content: `
      <html>
        <head>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 30px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .company-info h1 { margin: 0; color: #4a4a4a; }
            .invoice-details { text-align: right; }
            .client-info { margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f8f9fa; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
            td { padding: 12px; border-bottom: 1px solid #eee; }
            .totals { margin-top: 30px; text-align: right; }
            .total-row { font-size: 18px; font-weight: bold; color: #2c3e50; }
            .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>LUNARIA THREADS</h1>
              <p>Ropa y Disfraces con Estilo</p>
              <p>RUC: 20123456789</p>
            </div>
            <div class="invoice-details">
              <h2>BOLETA DE VENTA</h2>
              <p><strong>N°:</strong> {{numeroPedido}}</p>
              <p><strong>Fecha:</strong> {{formatDate fecha "DD/MM/YYYY"}}</p>
            </div>
          </div>

          <div class="client-info">
            <h3>Cliente:</h3>
            <p>{{clienteNombre}}</p>
            <p>DNI/RUC: {{clienteDocumento}}</p>
            <p>{{clienteCorreo}}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th style="text-align: center;">Cant.</th>
                <th style="text-align: right;">P. Unit</th>
                <th style="text-align: right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {{#each items}}
              <tr>
                <td>{{this.nombre}}</td>
                <td style="text-align: center;">{{this.cantidad}}</td>
                <td style="text-align: right;">S/ {{this.precioUnitario}}</td>
                <td style="text-align: right;">S/ {{this.subtotal}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>

          <div class="totals">
            <p>Subtotal: S/ {{subtotalVenta}}</p>
            <p>IGV (18%): S/ {{impuestos}}</p>
            <p class="total-row">TOTAL: S/ {{totalVenta}}</p>
          </div>

          <div class="footer">
            <p>Gracias por tu compra. Para cambios o devoluciones conserva este documento.</p>
            <p>www.lunariathreads.com</p>
          </div>
        </body>
      </html>`
  },

  // 3. TICKET TÉRMICO (Para imprimir - 58mm/80mm)
  ticket: {
    content: `
      <html>
        <head>
          <style>
            ${styles.ticket}
          </style>
        </head>
        <body>
          <div class="center">
            <h2>LUNARIA THREADS</h2>
            <p>RUC: 20123456789</p>
            <p>Av. Siempre Viva 123</p>
          </div>
          <div class="line"></div>
          <p>Ticket #: {{numeroPedido}}</p>
          <p>Fecha: {{formatDate fecha "DD/MM/YYYY HH:mm"}}</p>
          <p>Cli: {{clienteNombre}}</p>
          <div class="line"></div>
          <table>
            {{#each items}}
            <tr>
              <td colspan="3">{{this.nombre}}</td>
            </tr>
            <tr>
              <td>{{this.cantidad}} x {{this.precioUnitario}}</td>
              <td style="text-align: right;">S/ {{this.subtotal}}</td>
            </tr>
            {{/each}}
          </table>
          <div class="line"></div>
          <p class="total">TOTAL: S/ {{totalVenta}}</p>
          <div class="line"></div>
          <div class="center">
            <p>¡Gracias por su preferencia!</p>
            <p>Conserve este ticket</p>
          </div>
        </body>
      </html>`
  }
};