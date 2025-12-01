const moment = require('moment');

const templates = {
  usuarios: {
    content: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            h1 { color: #333; }
            p { font-size: 10px; color: #777; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Usuarios</h1>
          <p>Generado el: {{formatDate now "DD/MM/YYYY HH:mm:ss"}} por {{usuario}}</p>
          <table>
            <tr><th>ID</th><th>Nombres</th><th>Apellidos</th><th>Correo</th><th>DNI</th><th>Rol</th><th>Es Cliente</th></tr>
            {{#each items}}
            <tr><td>{{this.ID}}</td><td>{{this.Nombres}}</td><td>{{this.Apellidos}}</td><td>{{this.Correo}}</td><td>{{this.DNI}}</td><td>{{this.Rol}}</td><td>{{this.["Tiene Cliente"]}}</td></tr>
            {{/each}}
          </table>
          <hr>
          <p>Total de Usuarios: {{totalUsuarios}} | Administradores: {{totalAdministradores}} | Clientes: {{totalClientes}}</p>
        </body>
      </html>`,
  },
  productos: {
    content: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            h1 { color: #333; }
            p { font-size: 10px; color: #777; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Productos</h1>
          <p>Generado el: {{formatDate now "DD/MM/YYYY HH:mm:ss"}} por {{usuario}}</p>
          <table>
            <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>
            {{#each items}}
            <tr><td>{{this.ID}}</td><td>{{this.Nombre}}</td><td>{{this.Categoría}}</td><td>{{this.Precio}}</td><td>{{this.Stock}}</td></tr>
            {{/each}}
          </table>
          <hr>
          <p>Total de Productos: {{totalProductos}} | Stock Total: {{totalStock}}</p>
        </body>
      </html>`,
  },
  ventas: {
    content: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; font-size: 12px; }
            h1 { color: #333; }
            p { font-size: 10px; color: #777; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte de Ventas</h1>
          <p>Generado el: {{formatDate now "DD/MM/YYYY HH:mm:ss"}} por {{usuario}}</p>
          <table>
            <tr><th>ID Pedido</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th># Productos</th></tr>
            {{#each items}}
            <tr><td>{{this.["ID Pedido"]}}</td><td>{{this.Fecha}}</td><td>{{this.Cliente}}</td><td>{{this.Estado}}</td><td>{{this.Total}}</td><td>{{this.["Cantidad Productos"]}}</td></tr>
            {{/each}}
          </table>
          <hr>
          <p>Total de Ventas: {{totalVentas}} | Monto Total: S/ {{totalMonto}}</p>
        </body>
      </html>`,
  },
};

const renderReport = (jsreport) => async (tipo, data) => {
  if (!templates[tipo]) {
    throw new Error(`La plantilla para el reporte de tipo "${tipo}" no existe.`);
  }

  return jsreport.render({
    template: { ...templates[tipo], engine: 'handlebars', recipe: 'chrome-pdf', helpers: `function formatDate(d, f) { return require('moment')(d).format(f); }` },
    data: { ...data, now: new Date() },
  });
};

module.exports = renderReport;