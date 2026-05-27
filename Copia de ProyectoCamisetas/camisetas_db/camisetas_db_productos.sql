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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b706fc50-2253-11f1-a300-fdc9f67771d0:1-94';

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
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-07 17:59:46
