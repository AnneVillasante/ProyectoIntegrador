class ProductoDto {
  constructor({ idProducto = null, nombre = '', categoria = '', precio = 0.00, stock = 0 } = {}) {
    this.idProducto = idProducto;
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = Number(precio);
    this.stock = Number(stock);
  }
}

module.exports = ProductoDto;