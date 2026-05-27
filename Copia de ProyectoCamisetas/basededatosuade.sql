-- MySQL dump 10.13  Distrib 8.0.45, for macos15 (arm64)
--
-- Host: localhost    Database: camisetas_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b706fc50-2253-11f1-a300-fdc9f67771d0:1-95';

--
-- Table structure for table `carritos`
--

DROP TABLE IF EXISTS `carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carritos` (
  `id_carrito` bigint NOT NULL AUTO_INCREMENT,
  `estado` enum('ACTIVO','CERRADO') NOT NULL,
  `fecha_actualizacion` datetime(6) DEFAULT NULL,
  `fecha_creacion` datetime(6) DEFAULT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_carrito`),
  UNIQUE KEY `UK_hr2m1k3ryr61lnjslhpfxbl3h` (`id_usuario`),
  CONSTRAINT `FKho22vgt039p7r4wvto1j38mbe` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carritos`
--

LOCK TABLES `carritos` WRITE;
/*!40000 ALTER TABLE `carritos` DISABLE KEYS */;
INSERT INTO `carritos` VALUES (1,'ACTIVO','2026-04-01 17:57:26.298549','2026-04-01 17:57:26.298534',1),(2,'ACTIVO','2026-04-01 22:07:06.498291','2026-04-01 22:07:06.498273',2),(3,'ACTIVO','2026-04-02 21:26:33.388716','2026-04-02 21:26:33.388701',4),(4,'ACTIVO','2026-04-05 23:46:16.886118','2026-04-05 23:46:16.886083',3),(5,'ACTIVO','2026-04-06 13:23:02.679437','2026-04-06 13:23:02.679422',5),(6,'ACTIVO','2026-04-06 22:51:29.096017','2026-04-06 22:51:29.095998',6),(7,'ACTIVO','2026-04-06 23:01:34.165296','2026-04-06 23:01:34.165281',7),(8,'ACTIVO','2026-04-06 23:05:48.179483','2026-04-06 23:05:48.179472',8),(9,'ACTIVO','2026-04-08 11:44:01.001396','2026-04-08 11:44:01.001380',9);
/*!40000 ALTER TABLE `carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  PRIMARY KEY (`id_categoria`),
  UNIQUE KEY `UK_qcog8b7hps1hioi9onqwjdt6y` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Equipos Internacionales'),(2,'Selecciones Nacionales');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubes`
--

DROP TABLE IF EXISTS `clubes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubes` (
  `id_club` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `escudo_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `pais` varchar(255) DEFAULT NULL,
  `id_categoria` bigint DEFAULT NULL,
  PRIMARY KEY (`id_club`),
  UNIQUE KEY `UK_e74wnmw0s16bpina4aqvkslfa` (`nombre`),
  KEY `FKi3o9eh0ypbp46jalwh34krbm1` (`id_categoria`),
  CONSTRAINT `FKi3o9eh0ypbp46jalwh34krbm1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubes`
--

LOCK TABLES `clubes` WRITE;
/*!40000 ALTER TABLE `clubes` DISABLE KEYS */;
INSERT INTO `clubes` VALUES (1,_binary '',NULL,'Boca Juniors','Argentina',1),(2,_binary '',NULL,'River Plate','Argentina',1),(3,_binary '',NULL,'Independiente','Argentina',1),(4,_binary '',NULL,'Racing Club','Argentina',1),(5,_binary '',NULL,'San Lorenzo','Argentina',1),(6,_binary '',NULL,'Huracán','Argentina',1),(7,_binary '',NULL,'Estudiantes LP','Argentina',1),(8,_binary '',NULL,'Gimnasia LP','Argentina',1),(9,_binary '',NULL,'Rosario Central','Argentina',1),(10,_binary '',NULL,'Newell\'s Old Boys','Argentina',1),(11,_binary '',NULL,'Vélez Sarsfield','Argentina',1),(12,_binary '',NULL,'Argentinos Juniors','Argentina',1),(13,_binary '',NULL,'Talleres','Argentina',1),(14,_binary '',NULL,'Belgrano','Argentina',1),(15,_binary '',NULL,'Lanús','Argentina',1),(16,_binary '',NULL,'Real Madrid','España',1),(17,_binary '',NULL,'Manchester City','Inglaterra',1),(18,_binary '',NULL,'Argentina','Argentina',1),(22,_binary '','https://ejemplo.com/chacarita.png','Chacarita Juniors','Argentina',2),(23,_binary '','https://ejemplo.com/chicago.png','Nueva Chicago','Argentina',2),(24,_binary '','https://ejemplo.com/ferro.png','Ferro Carril Oeste','Argentina',2),(25,_binary '','https://ejemplo.com/quilmes.png','Quilmes','Argentina',2),(26,_binary '','https://ejemplo.com/almirante.png','Almirante Brown','Argentina',2),(27,_binary '','https://ejemplo.com/defe.png','Defensores de Belgrano','Argentina',2),(28,_binary '','https://ejemplo.com/atlanta.png','Atlanta','Argentina',2),(29,_binary '','https://ejemplo.com/estudiantesrc.png','Estudiantes de Río Cuarto','Argentina',2),(30,_binary '','https://ejemplo.com/gimnasiajujuy.png','Gimnasia de Jujuy','Argentina',2),(31,_binary '','https://ejemplo.com/smtucuman.png','San Martín de Tucumán','Argentina',2),(41,_binary '','https://ejemplo.com/escudo_tigre.png','Tigre','Argentina',1),(45,_binary '','https://ejemplo.com/escudo_UnionDeSantaFe.png','Union de Santa Fe','Argentina',1);
/*!40000 ALTER TABLE `clubes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descuentos`
--

DROP TABLE IF EXISTS `descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descuentos` (
  `id_descuento` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `fecha_fin` datetime(6) NOT NULL,
  `fecha_inicio` datetime(6) NOT NULL,
  `porcentaje` double NOT NULL,
  `id_producto` bigint NOT NULL,
  PRIMARY KEY (`id_descuento`),
  KEY `FKaaa5gngb2qmcl775ac0pisam5` (`id_producto`),
  CONSTRAINT `FKaaa5gngb2qmcl775ac0pisam5` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descuentos`
--

LOCK TABLES `descuentos` WRITE;
/*!40000 ALTER TABLE `descuentos` DISABLE KEYS */;
INSERT INTO `descuentos` VALUES (1,_binary '','2026-05-01 03:00:00.000000','2026-04-01 03:00:00.000000',10,1);
/*!40000 ALTER TABLE `descuentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_ordenes`
--

DROP TABLE IF EXISTS `detalle_ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_ordenes` (
  `id_detalle` bigint NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  `subtotal` double NOT NULL,
  `id_orden` bigint NOT NULL,
  `id_producto` bigint NOT NULL,
  `id_prod_talle` bigint DEFAULT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `FKker7u1lib70tynshdy9p50ppr` (`id_orden`),
  KEY `FKlt4jdxtal4w7aqqi7j03x8ts5` (`id_producto`),
  KEY `FKkj0rscplq01chp1uhlr25mod3` (`id_prod_talle`),
  CONSTRAINT `FKker7u1lib70tynshdy9p50ppr` FOREIGN KEY (`id_orden`) REFERENCES `ordenes` (`id_orden`),
  CONSTRAINT `FKkj0rscplq01chp1uhlr25mod3` FOREIGN KEY (`id_prod_talle`) REFERENCES `producto_talles` (`id_prod_talle`),
  CONSTRAINT `FKlt4jdxtal4w7aqqi7j03x8ts5` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_ordenes`
--

LOCK TABLES `detalle_ordenes` WRITE;
/*!40000 ALTER TABLE `detalle_ordenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_ordenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item_carritos`
--

DROP TABLE IF EXISTS `item_carritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item_carritos` (
  `id_item` bigint NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  `id_carrito` bigint NOT NULL,
  `id_producto` bigint NOT NULL,
  `id_prod_talle` bigint DEFAULT NULL,
  PRIMARY KEY (`id_item`),
  KEY `FKlroke0kjtdq8bdkf6t5r8noxu` (`id_carrito`),
  KEY `FKqsu5cc19fvkoqt38yna2948dk` (`id_producto`),
  KEY `FKa7gaua0y953gy4rdgx72yow8s` (`id_prod_talle`),
  CONSTRAINT `FKa7gaua0y953gy4rdgx72yow8s` FOREIGN KEY (`id_prod_talle`) REFERENCES `producto_talles` (`id_prod_talle`),
  CONSTRAINT `FKlroke0kjtdq8bdkf6t5r8noxu` FOREIGN KEY (`id_carrito`) REFERENCES `carritos` (`id_carrito`),
  CONSTRAINT `FKqsu5cc19fvkoqt38yna2948dk` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item_carritos`
--

LOCK TABLES `item_carritos` WRITE;
/*!40000 ALTER TABLE `item_carritos` DISABLE KEYS */;
INSERT INTO `item_carritos` VALUES (1,1,60000,4,1,NULL),(2,2,60000,8,1,NULL);
/*!40000 ALTER TABLE `item_carritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes`
--

DROP TABLE IF EXISTS `ordenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes` (
  `id_orden` bigint NOT NULL AUTO_INCREMENT,
  `direccion_entrega` varchar(255) DEFAULT NULL,
  `estado` enum('PENDIENTE','CONFIRMADA') NOT NULL,
  `fecha` datetime(6) NOT NULL,
  `total` double NOT NULL,
  `id_usuario` bigint NOT NULL,
  PRIMARY KEY (`id_orden`),
  KEY `FKd8lswiv90edntheuacavam69a` (`id_usuario`),
  CONSTRAINT `FKd8lswiv90edntheuacavam69a` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes`
--

LOCK TABLES `ordenes` WRITE;
/*!40000 ALTER TABLE `ordenes` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_imagenes`
--

DROP TABLE IF EXISTS `producto_imagenes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_imagenes` (
  `id_imagen` bigint NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  `id_producto` bigint NOT NULL,
  PRIMARY KEY (`id_imagen`),
  KEY `FKhc1x61r49rcjwprrsbvcqeo6a` (`id_producto`),
  CONSTRAINT `FKhc1x61r49rcjwprrsbvcqeo6a` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_imagenes`
--

LOCK TABLES `producto_imagenes` WRITE;
/*!40000 ALTER TABLE `producto_imagenes` DISABLE KEYS */;
INSERT INTO `producto_imagenes` VALUES (1,'url1.jpg',21),(2,'url2.jpg',21),(3,'https://ejemplo.com/unionsantafe.jpg',22);
/*!40000 ALTER TABLE `producto_imagenes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_talles`
--

DROP TABLE IF EXISTS `producto_talles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_talles` (
  `id_prod_talle` bigint NOT NULL AUTO_INCREMENT,
  `stock_talle` int NOT NULL,
  `talle` enum('S','M','L','XL','XXL') NOT NULL,
  `id_producto` bigint NOT NULL,
  PRIMARY KEY (`id_prod_talle`),
  KEY `FKlqdcbpcnqg4i32up1a6yhqctf` (`id_producto`),
  CONSTRAINT `FKlqdcbpcnqg4i32up1a6yhqctf` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_talles`
--

LOCK TABLES `producto_talles` WRITE;
/*!40000 ALTER TABLE `producto_talles` DISABLE KEYS */;
INSERT INTO `producto_talles` VALUES (1,50,'M',1),(2,50,'L',1),(3,20,'M',2),(4,30,'L',2),(5,25,'M',3),(6,25,'L',3),(7,25,'M',4),(8,25,'L',4),(9,25,'M',5),(10,25,'L',5),(11,20,'M',1),(12,20,'L',1);
/*!40000 ALTER TABLE `producto_talles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `descripcion` text,
  `fecha_alta` datetime(6) DEFAULT NULL,
  `foto_url` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `precio` double NOT NULL,
  `stock` int NOT NULL,
  `temporada` varchar(255) DEFAULT NULL,
  `tipo` enum('TITULAR','SUPLENTE','TERCERA') DEFAULT NULL,
  `id_categoria` bigint NOT NULL,
  `id_club` bigint NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `FKdtoa37luoxhhvbicrfiu5ygbj` (`id_categoria`),
  KEY `FKghdv6f5st9ml5fy40uhbaea8s` (`id_club`),
  CONSTRAINT `FKdtoa37luoxhhvbicrfiu5ygbj` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`),
  CONSTRAINT `FKghdv6f5st9ml5fy40uhbaea8s` FOREIGN KEY (`id_club`) REFERENCES `clubes` (`id_club`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,_binary '','Camiseta titular de Chacarita','2026-04-04 23:17:49.947644','https://ejemplo.com/chacarita.jpg','Camiseta Chacarita Juniors 2025',60000,40,'2025','TITULAR',2,16),(2,_binary '','Camiseta titular Boca Juniors','2026-04-05 21:25:03.000000','https://ejemplo.com/boca.jpg','Camiseta Boca Juniors 2025',80000,50,'2025','TITULAR',1,1),(3,_binary '','Camiseta titular River Plate','2026-04-05 21:25:03.000000','https://ejemplo.com/river.jpg','Camiseta River Plate 2025',80000,50,'2025','TITULAR',1,2),(4,_binary '','Camiseta titular Independiente','2026-04-05 21:25:03.000000','https://ejemplo.com/independiente.jpg','Camiseta Independiente 2025',75000,40,'2025','TITULAR',1,3),(5,_binary '','Camiseta titular Racing Club','2026-04-05 21:25:03.000000','https://ejemplo.com/racing.jpg','Camiseta Racing Club 2025',75000,40,'2025','TITULAR',1,4),(6,_binary '','Camiseta titular San Lorenzo','2026-04-05 21:25:03.000000','https://ejemplo.com/sanlorenzo.jpg','Camiseta San Lorenzo 2025',75000,40,'2025','TITULAR',1,5),(7,_binary '','Camiseta titular Huracán','2026-04-05 21:25:03.000000','https://ejemplo.com/huracan.jpg','Camiseta Huracán 2025',70000,35,'2025','TITULAR',1,6),(8,_binary '','Camiseta titular Estudiantes LP','2026-04-05 21:25:03.000000','https://ejemplo.com/estudiantes.jpg','Camiseta Estudiantes 2025',70000,35,'2025','TITULAR',1,7),(9,_binary '','Camiseta titular Gimnasia LP','2026-04-05 21:25:03.000000','https://ejemplo.com/gimnasia.jpg','Camiseta Gimnasia 2025',70000,35,'2025','TITULAR',1,8),(10,_binary '','Camiseta titular Rosario Central','2026-04-05 21:25:03.000000','https://ejemplo.com/central.jpg','Camiseta Rosario Central 2025',70000,35,'2025','TITULAR',1,9),(11,_binary '','Camiseta titular Newells Old Boys','2026-04-05 21:25:03.000000','https://ejemplo.com/newells.jpg','Camiseta Newells 2025',70000,35,'2025','TITULAR',1,10),(12,_binary '','Camiseta titular Vélez Sarsfield','2026-04-05 21:25:03.000000','https://ejemplo.com/velez.jpg','Camiseta Vélez 2025',70000,35,'2025','TITULAR',1,11),(13,_binary '','Camiseta titular Argentinos Juniors','2026-04-05 21:25:03.000000','https://ejemplo.com/argentinos.jpg','Camiseta Argentinos 2025',70000,35,'2025','TITULAR',1,12),(14,_binary '','Camiseta titular Chacarita Juniors','2026-04-05 21:25:03.000000','https://ejemplo.com/chacarita.jpg','Camiseta Chacarita 2025',60000,30,'2025','TITULAR',2,22),(15,_binary '','Camiseta titular Quilmes','2026-04-05 21:25:03.000000','https://ejemplo.com/quilmes.jpg','Camiseta Quilmes 2025',60000,30,'2025','TITULAR',2,25),(16,_binary '','Camiseta titular Ferro Carril Oeste','2026-04-05 21:25:03.000000','https://ejemplo.com/ferro.jpg','Camiseta Ferro 2025',60000,30,'2025','TITULAR',2,24),(17,_binary '','Camiseta titular Nueva Chicago','2026-04-05 21:25:03.000000','https://ejemplo.com/chicago.jpg','Camiseta Chicago 2025',60000,30,'2025','TITULAR',2,23),(18,_binary '','Camiseta titular Atlanta','2026-04-05 21:25:03.000000','https://ejemplo.com/atlanta.jpg','Camiseta Atlanta 2025',60000,30,'2025','TITULAR',2,28),(19,_binary '','Camiseta titular Almirante Brown','2026-04-05 21:25:03.000000','https://ejemplo.com/almirante.jpg','Camiseta Almirante Brown 2025',60000,30,'2025','TITULAR',2,26),(20,_binary '','Camiseta titular San Martín de Tucumán','2026-04-05 21:25:03.000000','https://ejemplo.com/smtucuman.jpg','Camiseta San Martín 2025',60000,30,'2025','TITULAR',2,31),(21,_binary '','Edicion 2026','2026-04-06 20:58:38.866627',NULL,'camiseta titular de Tigre',95000,10,NULL,NULL,1,31),(22,_binary '','Camiseta titular Union de Santa Fe','2026-04-06 22:35:59.286957',NULL,'Camiseta Union de Santa Fe 2026',99000,12,'2026','TITULAR',1,45);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fecha_registro` datetime(6) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('ADMIN','VENDEDOR','COMPRADOR') NOT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `UK_kfsp0s1tflm1cwlj8idhqsad0` (`email`),
  UNIQUE KEY `UK_m2dvbwfge291euvmk6vkkocao` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,_binary '','Bizzotto','nino@test.com','2026-04-01 17:57:26.235914','Nino','$2a$10$Jxy5nuACFJka2cuyutPOQ.mmCdAuYOvwmcRGIe9nVNkVpo77GlAhS','COMPRADOR','ninobizz'),(2,_binary '','Bizzotto','nino@email.com','2026-04-01 22:07:06.434032','Nino','$2a$10$Xt4cJXRLWNPQoKdZ42vTdO0KOTFtUGlDTV1CIcBiI22sNR1yZ0xC2','COMPRADOR','ninob'),(3,_binary '','Admin','admin@camisetas.com','2026-04-02 03:17:36.132484','Nino','$2a$10$IMr15C4Y1UyBdOUQdjP6k.E/mpjKNN5i6rWmU1nEhE66Igoh0DUi6','VENDEDOR','admin_vendedor'),(4,_binary '','Pérez','prueba@correo.com','2026-04-02 21:26:33.348568','Juan','$2a$10$MFDRNQ/XrVzJCXpBzx8C/e1uBXeGipcDBcfT6Veyiw8WhIdtcqige','COMPRADOR','usuario_prueba'),(5,_binary '','perez','juanperez@ejemplo.com','2026-04-06 13:23:02.645394','Juan','$2a$10$YkqAx4XfExQOvOyUSx0aN.JjTcZHUBhT1TFC.sL5IWFYwuSomv3dC','COMPRADOR','juan_perez'),(6,_binary '','perez','juan@test.com','2026-04-06 22:51:29.075173','juan','$2a$10$E1bgO/xiCXYpygJmeVoQnuULeBEWp9IKphwBMFfy3T7HyAYDKwKnq','COMPRADOR','juan'),(7,_binary '','Bizzotto','pedro@ejemplo.com','2026-04-06 23:01:34.140324','pedro','$2a$10$kEQVdGLTdMFWyBDfwpzRKebRm3cdBjUz/MWqr8rsOPGucXlNpKdZm','COMPRADOR','pedro'),(8,_binary '','Bizzotto','nino@ejemplo.com','2026-04-06 23:05:48.160671','Nino','$2a$10$FI4J/xQ961T4OXo9YM5b8.tSMdeTeNu0RbCfYI1y2Rh1HCEkmYHbm','COMPRADOR','nino_comprador'),(9,_binary '','Pérez','matio@ejemplo.com','2026-04-08 11:44:00.966622','matias','$2a$10$qXoIpnrCiWQL.HzsLWtw/uVIuLkNpnwgs/UcQXjzyy3Rc.kOoLM/y','COMPRADOR','matias');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-08  9:16:43
