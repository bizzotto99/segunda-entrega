-- SQL Script para actualizar las imágenes y agregar nuevos productos (incluyendo Selección)

-- 1. Crear categoría Selección si no existe
INSERT INTO categorias (id_categoria, nombre) VALUES (3, 'Selección') ON DUPLICATE KEY UPDATE nombre='Selección';

-- 2. Mover el club Argentina (ID 18) a la categoría de Selección (ID 3)
UPDATE clubes SET id_categoria = 3 WHERE id_club = 18;

-- 3. Actualizar foto_url (frontal) de los productos de Primera División existentes
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Boca frontal.webp' WHERE id_producto = 2;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/River frontal.webp' WHERE id_producto = 3;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Independiente frontal.jpg' WHERE id_producto = 4;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Racing frontal.webp' WHERE id_producto = 5;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/San Lorenzo frontal.webp' WHERE id_producto = 6;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Estudiantes frontal.jpg' WHERE id_producto = 8;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/RosarioCentral frontal.webp' WHERE id_producto = 10;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Newells frontal.jpg' WHERE id_producto = 11;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/Velez frontal.webp' WHERE id_producto = 12;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend Primera/ArgentinosJunios frontal.webp' WHERE id_producto = 13;

-- 4. Actualizar foto_url (frontal) de los productos de Segunda División existentes
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/Chacarita frontal.png' WHERE id_producto = 14;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/Ferro frontal.jpg' WHERE id_producto = 16;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/Chicago frontal.webp' WHERE id_producto = 17;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/Atlanta frontal.jpg' WHERE id_producto = 18;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/AlmiranteBrown frontal.jpg' WHERE id_producto = 19;
UPDATE productos SET foto_url = '/Imagenes Frontend/Imagenes Frontend B Nacional/SanMartin frontal.jpg' WHERE id_producto = 20;

-- 5. Limpiar tabla producto_imagenes para evitar duplicados al re-ejecutar
DELETE FROM producto_imagenes;

-- 6. Insertar imágenes de dorsal (espaldas) para los productos existentes
INSERT INTO producto_imagenes (url, id_producto) VALUES 
('/Imagenes Frontend/Imagenes Frontend Primera/Boca dorsal.webp', 2),
('/Imagenes Frontend/Imagenes Frontend Primera/River dorsal.webp', 3),
('/Imagenes Frontend/Imagenes Frontend Primera/Independiente dorsal.jpg', 4),
('/Imagenes Frontend/Imagenes Frontend Primera/Racing dorsal.webp', 5),
('/Imagenes Frontend/Imagenes Frontend Primera/San Lorenzo dorsal.webp', 6),
('/Imagenes Frontend/Imagenes Frontend Primera/Estudiantes dorsal.jpg', 8),
('/Imagenes Frontend/Imagenes Frontend Primera/RosarioCentral dorsal.webp', 10),
('/Imagenes Frontend/Imagenes Frontend Primera/Newells dorsal.jpg', 11),
('/Imagenes Frontend/Imagenes Frontend Primera/Velez dorsal.webp', 12),
('/Imagenes Frontend/Imagenes Frontend Primera/ArgentinosJunios dorsal.webp', 13),
('/Imagenes Frontend/Imagenes Frontend B Nacional/Chacarita dorsal.jpg', 14),
('/Imagenes Frontend/Imagenes Frontend B Nacional/Ferro dorsal.jpg', 16),
('/Imagenes Frontend/Imagenes Frontend B Nacional/Chicago dorsal.webp', 17),
('/Imagenes Frontend/Imagenes Frontend B Nacional/Atlanta dorsal.jpg', 18),
('/Imagenes Frontend/Imagenes Frontend B Nacional/AlmiranteBrown dorsal.jpg', 19),
('/Imagenes Frontend/Imagenes Frontend B Nacional/SanMartin dorsal.jpg', 20);

