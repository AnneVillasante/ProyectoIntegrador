// backend/utils/reportTemplate.js
const fs = require('fs');
const path = require('path');
const ticketTemplate = require('./ticketTemplate');

// 1. CONFIGURACIÓN DE RUTAS Y LECTURA DE ARCHIVOS
// Usamos path.join para encontrar el archivo sin importar en qué sistema operativo estés
const cssPath = path.join(__dirname, 'reportes.css'); 

// Leemos el archivo. Si no existe, usamos una cadena vacía para que no rompa el servidor.
let stylesBase = '';
try {
  stylesBase = fs.readFileSync(cssPath, 'utf8');
} catch (error) {
  console.error('Advertencia: No se encontró backend/utils/reportes.css. Usando estilos por defecto.');
  // Aquí podrías poner un string de respaldo si quisieras
}

// Configuración de marca (Logo, colores opcionales para usar en HTML si no están en CSS)
const brand = {
    logoBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" // Pega tu logo largo aquí
};

module.exports = {
  // 1. REPORTES ADMINISTRATIVOS
  usuarios: {
    content: `
      <html>
        <head>
          <style>${stylesBase}</style>
        </head>
        <body>
            <div class="header-container">
                <div class="logo-section"><h1>LUNARIA THREADS</h1></div>
                <div class="company-details"><p>Reporte de Usuarios</p><p>{{formatDate now "DD/MM/YYYY"}}</p></div>
            </div>
            
            <div class="section-title">Listado de Usuarios</div>
            
            <table>
              <thead><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr></thead>
              <tbody>
              {{#each items}}
              <tr><td>{{this.ID}}</td><td>{{this.Nombres}} {{this.Apellidos}}</td><td>{{this.Correo}}</td><td>{{this.Rol}}</td></tr>
              {{/each}}
              </tbody>
            </table>
            <p style="text-align: right;">Total: {{totalUsuarios}}</p>
        </body>
      </html>`
  },

  productos: {
    content: `
      <html>
        <head><style>${stylesBase}</style></head>
        <body>
            <div class="header-container">
                <div class="logo-section"><h1>LUNARIA THREADS</h1></div>
                <div class="company-details"><p>Inventario</p><p>{{formatDate now "DD/MM/YYYY"}}</p></div>
            </div>
            <div class="section-title">Reporte de Productos</div>
            <table>
              <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead>
              <tbody>
              {{#each items}}
              <tr><td>{{this.ID}}</td><td>{{this.Nombre}}</td><td>{{this.Categoría}}</td><td>S/ {{this.Precio}}</td><td>{{this.Stock}}</td></tr>
              {{/each}}
              </tbody>
            </table>
        </body>
      </html>`
  },

  ventas: {
    content: `
      <html>
        <head><style>${stylesBase}</style></head>
        <body>
            <div class="header-container">
                <div class="logo-section"><h1>LUNARIA THREADS</h1></div>
                <div class="company-details"><p>Reporte de Ventas</p><p>{{formatDate now "DD/MM/YYYY"}}</p></div>
            </div>
            <div class="section-title">Resumen General</div>
            <table>
              <thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr></thead>
              <tbody>
              {{#each items}}
              <tr><td>{{this.["ID Pedido"]}}</td><td>{{this.Fecha}}</td><td>{{this.Cliente}}</td><td>S/ {{this.Total}}</td></tr>
              {{/each}}
              </tbody>
            </table>
            <div class="total-box">
                <div class="total-row">Total: S/ {{totalMonto}}</div>
            </div>
        </body>
      </html>`
  },

  // 2. BOLETA DE VENTA
  boleta: {
    content: `
      <html>
        <head>
          <style>${stylesBase}</style>
        </head>
        <body>
          <div class="header-container">
            <div class="logo-section">
               <h1>LUNARIA THREADS</h1>
            </div>
            <div class="company-details">
              <h2>BOLETA DE VENTA</h2>
              <p>RUC: 20123456789</p>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px; background: #fafafa; padding: 15px;">
            <div>
                <strong>Cliente:</strong> {{clienteNombre}}<br>
                {{clienteDocumento}}
            </div>
            <div style="text-align: right;">
                <strong>Pedido #{{numeroPedido}}</strong><br>
                {{formatDate fecha "DD/MM/YYYY"}}
            </div>
          </div>

          <table>
            <thead>
              <tr><th>Producto</th><th style="text-align: center;">Cant.</th><th style="text-align: right;">P. Unit</th><th style="text-align: right;">Total</th></tr>
            </thead>
            <tbody>
              {{#each items}}
              <tr>
                <td>{{this.nombre}}</td>
                <td style="text-align: center;">{{this.cantidad}}</td>
                <td style="text-align: right;">{{this.precioUnitario}}</td>
                <td style="text-align: right;">{{this.subtotal}}</td>
              </tr>
              {{/each}}
            </tbody>
          </table>

          <div class="total-box">
            <p>Subtotal: {{subtotalVenta}}</p>
            <p>IGV: {{impuestos}}</p>
            <div class="total-row">TOTAL: S/ {{totalVenta}}</div>
          </div>
          
          <div class="footer">www.lunariathreads.com</div>
        </body>
      </html>`
  },
  
  // Importamos y mezclamos el template del ticket para mantener compatibilidad
  ...ticketTemplate
};