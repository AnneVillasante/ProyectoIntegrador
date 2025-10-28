class Producto {
  constructor(idProducto, nombre, imagen, categoria, precio, stock) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.imagen = imagen;
    this.categoria = categoria;
    this.precio = precio;
    this.stock = stock;
  }
}

module.exports = Producto;
