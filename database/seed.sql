-- Insertar usuarios, a diferencia de los usuarios registrados, los usuarios insertados no tienen codificada la contrasena
INSERT INTO Usuario (idUsuario, nombres, apellidos, correo, dni, telefono, contrasena, rol) VALUES
(1, 'Anne', 'Villasante', 'anne.villasante@gmail.com', '12345678', '912345678', 'Anne1234', 'Administrador'),
(2, 'Laura', 'Pérez', 'laura.perez@gmail.com', '23456789', '923456789', 'clave123', 'Cliente'),
(3, 'Carlos', 'Gómez', 'carlos.gomez@outlook.com', '34567890', '934567890', 'pass456', 'Cliente'),
(4, 'Ana', 'Torres', 'ana.torres@hotmail.com', '45678901', '945678901', 'secreto789', 'Cliente'),
(5, 'Miguel', 'Ramírez', 'miguel.ramirez@gmail.com', '56789012', '956789012', 'admin2024', 'Cliente'),
(6, 'Sofía', 'Hernández', 'sofia.hernandez@outlook.com', '67890123', '967890123', 'password321', 'Cliente'),
(7, 'Juan', 'Corrales', 'juan.corrales@gmail.com', '78901234', '978901234', 'Juan123', 'Cliente'),
(8, 'Administrador', '', 'admin@hotmail.com', '89012345', '989012345', 'admin123', 'Administrador'),
(9, 'Jesus', 'Paredes', 'jesus.paredes@gmail.com', '90123456', '999012345', 'Jesus123', 'Cliente');

INSERT INTO subcategoria (nombre, descripcion, idCategoria, genero) VALUES
('Pantalones', 'Prenda para la parte inferior del cuerpo, cubriendo desde la cintura hasta los tobillos.', 1, 'Unisex'),
('Camisetas', 'Prenda superior de manga corta o sin mangas, casual y de cuello redondo o V.', 1, 'Unisex'),
('Faldas', 'Prenda de vestir que cuelga de la cintura, cubriendo parcial o totalmente las piernas.', 1, 'Mujer'),
('Vestidos', 'Prenda de una sola pieza que cubre desde los hombros hasta una altura variable de las piernas.', 1, 'Mujer'),
('Camisas', 'Prenda superior con cuello, botones delanteros y punos, formal o casual.', 1, 'Hombre'),
('Chaquetas/Abrigos', 'Prenda exterior de manga larga para proteger del frío o la lluvia.', 1, 'Unisex'),
('Ropa Interior', 'Prendas usadas debajo de la ropa (e.g., boxers, bragas, calzoncillos).', 1, 'Unisex'),
('Ropa Deportiva', 'Prendas disenadas con materiales técnicos para actividades atléticas y ejercicio.', 1, 'Unisex'),
('Jeans', 'Pantalones casuales de mezclilla (denim), de corte y estilo variado.', 1, 'Unisex'),
('Zapatillas Deportivas', 'Calzado disenado para actividades físicas, running o entrenamiento.', 2, 'Unisex'),
('Botas y Botines', 'Calzado que cubre el tobillo o parte de la pierna, para uso formal, casual o trabajo.', 2, 'Unisex'),
('Zapatos Formales', 'Calzado de vestir cerrado para eventos o entornos de trabajo (e.g., Oxfords, tacones).', 2, 'Unisex'),
('Sandalias y Chanclas', 'Calzado abierto ideal para verano o uso en interiores.', 2, 'Unisex'),
('Bolsos y Carteras', 'Contenedores portátiles para objetos personales, variando en tamano y diseno.', 3, 'Mujer'),
('Joyas (Bisutería)', 'Artículos ornamentales como collares, pulseras, anillos y pendientes.', 3, 'Mujer'),
('Cinturones', 'Tiras de material usadas alrededor de la cintura para sujetar prendas o como adorno.', 3, 'Unisex'),
('Sombreros y Gorras', 'Prendas para cubrir y proteger la cabeza.', 3, 'Unisex'),
('Accesorios de Pelo', 'Artículos para decorar o sujetar el cabello (e.g., gomas, pinzas, diademas).', 3, 'Mujer'),
('Temáticos Ficción/Cine', 'Disfraces basados en personajes de películas, series, libros o cómics.', 4, 'Unisex'),
('Profesiones y Oficios', 'Disfraces que representan trabajos (e.g., policía, médico, bombero).', 4, 'Unisex'),
('Animales y Criaturas', 'Disfraces que imitan la apariencia de animales reales o fantásticos.', 4, 'Unisex');

-- idCategoria: 1=Ropa, 2=Calzado, 3=Accesorios, 4=Disfraces
-- Subcategorías (Ejemplos): 1=Pantalones, 2=Camisetas, 4=Vestidos, 9=Jeans, 10=Zapatillas Deportivas, 14=Bolsos y Carteras, 19=Temáticos Ficción/Cine.

