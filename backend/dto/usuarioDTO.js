class UsuarioDto {
  constructor(user) {
    this.id = user.idUsuario;
    this.nombres = user.nombres;
    this.apellidos = user.apellidos;
    this.correo = user.correo;
    this.telefono = user.telefono;
    this.dni = user.dni;
    this.rol = user.rol;
    this.fotoPerfil = user.fotoPerfil;
  }
}

module.exports = UsuarioDto;


