USE LunariaThreadsDB;CREATE DATABASE LunariaThreadsDB;

USE LunariaThreadsDB;
-- Tabla: Usuario
-- ============================================
CREATE TABLE Usuario (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Cliente') NOT NULL
);
select * from usuario;
INSERT INTO Usuario (nombre, correo, contraseña, rol)
VALUES
('Administrador', 'admin@gmail.com', 'admin123', 'Administrador');

-- Tabla: Cliente
-- ============================================
CREATE TABLE Cliente (
    idCliente INT AUTO_INCREMENT PRIMARY KEY,
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    idUsuario INT UNIQUE,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);
select * from Cliente;

-- Tabla: Producto
-- ============================================
CREATE TABLE Producto (
    idProducto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);
select * from Producto;
-- Tabla: Carrito
-- ============================================
CREATE TABLE Carrito (
    idCarrito INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);
select * from Carrito;

-- Tabla: CarritoDetalle
-- ============================================
CREATE TABLE CarritoDetalle (
    idDetalleCarrito INT AUTO_INCREMENT PRIMARY KEY,
    idCarrito INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCarrito) REFERENCES Carrito(idCarrito),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);
select * from CarritoDetalle;

-- Tabla: Pedido
-- ============================================
CREATE TABLE Pedido (
    idPedido INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('pendiente', 'pagado', 'entregado', 'devuelto') NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente)
);
select * from Pedido;

-- Tabla: DetallePedido
-- ============================================
CREATE TABLE DetallePedido (
    idDetallePedido INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);
select * from DetallePedido;

-- Tabla: Pago
-- ============================================
CREATE TABLE Pago (
    idPago INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL UNIQUE,
    metodoPago VARCHAR(50),
    monto DECIMAL(10,2) NOT NULL,
    fechaPago DATE NOT NULL,
    estadoTransaccion VARCHAR(50),
    referenciaAPI VARCHAR(255),
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
);
select * from Pago;

-- Tabla: Factura
-- ============================================
CREATE TABLE Factura (
    idFactura INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL UNIQUE,
    fechaEmision DATE NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    numeroFactura VARCHAR(50),
    urlDocumento VARCHAR(255),
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
);
select * from Factura;

-- Tabla: Devolucion
-- ============================================
CREATE TABLE Devolucion (
    idDevolucion INT AUTO_INCREMENT PRIMARY KEY,
    idPedido INT NOT NULL,
    motivo TEXT,
    fechaSolicitud DATE NOT NULL,
    estado ENUM('solicitada', 'aceptada', 'rechazada', 'reembolsada') NOT NULL,
    montoReembolsado DECIMAL(10,2),
    FOREIGN KEY (idPedido) REFERENCES Pedido(idPedido)
);
select * from devolucion;

-- Tabla: Reporte
-- ============================================
CREATE TABLE Reporte (
    idReporte INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50),
    fechaGeneracion DATE NOT NULL,
    parametros TEXT,
    exportado BOOLEAN DEFAULT 0
);
select * from Reporte;

-- Tabla: Campaña
-- ============================================
CREATE TABLE Campaña (
    idCampaña INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    descripcion TEXT,
    fechaInicio DATE NOT NULL,
    fechaFin DATE NOT NULL
);
select * from campaña;

-- Tabla: Promocion
-- ============================================
CREATE TABLE Promocion (
    idPromocion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    descripcion TEXT,
    fechaInicio DATE,
    fechaFin DATE,
    idCampaña INT,
    FOREIGN KEY (idCampaña) REFERENCES Campaña(idCampaña)
);
select * from Promocion;

-- Tabla intermedia: UsuarioPromocion (N:M)
-- ============================================
CREATE TABLE UsuarioPromocion (
    idUsuario INT NOT NULL,
    idPromocion INT NOT NULL,
    PRIMARY KEY (idUsuario, idPromocion),
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
    FOREIGN KEY (idPromocion) REFERENCES Promocion(idPromocion)
);
select * from UsuarioPromocion;

-- Tabla: LogActividad
-- ============================================
CREATE TABLE LogActividad (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT NOT NULL,
    accion VARCHAR(255),
    fechaHora DATETIME NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);
select * from LogActividad;

-- Tabla: Recomendacion
-- ============================================
CREATE TABLE Recomendacion (
    idRecomendacion INT AUTO_INCREMENT PRIMARY KEY,
    idCliente INT NOT NULL,
    idProducto INT NOT NULL,
    motivo TEXT,
    fechaGeneracion DATE NOT NULL,
    FOREIGN KEY (idCliente) REFERENCES Cliente(idCliente),
    FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);
select * from Recomendacion;