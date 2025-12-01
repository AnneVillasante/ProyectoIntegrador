class Subcategoria {
  constructor(idSubcategoria, nombre, descripcion, imagen, idCategoria, genero = 'Unisex') {
    this.idSubcategoria = idSubcategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen || '/uploads/default_subcategory.png';
    this.idCategoria = idCategoria;
    this.genero = genero;
  }
}
module.exports = Subcategoria;
