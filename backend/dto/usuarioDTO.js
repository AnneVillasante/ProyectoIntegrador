class UsuarioDto {
  constructor({ idUsuario = null, nombre = null, correo = null, rol = 'cliente' } = {}) {
    this.idUsuario = idUsuario;
    this.nombre = nombre;
    this.correo = correo;
    this.rol = rol || 'cliente';
  }
}
module.exports = UsuarioDto;


