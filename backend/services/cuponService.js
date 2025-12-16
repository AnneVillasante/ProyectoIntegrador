const cuponDAO = require('../dao/cuponDAO');
const CuponDTO = require('../dto/cuponDTO');

class CuponService {
    async getAllCoupons() {
        const cupones = await cuponDAO.findAll();
        return cupones.map(cupon => new CuponDTO(cupon));
    }

    async getCouponById(id) {
        const cupon = await cuponDAO.findById(id);
        return cupon ? new CuponDTO(cupon) : null;
    }

    async createCoupon(cuponData) {
        // Validación: Asegurarse de que el código no exista ya
        const existingCoupon = await cuponDAO.findByCode(cuponData.codigo);
        if (existingCoupon) {
            throw new Error('El código del cupón ya existe.');
        }

        // Validación: El valor del descuento debe ser positivo
        if (cuponData.valorDescuento <= 0) {
            throw new Error('El valor del descuento debe ser un número positivo.');
        }

        const newCouponId = await cuponDAO.create(cuponData);
        const newCoupon = await cuponDAO.findById(newCouponId);
        return new CuponDTO(newCoupon);
    }

    async updateCoupon(id, cuponData) {
        // Validación: Asegurarse de que el nuevo código no esté en uso por otro cupón
        const existingCoupon = await cuponDAO.findByCode(cuponData.codigo);
        if (existingCoupon && existingCoupon.idCupon !== parseInt(id)) {
            throw new Error('El código del cupón ya está en uso por otro cupón.');
        }

        const success = await cuponDAO.update(id, cuponData);
        if (!success) {
            throw new Error('Cupón no encontrado o no se pudo actualizar.');
        }
        const updatedCoupon = await cuponDAO.findById(id);
        return new CuponDTO(updatedCoupon);
    }

    async deleteCoupon(id) {
        const success = await cuponDAO.delete(id);
        if (!success) {
            throw new Error('Cupón no encontrado o no se pudo eliminar.');
        }
        return { success: true, message: 'Cupón eliminado correctamente.' };
    }

    /**
     * Valida un cupón para su uso en el carrito.
     * @param {string} codigo - El código del cupón a validar.
     * @returns {Promise<object>} - Un objeto con el descuento y un mensaje.
     */
    async validateCoupon(codigo) {
        if (!codigo) {
            throw new Error('No se proporcionó un código de cupón.');
        }

        const cupon = await cuponDAO.findByCode(codigo.toUpperCase());

        if (!cupon) {
            throw new Error('El cupón no existe.');
        }
        if (!cupon.activo) {
            throw new Error('El cupón no está activo.');
        }
        if (new Date(cupon.fechaExpiracion) < new Date()) {
            throw new Error('El cupón ha expirado.');
        }

        // Si todas las validaciones pasan, devolvemos el descuento.
        // NOTA: Por ahora, solo devolvemos montos fijos. La lógica para porcentajes se puede añadir aquí.
        return { descuento: cupon.valorDescuento, mensaje: `Cupón "${cupon.codigo}" aplicado con éxito.` };
    }

    /**
     * Desactiva cupones que hayan pasado su fecha de vencimiento.
     * @returns {Promise<object>} Objeto con el recuento de cupones desactivados.
     */
    async desactivarCuponesExpirados() {
        // La lógica exacta dependerá de tu DAO, pero la idea es:
        const now = new Date();
        
        // Asumo que tu DAO tiene un método para actualizar masivamente
        const result = await cuponDAO.updateExpiredStatus(now); 
        
        // Retornamos el número de filas afectadas
        return { count: result.affectedRows || 0 }; 
    }
}

module.exports = new CuponService();
