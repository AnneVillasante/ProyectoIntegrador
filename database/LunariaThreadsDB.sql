CREATE TABLE `campaña` (
  `idCampaña` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `fechaInicio` date NOT NULL,
  `fechaFin` date NOT NULL,
  PRIMARY KEY (`idCampaña`)
);
CREATE TABLE `carrito` (
  `idCarrito` int NOT NULL AUTO_INCREMENT,
  `idCliente` int NOT NULL,
  PRIMARY KEY (`idCarrito`),
  KEY `idCliente` (`idCliente`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`)
);
CREATE TABLE `carritodetalle` (
  `idDetalleCarrito` int NOT NULL AUTO_INCREMENT,
  `idCarrito` int NOT NULL,
  `idProducto` int NOT NULL,
  `cantidad` int NOT NULL,
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
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `idUsuario` int DEFAULT NULL,
  PRIMARY KEY (`idCliente`),
  UNIQUE KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
);
CREATE TABLE `detallepedido` (
  `idDetallePedido` int NOT NULL AUTO_INCREMENT,
  `idPedido` int NOT NULL,
  `idProducto` int NOT NULL,
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
  `monto` decimal(10,2) NOT NULL,
  `fechaPago` date NOT NULL,
  `estadoTransaccion` varchar(50) DEFAULT NULL,
  `referenciaAPI` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idPago`),
  UNIQUE KEY `idPedido` (`idPedido`),
  CONSTRAINT `pago_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedido` (`idPedido`)
);
CREATE TABLE `pedido` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `idCliente` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('pendiente','pagado','entregado','devuelto') NOT NULL,
  `total` decimal(10,2) NOT NULL,
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
  `idCampaña` int DEFAULT NULL,
  PRIMARY KEY (`idPromocion`),
  KEY `idCampaña` (`idCampaña`),
  CONSTRAINT `promocion_ibfk_1` FOREIGN KEY (`idCampaña`) REFERENCES `campaña` (`idCampaña`)
);
CREATE TABLE `recomendacion` (
  `idRecomendacion` int NOT NULL AUTO_INCREMENT,
  `idCliente` int NOT NULL,
  `idProducto` int NOT NULL,
  `motivo` text,
  `fechaGeneracion` date NOT NULL,
  PRIMARY KEY (`idRecomendacion`),
  KEY `idCliente` (`idCliente`),
  KEY `idProducto` (`idProducto`),
  CONSTRAINT `recomendacion_ibfk_1` FOREIGN KEY (`idCliente`) REFERENCES `cliente` (`idCliente`),
  CONSTRAINT `recomendacion_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`)
) ;
CREATE TABLE `reporte` (
  `idReporte` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(50) DEFAULT NULL,
  `formato` varchar(20) DEFAULT 'PDF',
  `fechaGeneracion` datetime DEFAULT CURRENT_TIMESTAMP,
  `parametros` text,
  `usuario` varchar(100) DEFAULT NULL,
  `exportado` tinyint(1) DEFAULT '0',
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
  `fotoPerfil` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) NOT NULL,
  `rol` enum('Administrador','Cliente') NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `correo` (`correo`),
  CONSTRAINT `chk_dni_format` CHECK (regexp_like(`dni`,_utf8mb4'^[0-9]{8}$')),
  CONSTRAINT `chk_telefono_format` CHECK (regexp_like(`telefono`,_utf8mb4'^9[0-9]{8}$'))
);
CREATE TABLE `usuariopromocion` (
  `idUsuario` int NOT NULL,
  `idPromocion` int NOT NULL,
  PRIMARY KEY (`idUsuario`,`idPromocion`),
  KEY `idPromocion` (`idPromocion`),
  CONSTRAINT `usuariopromocion_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`),
  CONSTRAINT `usuariopromocion_ibfk_2` FOREIGN KEY (`idPromocion`) REFERENCES `promocion` (`idPromocion`)
)