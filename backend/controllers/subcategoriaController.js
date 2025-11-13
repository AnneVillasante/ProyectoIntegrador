const subcategoriaDAO = require('../dao/subcategoriaDAO');
const SubcategoriaDTO = require('../dto/subcategoriaDTO');

exports.getAll = async (req, res) => {
  try {
    const subcategorias = await subcategoriaDAO.getAll();
    res.json(subcategorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const subcategoria = new SubcategoriaDTO(req.body);
    const id = await subcategoriaDAO.create(subcategoria);
    res.status(201).json({ message: 'Subcategoría creada', id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    await subcategoriaDAO.update(req.params.id, new SubcategoriaDTO(req.body));
    res.json({ message: 'Subcategoría actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await subcategoriaDAO.delete(req.params.id);
    res.json({ message: 'Subcategoría eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const subcategoria = await subcategoriaDAO.getById(req.params.id);
    res.json(subcategoria);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const subcategorias = await subcategoriaDAO.getByCategoria(idCategoria);
    res.json(subcategorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};