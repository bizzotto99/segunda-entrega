INSERT IGNORE INTO categorias (nombre) VALUES ('Equipos Internacionales');
INSERT IGNORE INTO categorias (nombre) VALUES ('Selecciones Nacionales');

INSERT IGNORE INTO clubes (nombre, pais, activo, id_categoria) VALUES ('Real Madrid', 'España', true, 1);
INSERT IGNORE INTO clubes (nombre, pais, activo, id_categoria) VALUES ('Manchester City', 'Inglaterra', true, 1);
INSERT IGNORE INTO clubes (nombre, pais, activo, id_categoria) VALUES ('Argentina', 'Argentina', true, 2);
