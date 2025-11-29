class CarritoItemDTO {
    constructor(item) {
        this.idDetalleCarrito = item.idDetalleCarrito;
        this.idProducto = item.idProducto;
        this.nombreProducto = item.nombreProducto; // Se obtendrá al unir con la tabla de productos
        this.imagenProducto = item.imagenProducto; // Se obtendrá al unir con la tabla de productos
        this.cantidad = item.cantidad;
        this.precioUnitario = parseFloat(item.precioUnitario);
        this.subtotal = parseFloat(item.cantidad * item.precioUnitario).toFixed(2);
    }
}

class CarritoDTO {
    constructor(carritoData, items = []) {
        this.idCarrito = carritoData.idCarrito;
        this.idCliente = carritoData.idCliente;
        this.fechaCreacion = carritoData.fechaCreacion; // Correcto, se alinea con la tabla carrito
        this.fechaActualizacion = carritoData.fechaActualizacion; // Correcto, se alinea con la tabla carrito
        this.items = items.map(item => new CarritoItemDTO(item));
        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0).toFixed(2);
    }
}

module.exports = { CarritoItemDTO, CarritoDTO };