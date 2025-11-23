const path = require('path');

class Producto {
  constructor(idProducto, nombre, descripcion, imagen, precio, stock, idCategoria = null, idSubcategoria = null) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.stock = stock;
    this.idCategoria = idCategoria;
    this.idSubcategoria = idSubcategoria;

    this.imagen = imagen || 'uploads/default_product.png';
  }
}

module.exports = Producto;
