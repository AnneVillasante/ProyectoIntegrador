CREATE TABLE usuario (
  idUsuario INT NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  dni VARCHAR(8) NOT NULL,
  telefono VARCHAR(9) NOT NULL,
  foto_perfil VARCHAR(255),
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('Administrador','Cliente') NOT NULL,
  PRIMARY KEY (idUsuario),
  UNIQUE (correo),
  CHECK (regexp_like(dni, '^[0-9]{8}$')),
  CHECK (regexp_like(telefono, '^9[0-9]{8}$'))
);

CREATE TABLE categoria (
  idCategoria INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  PRIMARY KEY (idCategoria),
  UNIQUE (nombre)
);

CREATE TABLE campana (
  idCampana INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100),
  imagen VARCHAR(255),
  descripcion TEXT,
  fechaInicio DATE NOT NULL,
  fechaFin DATE NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (idCampana)
);

CREATE TABLE reporte (
  idReporte INT NOT NULL AUTO_INCREMENT,
  tipo VARCHAR(50),
  formato VARCHAR(20) DEFAULT 'PDF',
  fechaGeneracion DATETIME DEFAULT CURRENT_TIMESTAMP,
  parametros TEXT,
  usuario VARCHAR(100),
  exportado BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (idReporte)
);

CREATE TABLE cupon (
  idCupon INT NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  fechaExpiracion DATE NOT NULL,
  tipoDescuento ENUM('Porcentaje', 'MontoFijo') NOT NULL,
  valorDescuento DECIMAL(10,2) NOT NULL,
  montoMinimoCompra DECIMAL(10,2) DEFAULT 0.00,
  limiteUsos INT DEFAULT NULL COMMENT 'NULL significa usos ilimitados',
  activo BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (idCupon)
);
CREATE TABLE subcategoria (
  idSubcategoria INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  imagen VARCHAR(255),
  idCategoria INT,
  genero ENUM('Hombre','Mujer','Unisex') DEFAULT 'Unisex',
  PRIMARY KEY (idSubcategoria),
  KEY (idCategoria),
  FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
CREATE TABLE cliente (
  idCliente INT NOT NULL AUTO_INCREMENT,
  nombres VARCHAR(100) NOT NULL,
  apellidos VARCHAR(100) NOT NULL,
  dni VARCHAR(20),
  correo VARCHAR(100),
  telefono VARCHAR(20),
  direccion_predeterminada VARCHAR(255),
  fecha_registro DATETIME NOT NULL,
  fk_idUsuario INT,
  PRIMARY KEY (idCliente),
  UNIQUE (dni),
  UNIQUE (correo),
  UNIQUE (fk_idUsuario),
  FOREIGN KEY (fk_idUsuario) REFERENCES usuario(idUsuario)
    ON DELETE SET NULL
);
CREATE TABLE producto (
  idProducto INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  idCategoria INT,
  imagen VARCHAR(255),
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  idSubcategoria INT,
  PRIMARY KEY (idProducto),
  KEY (idCategoria),
  KEY (idSubcategoria),
  FOREIGN KEY (idCategoria) REFERENCES categoria(idCategoria)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  FOREIGN KEY (idSubcategoria) REFERENCES subcategoria(idSubcategoria)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
CREATE TABLE promocion (
  idPromocion INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(100),
  descripcion TEXT,
  fechaInicio DATE,
  fechaFin DATE,
  idCampana INT,
  tipoDescuento ENUM('Porcentaje','MontoFijo') NOT NULL DEFAULT 'Porcentaje',
  valorDescuento DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  montoMinimoCompra DECIMAL(10,2) DEFAULT 0.00,
  activo BOOLEAN DEFAULT TRUE,
  -- Claves foráneas para el alcance de la promoción
  idCategoriaAplicable INT DEFAULT NULL,
  idSubcategoria INT DEFAULT NULL,
  idProducto INT DEFAULT NULL,
  PRIMARY KEY (idPromocion),
  KEY (idCampana),
  KEY (idCategoriaAplicable),
  KEY (idSubcategoria),
  KEY (idProducto),
  FOREIGN KEY (idCampana) REFERENCES campana(idCampana),
  FOREIGN KEY (idCategoriaAplicable) REFERENCES categoria(idCategoria),
  FOREIGN KEY (idSubcategoria) REFERENCES subcategoria(idSubcategoria),
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);
CREATE TABLE usuariopromocion (
  idUsuario INT NOT NULL,
  idPromocion INT NOT NULL,
  estado ENUM('Pendiente','Usado') DEFAULT 'Pendiente',
  fechaUso DATETIME,
  PRIMARY KEY (idUsuario, idPromocion),
  KEY (idPromocion),
  FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario),
  FOREIGN KEY (idPromocion) REFERENCES promocion(idPromocion)
);
CREATE TABLE carrito (
  idCarrito INT NOT NULL AUTO_INCREMENT,
  idCliente INT NOT NULL,
  fechaCreacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (idCarrito),
  KEY (idCliente),
  FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
);
CREATE TABLE carritodetalle (
  idDetalleCarrito INT NOT NULL AUTO_INCREMENT,
  idCarrito INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (idDetalleCarrito),
  KEY (idCarrito),
  KEY (idProducto),
  FOREIGN KEY (idCarrito) REFERENCES carrito(idCarrito),
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);
CREATE TABLE pedido (
  idPedido INT NOT NULL AUTO_INCREMENT,
  idCliente INT NOT NULL,
  fecha DATE NOT NULL,
  estado ENUM('Procesando','pendiente','pagado','fallido','entregado','cancelado') NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  metodoEntrega VARCHAR(50),
  direccionEntrega VARCHAR(255),
  metodoPago VARCHAR(50),
  PRIMARY KEY (idPedido),
  KEY (idCliente),
  FOREIGN KEY (idCliente) REFERENCES cliente(idCliente)
);
CREATE TABLE detallepedido (
  idDetallePedido INT NOT NULL AUTO_INCREMENT,
  idPedido INT NOT NULL,
  idProducto INT NOT NULL,
  precioUnitario DECIMAL(10,2) NOT NULL,
  cantidad INT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (idDetallePedido),
  KEY (idPedido),
  KEY (idProducto),
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido),
  FOREIGN KEY (idProducto) REFERENCES producto(idProducto)
);
CREATE TABLE devolucion (
  idDevolucion INT NOT NULL AUTO_INCREMENT,
  idPedido INT NOT NULL,
  motivo TEXT,
  fechaSolicitud DATE NOT NULL,
  estado ENUM('solicitada','aceptada','rechazada','reembolsada') NOT NULL,
  montoReembolsado DECIMAL(10,2),
  PRIMARY KEY (idDevolucion),
  KEY (idPedido),
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido)
);
CREATE TABLE factura (
  idFactura INT NOT NULL AUTO_INCREMENT,
  idPedido INT NOT NULL,
  fechaEmision DATE NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  numeroFactura VARCHAR(50),
  urlDocumento VARCHAR(255),
  PRIMARY KEY (idFactura),
  UNIQUE (idPedido),
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido)
);
CREATE TABLE pago (
  idPago INT NOT NULL AUTO_INCREMENT,
  idPedido INT NOT NULL,
  metodoPago VARCHAR(50),
  monto INT NOT NULL,
  fechaPago DATE NOT NULL,
  estadoTransaccion VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  PRIMARY KEY (idPago),
  UNIQUE (idPedido),
  FOREIGN KEY (idPedido) REFERENCES pedido(idPedido)
);
CREATE TABLE logactividad (
  idLog INT NOT NULL AUTO_INCREMENT,
  idUsuario INT NOT NULL,
  accion VARCHAR(255),
  fechaHora DATETIME NOT NULL,
  descripcion TEXT,
  PRIMARY KEY (idLog),
  KEY (idUsuario),
  FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);
