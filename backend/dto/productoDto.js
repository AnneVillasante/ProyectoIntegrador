class ProductoDto {
    constructor(idProducto, nombre, categoria, precio, stock) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }
}

module.exports = ProductoDto;