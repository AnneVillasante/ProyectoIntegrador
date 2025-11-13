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
    const product = req.body;
    const id = await ProductoDao.create(product);
    res.json({ success: true, id });
  } catch (err) {
    console.error('PRODUCT CREATE ERROR:', err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const product = req.body;
    await ProductoDao.update(id, product);
    res.json({ success: true, message: 'Producto actualizado' });
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