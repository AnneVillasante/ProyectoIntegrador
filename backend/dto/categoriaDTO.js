class CategoriaDTO {
  constructor({ idCategoria, nombre, descripcion, imagen }) {
    this.idCategoria = idCategoria;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen = imagen;
  }
}
module.exports = CategoriaDTO;
