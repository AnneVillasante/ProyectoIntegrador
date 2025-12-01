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
    const categoriaData = { ...req.body };
    // Si se subió un archivo, Multer lo pone en req.file
    if (req.file) {
      // Guardamos la ruta relativa que genera Multer
      categoriaData.imagen = req.file.path.replace(/\\/g, '/');
    }
    const categoria = new CategoriaDTO(categoriaData);
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
    const categoriaData = { ...req.body };

    // Si se sube una nueva imagen, la usamos
    if (req.file) {
      categoriaData.imagen = req.file.path.replace(/\\/g, '/');
    } else {
      // Si no se sube una nueva imagen, debemos conservar la existente.
      const categoriaExistente = await categoriaDAO.getById(id);
      if (categoriaExistente) {
        categoriaData.imagen = categoriaExistente.imagen;
      }
    }

    const updated = await categoriaDAO.update(id, new CategoriaDTO(categoriaData));
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
