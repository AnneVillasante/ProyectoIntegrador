// backend/server/staticServer.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const ProductService = require('../services/ProductService');

const staticApp = express();
const frontendRoot = path.join(__dirname, '../../frontend');

staticApp.use('/assets', express.static(path.join(frontendRoot, 'assets')));
staticApp.use('/pages', express.static(path.join(frontendRoot, 'pages')));
staticApp.use('/components', express.static(path.join(frontendRoot, 'components')));
staticApp.use('/frontend', express.static(frontendRoot));

staticApp.get('/', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'index.html'));
});
staticApp.get('/login', (req, res) => {
  res.sendFile(path.join(frontendRoot, 'pages', 'login.html'));
});

// Render de productos
staticApp.get('/productos', async (req, res) => {
  try {
    // Obtener la categoría de la query string
    const { categoria } = req.query;

    // 1. Obtener datos
    const products = await ProductService.getProductsForStaticRender(categoria);

    // 2. Generar HTML usando el método del servicio
    const cardsHtml = ProductService.generateProductCards(products);

    // 3. Insertarlo en la página base
    const filePath = path.join(frontendRoot, 'pages', 'productos.html');
    let html = await fs.readFile(filePath, 'utf-8');
    html = html.replace('<!-- PRODUCTS_PLACEHOLDER -->', cardsHtml)
               .replace('<h1 class="productos-title">Colección Destacada</h1>', `<h1 class="productos-title">${categoria ? `Categoría: ${categoria}` : 'Colección Destacada'}</h1>`);

    // 4. Enviar resultado final al navegador
    res.send(html);

  } catch (err) {
    console.error('Error render productos:', err);
    res.status(500).send('Error interno al mostrar productos');
  }
});


function startStatic() {
  const STATIC_PORT = process.env.STATIC_PORT || 3000;
  const staticServer = staticApp.listen(STATIC_PORT, () =>
    console.log(`Frontend estático escuchando en http://localhost:${STATIC_PORT}`)
  );
  return staticServer;
}

module.exports = { staticApp, startStatic };
