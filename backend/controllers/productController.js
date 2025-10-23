const ProductoDao = require('../dao/productoDao');
const ProductoDto = require('../dto/productoDto');

exports.list = async (req, res) => {
  try {
    const products = await ProductoDao.getAllProducts();
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