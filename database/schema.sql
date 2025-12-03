/*CREATE TABLE `campana` (
  `idCampana` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`idCampana`)
);
CREATE TABLE `carrito` (
  `idCarrito` int NOT NULL AUTO_INCREMENT,
  `idCliente` int NOT NULL,
  `fechaCreacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fechaActualizacion` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`idCarrito`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
);
CREATE TABLE `carritodetalle` (
  `idDetalleCarrito` int NOT NULL AUTO_INCREMENT,
  `idCarrito` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idDetalleCarrito`),
  KEY `idCarrito` (`idCarrito`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `carritodetalle_ibfk_1` FOREIGN KEY (`idCarrito`) REFERENCES `carrito` (`idCarrito`),
  CONSTRAINT `carritodetalle_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
);
CREATE TABLE `categoria` (
  `idCategoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idCategoria`),
  UNIQUE KEY `nombre` (`nombre`)
);
CREATE TABLE `cliente` (
  `idCliente` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `direccion_predeterminada` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime NOT NULL,
  `fk_idUsuario` int DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `correo` (`correo`),
  UNIQUE KEY `fk_idUsuario` (`fk_idUsuario`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`fk_idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL
);
CREATE TABLE `detallepedido` (
  `idDetallePedido` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idDetallePedido`),
  KEY `idPedido` (`idPedido`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `detallepedido_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`),
  CONSTRAINT `detallepedido_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
);
CREATE TABLE `devolucion` (
  `idDevolucion` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `motivo` text,
  `fechaSolicitud` date NOT NULL,
  `estado` enum('solicitada','aceptada','rechazada','reembolsada') NOT NULL,
  `montoReembolsado` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`idDevolucion`),
  KEY `idPedido` (`idPedido`),
  CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`)
);
CREATE TABLE `factura` (
  `idFactura` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `fechaEmision` date NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `numeroFactura` varchar(50) DEFAULT NULL,
  `urlDocumento` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idFactura`),
  UNIQUE KEY `idPedido` (`idPedido`),
  CONSTRAINT `factura_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`)
);
CREATE TABLE `logactividad` (
  `idLog` int NOT NULL AUTO_INCREMENT,
  `idUsuario` int NOT NULL,
  `accion` varchar(255) DEFAULT NULL,
  `fechaHora` datetime NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`idLog`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `logactividad_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
);
CREATE TABLE `pago` (
  `idPago` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `metodoPago` varchar(50) DEFAULT NULL,
  `monto` INT NOT NULL,
  `fechaPago` date NOT NULL,
  `estadoTransaccion` varchar(50) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPago`),
  UNIQUE KEY `idPedido` (`idPedido`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`)
);
CREATE TABLE `pedido` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `idCliente` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Procesando','pendiente','pagado','fallido','entregado','cancelado') NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `metodoEntrega` varchar(50) DEFAULT NULL,
  `direccionEntrega` varchar(255) DEFAULT NULL,
  `metodoPago` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `pedido_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
);
CREATE TABLE `producto` (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `idCategoria` int DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `idSubcategoria` int DEFAULT NULL,
  PRIMARY KEY (`idProducto`),
  KEY `fk_producto_subcategoria` (`idSubcategoria`),
  KEY `fk_producto_categoria` (`idCategoria`),
  CONSTRAINT `fk_producto_categoria` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_producto_subcategoria` FOREIGN KEY (`idSubcategoria`) REFERENCES `subcategoria` (`idSubcategoria`) ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE TABLE `promocion` (
  `idPromocion` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) DEFAULT NULL,
  `descripcion` text,
  `fechaInicio` date DEFAULT NULL,
  `fechaFin` date DEFAULT NULL,
  `idCampana` int DEFAULT NULL,
  `tipoDescuento` enum('Porcentaje','MontoFijo') NOT NULL DEFAULT 'Porcentaje',
  `valorDescuento` decimal(10,2) NOT NULL DEFAULT '0.00',
  `montoMinimoCompra` decimal(10,2) DEFAULT '0.00',
  `activo` BOOLEAN DEFAULT TRUE,
  `idCategoriaAplicable` int DEFAULT NULL,
  PRIMARY KEY (`idPromocion`),
  KEY `idCampana` (`idCampana`),
  KEY `fk_promocion_categoria` (`idCategoriaAplicable`),
  CONSTRAINT `fk_promocion_categoria` FOREIGN KEY (`idCategoriaAplicable`) REFERENCES `categoria` (`idCategoria`),
  CONSTRAINT `promocion_ibfk_1` FOREIGN KEY (`idCampana`) REFERENCES `campana` (`idCampana`)
);

CREATE TABLE `reporte` (
  `idReporte` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `formato` varchar(20) DEFAULT 'PDF',
  `fechaGeneracion` datetime DEFAULT CURRENT_TIMESTAMP,
  `parametros` text,
  `usuario` varchar(100) DEFAULT NULL,
  `exportado` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`idReporte`)
);
CREATE TABLE `subcategoria` (
  `idSubcategoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `imagen` varchar(255) DEFAULT NULL,
  `idCategoria` int DEFAULT NULL,
  `genero` enum('Hombre','Mujer','Unisex') DEFAULT 'Unisex',
  PRIMARY KEY (`idSubcategoria`),
  KEY `fk_subcategoria_categoria` (`idCategoria`),
  CONSTRAINT `fk_subcategoria_categoria` FOREIGN KEY (`idCategoria`) REFERENCES `categoria` (`idCategoria`) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `dni` varchar(8) NOT NULL,
  `telefono` varchar(9) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `contrasena` varchar(255) NOT NULL,
  `rol` enum('Administrador','Cliente') NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`),
  CONSTRAINT `chk_dni_format` CHECK (regexp_like(`dni`,_utf8mb4'^[0-9]{8}$')),
  CONSTRAINT `chk_telefono_format` CHECK (regexp_like(`telefono`,_utf8mb4'^9[0-9]{8}$'))
);
CREATE TABLE `usuariopromocion` (
    `idUsuario` int NOT NULL,
  `idPromocion` int NOT NULL,
  `estado` enum('Pendiente','Usado') DEFAULT 'Pendiente',
  `fechaUso` datetime DEFAULT NULL,
  PRIMARY KEY (`idUsuario`,`idPromocion`),
  KEY `idPromocion` (`idPromocion`),
  CONSTRAINT `usuariopromocion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  CONSTRAINT `usuariopromocion_ibfk_2` FOREIGN KEY (`idPromocion`) REFERENCES `promocion` (`idPromocion`)
);
CREATE TABLE `cupon` (
  `idCupon` int NOT NULL AUTO_INCREMENT,
  `codigo` varchar(50) NOT NULL UNIQUE,
  `descripcion` text,
  `fechaExpiracion` date NOT NULL,
  `tipoDescuento` enum('Porcentaje', 'MontoFijo') NOT NULL,
  `valorDescuento` decimal(10,2) NOT NULL,
  `activo` BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (`idCupon`)
);
*/
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
  idCategoriaAplicable INT,
  PRIMARY KEY (idPromocion),
  KEY (idCampana),
  KEY (idCategoriaAplicable),
  FOREIGN KEY (idCampana) REFERENCES campana(idCampana),
  FOREIGN KEY (idCategoriaAplicable) REFERENCES categoria(idCategoria)
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