INSERT INTO producto (nombre, descripcion, idCategoria, imagen, precio, stock, idSubcategoria) VALUES
-- ROPA (ID: 1) - Subcategorías 1 a 9
('Pantalón Cargo Hombre', 'Pantalón de corte holgado con bolsillos laterales, ideal para uso casual.', 1, 'img/pantalon_cargo.jpg', 45.99, 150, 1),
('Jogger Deportivo Mujer', 'Pantalón cómodo de tela stretch, cintura ajustable, perfecto para el gimnasio.', 1, 'img/jogger_mujer.jpg', 39.50, 120, 1),
('Camiseta Algodón Clásica', 'Camiseta de cuello redondo 100% algodón, color blanco, unisex.', 1, 'img/camiseta_blanca.jpg', 15.00, 300, 2),
('T-Shirt Estampado Gráfico', 'Camiseta con diseno moderno en la espalda y el pecho, color negro.', 1, 'img/camiseta_grafica.jpg', 19.99, 90, 2),
('Falda Midi Plisada', 'Falda de largo medio con pliegues definidos y cintura elástica, color beige.', 1, 'img/falda_midi.jpg', 55.75, 75, 3),
('Minifalda Denim Negra', 'Falda corta de mezclilla con botones frontales.', 1, 'img/minifalda_denim.jpg', 32.99, 110, 3),
('Vestido de Noche Largo', 'Vestido elegante con escote en V y tejido satinado, ideal para eventos.', 1, 'img/vestido_noche.jpg', 120.00, 45, 4),
('Vestido Casual Verano', 'Vestido corto y ligero, estampado floral, tirantes ajustables.', 1, 'img/vestido_casual.jpg', 49.99, 180, 4),
('Camisa Oxford Azul', 'Camisa de corte clásico, tela Oxford, perfecta para oficina.', 1, 'img/camisa_oxford.jpg', 59.90, 85, 5),
('Camisa Estampado Tropical', 'Camisa de manga corta con patrones vibrantes, ideal para vacaciones.', 1, 'img/camisa_tropical.jpg', 42.00, 60, 5),
('Chaqueta Bomber Negra', 'Chaqueta ligera estilo bomber con cremallera frontal.', 1, 'img/chaqueta_bomber.jpg', 79.99, 130, 6),
('Abrigo de Lana Cruzado', 'Abrigo largo y pesado de doble botón, ideal para invierno.', 1, 'img/abrigo_lana.jpg', 150.00, 35, 6),
('Pack Calzoncillos Boxer', 'Set de tres calzoncillos tipo boxer de microfibra, varios colores.', 1, 'img/boxers_pack.jpg', 25.00, 220, 7),
('Sujetador Deportivo Alto Soporte', 'Sujetador técnico sin costuras, máxima sujeción para ejercicio intenso.', 1, 'img/sujetador_deportivo.jpg', 35.00, 95, 8),
('Leggings de Entrenamiento', 'Mallas elásticas de compresión con tecnología de secado rápido.', 1, 'img/leggings_gym.jpg', 40.00, 160, 8),
('Jeans Skinny Hombre', 'Pantalones de mezclilla de corte ajustado, color gris oscuro.', 1, 'img/jeans_skinny.jpg', 65.00, 115, 9),
('Jeans Rectos Clásicos', 'Pantalones vaqueros de corte recto tradicional, tiro medio.', 1, 'img/jeans_rectos.jpg', 69.99, 100, 9),

-- CALZADO (ID: 2) - Subcategorías 10 a 13
('Running Shoes Pro', 'Zapatillas de alto rendimiento con amortiguación de gel, unisex.', 2, 'img/zapatillas_running.jpg', 99.99, 70, 10),
('Sneakers Urbanas Blancas', 'Zapatillas de estilo casual para uso diario, plataforma baja.', 2, 'img/sneakers_urbanas.jpg', 55.00, 140, 10),
('Bota de Montana Impermeable', 'Botas robustas y resistentes al agua, suela antideslizante.', 2, 'img/bota_montana.jpg', 110.00, 55, 11),
('Botín de Cuero Mujer', 'Botines elegantes de cuero con tacón bajo, cremallera lateral.', 2, 'img/botin_cuero.jpg', 85.00, 90, 11),
('Zapato Derby Formal', 'Zapato de vestir de cuero liso para hombre, cierre de cordones.', 2, 'img/zapato_derby.jpg', 79.90, 65, 12),
('Tacones Stiletto Rojos', 'Zapatos de tacón de aguja altos, acabado charol.', 2, 'img/tacon_stiletto.jpg', 72.00, 40, 12),
('Sandalias Romanas Cuero', 'Sandalias planas de tiras de cuero con cierre de hebilla.', 2, 'img/sandalias_romanas.jpg', 45.00, 80, 13),
('Chanclas de Piscina', 'Chanclas ligeras de goma, suela texturizada, color azul.', 2, 'img/chanclas_piscina.jpg', 15.50, 250, 13),

-- ACCESORIOS (ID: 3) - Subcategorías 14 a 18
('Bolso Cruzado Piel', 'Bolso pequeno de hombro con correa ajustable, material de piel sintética.', 3, 'img/bolso_cruzado.jpg', 69.99, 70, 14),
('Cartera Minimalista Hombre', 'Cartera delgada con clip para billetes y tarjetero RFID.', 3, 'img/cartera_minimalista.jpg', 29.99, 105, 14),
('Collar de Plata y Zirconia', 'Cadena de plata 925 con un colgante de zirconia cúbica.', 3, 'img/collar_plata.jpg', 38.00, 60, 15),
('Cinturón Hebilla Metálica', 'Cinturón de cuero sintético con hebilla grande rectangular.', 3, 'img/cinturon_metalico.jpg', 22.50, 130, 16),

-- DISFRACES (ID: 4) - Subcategorías 19 a 21
('Disfraz de Superhéroe', 'Traje completo basado en un conocido personaje de cómic, incluye máscara.', 4, 'img/disfraz_superheroe.jpg', 95.00, 40, 19),
('Disfraz de Astronauta', 'Réplica de traje espacial con casco suave, para ninos.', 4, 'img/disfraz_astronauta.jpg', 59.99, 30, 20),
('Disfraz de León Bebé', 'Traje de cuerpo completo con capucha de melena suave para bebés.', 4, 'img/disfraz_leon.jpg', 45.00, 25, 21);