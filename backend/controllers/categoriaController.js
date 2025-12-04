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
    
    // 1. Si hay archivo, usamos la URL de Cloudinary
    if (req.file) {
      categoriaData.imagen = req.file.path;
    } else {
      // 2. Si no hay archivo, aseguramos que sea null (evita error 'undefined')
      categoriaData.imagen = null; 
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

    // 1. Lógica de actualización de imagen
    if (req.file) {
      categoriaData.imagen = req.file.path;
    } else {
      // Si no suben foto nueva, NO tocamos el campo 'imagen' en el objeto data,
      // pero debemos asegurarnos de que el DAO no reciba 'undefined' si lo espera.
      // La mejor estrategia aquí es recuperar la vieja si es necesario, 
      // o dejar que el DAO maneje la actualización parcial.
      const categoriaExistente = await categoriaDAO.getById(id);
      categoriaData.imagen = categoriaExistente ? categoriaExistente.imagen : null;
    }
    // Aseguramos que nada sea undefined
    const dto = new CategoriaDTO(categoriaData);
    // IMPORTANTE: Verifica que tu DTO no transforme 'null' en 'undefined'

    const updated = await categoriaDAO.update(id, dto);
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