-- 7. Insertar nuevos productos de la Selección Argentina (Categoría 3, Club 18)
INSERT INTO productos (id_producto, activo, descripcion, fecha_alta, foto_url, nombre, precio, stock, temporada, tipo, id_categoria, id_club) VALUES 
(26, 1, 'Camiseta oficial titular de la Selección Argentina para la Copa América 2024.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/ArgentinaTitular frontal.webp', 'Argentina Titular 2024', 89990, 50, '2024', 'TITULAR', 3, 18),
(27, 1, 'Camiseta oficial suplente de la Selección Argentina para la Copa América 2024.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/ArgentinaSuplente frontal.webp', 'Argentina Suplente 2024', 89990, 50, '2024', 'SUPLENTE', 3, 18),
(28, 1, 'Camiseta retro titular usada por la Selección Argentina en el Mundial de Alemania 2006.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/Argentina2006Titular frontal.webp', 'Argentina Retro 2006 Titular', 99990, 30, '2006', 'TITULAR', 3, 18),
(29, 1, 'Camiseta retro suplente usada por la Selección Argentina en el Mundial de Alemania 2006.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/Argentina2006Suplente frontal.webp', 'Argentina Retro 2006 Suplente', 99990, 30, '2006', 'SUPLENTE', 3, 18),
(30, 1, 'Camiseta pre-match oficial de calentamiento de la Selección Argentina.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/AgentinaPreMatch frontal.webp', 'Argentina Pre-Match 2024', 74990, 40, '2024', 'TERCERA', 3, 18),
(31, 1, 'Camiseta oficial de entrenamiento de la Selección Argentina.', NOW(), '/Imagenes Frontend/Imagenes Frontend Seleccion/AregentinaEntrenamiento frontal.webp', 'Argentina Entrenamiento 2024', 69990, 40, '2024', 'TERCERA', 3, 18);

-- Talles para Selecciones
INSERT INTO producto_talles (stock_talle, talle, id_producto) VALUES
(25, 'M', 26), (25, 'L', 26),
(25, 'M', 27), (25, 'L', 27),
(15, 'M', 28), (15, 'L', 28),
(15, 'M', 29), (15, 'L', 29),
(20, 'M', 30), (20, 'L', 30),
(20, 'M', 31), (20, 'L', 31);

-- Dorsales para Selecciones
INSERT INTO producto_imagenes (url, id_producto) VALUES 
('/Imagenes Frontend/Imagenes Frontend Seleccion/ArgentinaTitular dorsal.webp', 26),
('/Imagenes Frontend/Imagenes Frontend Seleccion/ArgentinaSuplente dorsal.webp', 27),
('/Imagenes Frontend/Imagenes Frontend Seleccion/Argentina2006Titular dorsal.webp', 28),
('/Imagenes Frontend/Imagenes Frontend Seleccion/Argentina2006Suplente dorsal.webp', 29),
('/Imagenes Frontend/Imagenes Frontend Seleccion/AgentinaPreMatch dorsal.webp', 30),
('/Imagenes Frontend/Imagenes Frontend Seleccion/AregentinaEntrenamiento dorsal.webp', 31);

-- 8. Insertar nuevos productos de Primera División que faltaban pero tienen imágenes (Talleres, Belgrano, Lanús)
INSERT INTO productos (id_producto, activo, descripcion, fecha_alta, foto_url, nombre, precio, stock, temporada, tipo, id_categoria, id_club) VALUES 
(32, 1, 'Camiseta titular de Talleres de Córdoba.', NOW(), '/Imagenes Frontend/Imagenes Frontend Primera/Talleres frontal.webp', 'Camiseta Talleres 2025', 75000, 30, '2025', 'TITULAR', 1, 13),
(33, 1, 'Camiseta titular de Belgrano de Córdoba.', NOW(), '/Imagenes Frontend/Imagenes Frontend Primera/Belgrano frontal.webp', 'Camiseta Belgrano 2025', 75000, 30, '2025', 'TITULAR', 1, 14),
(34, 1, 'Camiseta titular del Club Atlético Lanús.', NOW(), '/Imagenes Frontend/Imagenes Frontend Primera/Lanus frontal.webp', 'Camiseta Lanús 2025', 75000, 30, '2025', 'TITULAR', 1, 15);

-- Talles para Talleres, Belgrano, Lanús
INSERT INTO producto_talles (stock_talle, talle, id_producto) VALUES
(15, 'M', 32), (15, 'L', 32),
(15, 'M', 33), (15, 'L', 33),
(15, 'M', 34), (15, 'L', 34);

-- Dorsales para Talleres, Belgrano, Lanús
INSERT INTO producto_imagenes (url, id_producto) VALUES
('/Imagenes Frontend/Imagenes Frontend Primera/Talleres dorsal.jpg', 32),
('/Imagenes Frontend/Imagenes Frontend Primera/Belgrano dorsal.webp', 33),
('/Imagenes Frontend/Imagenes Frontend Primera/Lanus dorsal.webp', 34);
