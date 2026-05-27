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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubes`
--

LOCK TABLES `clubes` WRITE;
/*!40000 ALTER TABLE `clubes` DISABLE KEYS */;
INSERT INTO `clubes` VALUES (1,_binary '',NULL,'Boca Juniors','Argentina',1),(2,_binary '',NULL,'River Plate','Argentina',1),(3,_binary '',NULL,'Independiente','Argentina',1),(4,_binary '',NULL,'Racing Club','Argentina',1),(5,_binary '',NULL,'San Lorenzo','Argentina',1),(6,_binary '',NULL,'Huracán','Argentina',1),(7,_binary '',NULL,'Estudiantes LP','Argentina',1),(8,_binary '',NULL,'Gimnasia LP','Argentina',1),(9,_binary '',NULL,'Rosario Central','Argentina',1),(10,_binary '',NULL,'Newell\'s Old Boys','Argentina',1),(11,_binary '',NULL,'Vélez Sarsfield','Argentina',1),(12,_binary '',NULL,'Argentinos Juniors','Argentina',1),(13,_binary '',NULL,'Talleres','Argentina',1),(14,_binary '',NULL,'Belgrano','Argentina',1),(15,_binary '',NULL,'Lanús','Argentina',1),(16,_binary '',NULL,'Real Madrid','España',1),(17,_binary '',NULL,'Manchester City','Inglaterra',1),(18,_binary '',NULL,'Argentina','Argentina',1),(22,_binary '','https://ejemplo.com/chacarita.png','Chacarita Juniors','Argentina',2),(23,_binary '','https://ejemplo.com/chicago.png','Nueva Chicago','Argentina',2),(24,_binary '','https://ejemplo.com/ferro.png','Ferro Carril Oeste','Argentina',2),(25,_binary '','https://ejemplo.com/quilmes.png','Quilmes','Argentina',2),(26,_binary '','https://ejemplo.com/almirante.png','Almirante Brown','Argentina',2),(27,_binary '','https://ejemplo.com/defe.png','Defensores de Belgrano','Argentina',2),(28,_binary '','https://ejemplo.com/atlanta.png','Atlanta','Argentina',2),(29,_binary '','https://ejemplo.com/estudiantesrc.png','Estudiantes de Río Cuarto','Argentina',2),(30,_binary '','https://ejemplo.com/gimnasiajujuy.png','Gimnasia de Jujuy','Argentina',2),(31,_binary '','https://ejemplo.com/smtucuman.png','San Martín de Tucumán','Argentina',2),(41,_binary '','https://ejemplo.com/escudo_tigre.png','Tigre','Argentina',1),(45,_binary '','https://ejemplo.com/escudo_UnionDeSantaFe.png','Union de Santa Fe','Argentina',1);
/*!40000 ALTER TABLE `clubes` ENABLE KEYS */;
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
