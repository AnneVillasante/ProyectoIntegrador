/**
 * @fileoverview Controlador para las rutas de campanas.
 *
 * @version 1.0
 * @author Lunaria
 */

const { isProduction } = require('../config/cloudinary');
const CampanaService = require('../services/campanaService');

const obtenerTodas = async (req, res, next) => {
  try {
    const campanas = await CampanaService.obtenerTodas();
    res.status(200).json(campanas);
  } catch (error) {
    next(error);
  }
};

const obtenerPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campana = await CampanaService.obtenerPorId(id);
    if (!campana) {
      return res.status(404).json({ message: 'Campana no encontrada' });
    }
    res.status(200).json(campana);
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  try {
    // 1. Copiamos todos los campos de texto del cuerpo de la petición
    const data = { ...req.body };

    // 2. VERIFICACIÓN CLAVE: Si Multer subió una imagen, guardamos su URL
    if (req.file) {
      if (isProduction()) {
        data.imagen = req.file.path;
      } else {
        data.imagen = `/uploads/campanas/${req.file.filename}`;
      }
    }

    // 3. Enviamos el objeto completo (texto + url imagen) al servicio
    const nuevaCampana = await CampanaService.crear(data);
    res.status(201).json(nuevaCampana);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    // Mismo proceso para actualizar
    if (req.file) {
      if (isProduction()) {
        data.imagen = req.file.path;
      } else {
        data.imagen = `/uploads/campanas/${req.file.filename}`;
      }
    }
    // NOTA: Si no hay req.file, 'data.imagen' será undefined.
    // El servicio debe decidir si mantiene la imagen vieja o no.

    const campanaActualizada = await CampanaService.actualizar(id, data);
    if (!campanaActualizada) {
      return res.status(404).json({ message: 'Campana no encontrada' });
    }
    res.status(200).json(campanaActualizada);
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await CampanaService.eliminar(id);
    if (!resultado) {
      return res.status(404).json({ message: 'Campana no encontrada' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};