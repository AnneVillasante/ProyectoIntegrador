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

    if (imagen) {
      if (imagen.startsWith('http')) this.imagen = imagen;
      else this.imagen = path.join('/uploads/', imagen);
    } else {
      this.imagen = '/uploads/default_product.png';
    }
  }
}

module.exports = Producto;
