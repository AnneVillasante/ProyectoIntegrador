class Categoria {
  constructor(idCategoria, nombre, descripcion, imagen) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen || '/uploads/default_category.png';
  }
}
module.exports = Categoria;
