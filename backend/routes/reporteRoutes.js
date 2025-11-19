const express = require('express');
const router = express.Router();
const UsuarioDao = require('../dao/usuarioDao');
const ProductoDao = require('../dao/productoDao');
// const VentaDao = require('../dao/ventaDao'); // Comentado temporalmente para evitar el error

module.exports = (jsreport) => {
  // POST /api/reportes/usuarios
  router.post('/usuarios', async (req, res) => {
    try {
      const usuarios = await UsuarioDao.findAll();
      const report = await jsreport.render({
        template: {
          content: `
            <html>
              <head><style>body { font-family: Arial; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; } th { background-color: #f2f2f2; }</style></head>
              <body>
                <h1>Reporte de Usuarios</h1>
                <p>Generado el: {{#formatDate now "DD/MM/YYYY HH:mm"}}{{/formatDate}}</p>
                <table>
                  <tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th></tr>
                  {{#each items}}
                  <tr><td>{{idUsuario}}</td><td>{{nombres}} {{apellidos}}</td><td>{{correo}}</td><td>{{rol}}</td></tr>
                  {{/each}}
                </table>
              </body>
            </html>`,
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          helpers: `function formatDate(date, format) { return require('moment')(date).format(format); }`
        },
        data: {
          items: usuarios,
          now: new Date()
        }
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_usuarios.pdf');
      res.send(report.content);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  });

  // POST /api/reportes/productos
  router.post('/productos', async (req, res) => {
    // Implementación similar a la de usuarios, pero obteniendo datos con ProductoDao.findAll()
    try {
      const productos = await ProductoDao.findAll();
      const report = await jsreport.render({
        template: {
          content: `
            <html>
              <head><style>body { font-family: Arial; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
              <body>
                <h1>Reporte de Productos</h1>
                <p>Generado el: {{#formatDate now "DD/MM/YYYY HH:mm"}}{{/formatDate}}</p>
                <table>
                  <tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>
                  {{#each items}}
                  <tr><td>{{idProducto}}</td><td>{{nombre}}</td><td>{{categoria}}</td><td>S/ {{precio}}</td><td>{{stock}}</td></tr>
                  {{/each}}
                </table>
              </body>
            </html>`,
          engine: 'handlebars',
          recipe: 'chrome-pdf',
          helpers: `function formatDate(date, format) { return require('moment')(date).format(format); }`
        },
        data: {
          items: productos,
          now: new Date()
        }
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte_productos.pdf');
      res.send(report.content);
    } catch (e) {
      console.error(e);
      res.status(500).send(e.message);
    }
  });

  // POST /api/reportes/ventas
  router.post('/ventas', async (req, res) => {
    // Funcionalidad deshabilitada temporalmente hasta que se cree el ventaDao.js
    res.status(501).json({
      error: 'Reporte de ventas no implementado. El archivo ventaDao.js no existe.'
    });
  });

  return router;
};
