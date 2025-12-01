-- Insertar usuarios, a diferencia de los usuarios registrados, los usuarios insertados no tienen codificada la contraseña
INSERT INTO Usuario (idUsuario, nombres, apellidos, correo, dni, telefono, contraseña, rol) VALUES
(1, 'Anne', 'Villasante', 'anne.villasante@gmail.com', '12345678', '912345678', 'Anne1234', 'Administrador'),
(2, 'Laura', 'Pérez', 'laura.perez@gmail.com', '23456789', '923456789', 'clave123', 'Cliente'),
(3, 'Carlos', 'Gómez', 'carlos.gomez@outlook.com', '34567890', '934567890', 'pass456', 'Cliente'),
(4, 'Ana', 'Torres', 'ana.torres@hotmail.com', '45678901', '945678901', 'secreto789', 'Cliente'),
(5, 'Miguel', 'Ramírez', 'miguel.ramirez@gmail.com', '56789012', '956789012', 'admin2024', 'Cliente'),
(6, 'Sofía', 'Hernández', 'sofia.hernandez@outlook.com', '67890123', '967890123', 'password321', 'Cliente'),
(7, 'Juan', 'Corrales', 'juan.corrales@gmail.com', '78901234', '978901234', 'Juan123', 'Cliente'),
(8, 'Administrador', '', 'admin@hotmail.com', '89012345', '989012345', 'admin123', 'Administrador'),
(9, 'Jesus', 'Paredes', 'jesus.paredes@gmail.com', '90123456', '999012345', 'Jesus123', 'Cliente');


-- Insertar productos de ejemplo
INSERT INTO Producto (idProducto, nombre, categoria, precio, stock) VALUES
(1, 'Camiseta básica blanca', 'Ropa', 14.99, 50),
(2, 'Jeans azul clásico', 'Ropa', 39.90, 30),
(3, 'Chaqueta de cuero', 'Ropa', 89.50, 15),
(4, 'Vestido floral', 'Ropa', 49.99, 20),
(5, 'Sudadera con capucha', 'Ropa', 34.95, 25),
(6, 'Pantalón de vestir negro', 'Ropa', 45.00, 18),
(7, 'Zapatillas deportivas', 'Calzado', 59.99, 40),
(8, 'Botines de cuero', 'Calzado', 74.50, 22),
(9, 'Sandalias planas', 'Calzado', 29.99, 35),
(10, 'Zapatos de vestir', 'Calzado', 64.90, 12),
(11, 'Gorra ajustable', 'Accesorios', 12.99, 45),
(12, 'Cinturón de cuero', 'Accesorios', 19.50, 28),
(13, 'Bolso de mano', 'Accesorios', 39.99, 20),
(14, 'Bufanda de lana', 'Accesorios', 16.90, 30),
(15, 'Reloj analógico', 'Accesorios', 89.00, 10),
(16, 'Anillo plateado', 'Accesorios', 24.99, 15),
(17, 'Chaqueta deportiva', 'Ropa', 54.90, 17),
(18, 'Zapatos casuales', 'Calzado', 49.50, 25),
(19, 'Mochila urbana', 'Accesorios', 44.99, 18),
(20, 'Sombrero de paja', 'Accesorios', 14.50, 22);

-- Categoria: Ropa
INSERT INTO subcategoria (nombre, categoria, genero) VALUES
('Camiseta básica blanca', 'Ropa', 'Mujer'),
('Jeans azul clásico', 'Ropa', 'Mujer'),
('Chaqueta de cuero', 'Ropa', 'Mujer'),
('Vestido floral', 'Ropa', 'Mujer'),
('Sudadera con capucha', 'Ropa', 'Mujer'),
('Pantalón de vestir negro', 'Ropa', 'Mujer'),
('Falda plisada de puntos', 'Ropa', 'Mujer'),
('Pantalón Jean', 'Ropa', 'Mujer');

-- Categoria: Calzado
INSERT INTO subcategoria (nombre, categoria, genero) VALUES
('Zapatillas deportivas', 'Calzado', 'Mujer'),
('Botines de cuero', 'Calzado', 'Mujer'),
('Sandalias planas', 'Calzado', 'Mujer'),
('Zapatos de vestir', 'Calzado', 'Mujer'),
('Zapatos casuales', 'Calzado', 'Mujer');

-- Categoria: Accesorios
INSERT INTO subcategoria (nombre, categoria, genero) VALUES
('Gorra ajustable', 'Accesorios', 'Mujer'),
('Cinturón de cuero', 'Accesorios', 'Mujer'),
('Bolso de mano', 'Accesorios', 'Mujer'),
('Bufanda de lana', 'Accesorios', 'Mujer'),
('Reloj analógico', 'Accesorios', 'Mujer'),
('Anillo plateado', 'Accesorios', 'Mujer'),
('Mochila urbana', 'Accesorios', 'Mujer'),
('Sombrero de paja', 'Accesorios', 'Mujer');
