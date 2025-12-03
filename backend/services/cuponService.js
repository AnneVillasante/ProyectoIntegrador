const cuponDAO = require('../daos/cuponDAO');
const CuponDTO = require('../dtos/cuponDTO');

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
}

module.exports = new CuponService();
