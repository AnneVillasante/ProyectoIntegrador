class ProductoDto {
  constructor({ idProducto, nombre, descripcion, idCategoria, imagen, precio, stock, idSubcategoria, categoria, subcategoria }) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.descripcion = descripcion || '';
    this.idCategoria = idCategoria;
    this.categoria = categoria || null;
    this.imagen = imagen;
    this.precio = precio;
    this.stock = stock;
    this.idSubcategoria = idSubcategoria;
    this.subcategoria = subcategoria || null;
  }
}

module.exports = ProductoDto;