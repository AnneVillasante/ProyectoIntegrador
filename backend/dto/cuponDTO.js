/**
 * @class CuponDTO
 * @description Objeto de transferencia de datos para cupones.
 */
class CuponDTO {
    constructor({ idCupon, codigo, descripcion, fechaExpiracion, tipoDescuento, valorDescuento, activo }) {
        this.idCupon = idCupon;
        this.codigo = codigo;
        this.descripcion = descripcion;
        // Formatear la fecha a YYYY-MM-DD para consistencia
        this.fechaExpiracion = fechaExpiracion ? new Date(fechaExpiracion).toISOString().split('T')[0] : null;
        this.tipoDescuento = tipoDescuento;
        this.valorDescuento = valorDescuento;
        this.activo = activo;
    }
}

module.exports = CuponDTO;


