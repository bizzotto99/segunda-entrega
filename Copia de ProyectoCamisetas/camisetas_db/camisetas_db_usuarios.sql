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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,_binary '','Bizzotto','nino@test.com','2026-04-01 17:57:26.235914','Nino','$2a$10$Jxy5nuACFJka2cuyutPOQ.mmCdAuYOvwmcRGIe9nVNkVpo77GlAhS','COMPRADOR','ninobizz'),(2,_binary '','Bizzotto','nino@email.com','2026-04-01 22:07:06.434032','Nino','$2a$10$Xt4cJXRLWNPQoKdZ42vTdO0KOTFtUGlDTV1CIcBiI22sNR1yZ0xC2','COMPRADOR','ninob'),(3,_binary '','Admin','admin@camisetas.com','2026-04-02 03:17:36.132484','Nino','$2a$10$IMr15C4Y1UyBdOUQdjP6k.E/mpjKNN5i6rWmU1nEhE66Igoh0DUi6','VENDEDOR','admin_vendedor'),(4,_binary '','Pérez','prueba@correo.com','2026-04-02 21:26:33.348568','Juan','$2a$10$MFDRNQ/XrVzJCXpBzx8C/e1uBXeGipcDBcfT6Veyiw8WhIdtcqige','COMPRADOR','usuario_prueba'),(5,_binary '','perez','juanperez@ejemplo.com','2026-04-06 13:23:02.645394','Juan','$2a$10$YkqAx4XfExQOvOyUSx0aN.JjTcZHUBhT1TFC.sL5IWFYwuSomv3dC','COMPRADOR','juan_perez'),(6,_binary '','perez','juan@test.com','2026-04-06 22:51:29.075173','juan','$2a$10$E1bgO/xiCXYpygJmeVoQnuULeBEWp9IKphwBMFfy3T7HyAYDKwKnq','COMPRADOR','juan'),(7,_binary '','Bizzotto','pedro@ejemplo.com','2026-04-06 23:01:34.140324','pedro','$2a$10$kEQVdGLTdMFWyBDfwpzRKebRm3cdBjUz/MWqr8rsOPGucXlNpKdZm','COMPRADOR','pedro'),(8,_binary '','Bizzotto','nino@ejemplo.com','2026-04-06 23:05:48.160671','Nino','$2a$10$FI4J/xQ961T4OXo9YM5b8.tSMdeTeNu0RbCfYI1y2Rh1HCEkmYHbm','COMPRADOR','nino_comprador');
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

-- Dump completed on 2026-04-07 17:59:46
