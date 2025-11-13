class ProductoDto {
  constructor({ idProducto, nombre, descripcion, idCategoria, imagen, precio, stock, idSubcategoria }) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idCategoria = idCategoria;
    this.imagen = imagen;
    this.precio = precio;
    this.stock = stock;
    this.idSubcategoria = idSubcategoria;
  }
}

module.exports = ProductoDto;