const ProductoDao = require('../dao/productoDAO');
const ProductoDto = require('../dto/productoDTO');

exports.list = async (req, res) => {
  try {
    const products = await ProductoDao.getAll();
    res.json(products.map(p => new ProductoDto(p)));
  } catch (err) {
    console.error('PRODUCT LIST ERROR:', err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.get = async (req, res) => {
  try {
    const product = await ProductoDao.getById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(new ProductoDto(product));
  } catch (err) {
    console.error('PRODUCT GET ERROR:', err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

exports.create = async (req, res) => {
  try {
    const productData = { ...req.body };
    if (req.file) {
      // Guardamos la URL segura que Cloudinary proporciona
      productData.imagen = req.file.path;
    }

    const id = await ProductoDao.create(productData);
    res.json({ success: true, id });
  } catch (err) {
    console.error('PRODUCT CREATE ERROR:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = { ...req.body };

    if (req.file) {
      // Si se sube un nuevo archivo, guardamos la nueva URL de Cloudinary
      productData.imagen = req.file.path;
    } else {
      // Conservar la imagen existente si no se sube una nueva
      const productoExistente = await ProductoDao.getById(id);
      if (productoExistente) {
        productData.imagen = productoExistente.imagen;
      }
    }

    const updated = await ProductoDao.update(id, productData);
    if (!updated) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ success: true, message: 'Producto actualizado correctamente' });
  } catch (err) {
    console.error('PRODUCT UPDATE ERROR:', err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await ProductoDao.delete(id);
    res.json({ success: true, message: 'Producto eliminado' });
  } catch (err) {
    console.error('PRODUCT DELETE ERROR:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};