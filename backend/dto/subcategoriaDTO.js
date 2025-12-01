class SubcategoriaDTO {
  constructor({ idSubcategoria, nombre, descripcion, imagen, idCategoria, genero }) {
    this.idSubcategoria = idSubcategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.idCategoria = idCategoria;
    this.genero = genero || 'Unisex';
  }
}
module.exports = SubcategoriaDTO;
