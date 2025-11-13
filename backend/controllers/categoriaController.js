const categoriaDAO = require('../dao/categoriaDAO');
const CategoriaDTO = require('../dto/categoriaDTO');

exports.getAll = async (req, res) => {
  try {
    const categorias = await categoriaDAO.getAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const categoria = new CategoriaDTO(req.body);
    const id = await categoriaDAO.create(categoria);
    res.status(201).json({ message: 'Categoría creada', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Actualizar categoría
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const categoria = new CategoriaDTO(req.body);

    const updated = await categoriaDAO.update(id, categoria);

    if (!updated) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría actualizada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Eliminar categoría
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await categoriaDAO.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json({ message: 'Categoría eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
