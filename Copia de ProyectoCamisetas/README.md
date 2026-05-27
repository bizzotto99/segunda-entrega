<p align="center">
  <img src="https://i.pinimg.com/originals/6f/b8/cb/6fb8cbb7f4c14761a73e7b38d1eeffb2.gif" alt="Meme Izquierda" height="150" style="vertical-align: middle;"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="logo.png" alt="Logo de Proyecto Camisetas" width="200" style="vertical-align: middle;"/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
  <img src="https://i.pinimg.com/originals/6f/b8/cb/6fb8cbb7f4c14761a73e7b38d1eeffb2.gif" alt="Meme Derecha" height="150" style="vertical-align: middle;"/>
</p>

# E-commerce de Camisetas de Fútbol - Backend

Este es un backend para una plataforma de e-commerce especializada en la venta de camisetas de fútbol, desarrollado con **Spring Boot 3**. Incluye funcionalidades de catálogo, gestión de carrito de compras, procesamiento de órdenes y seguridad mediante JWT.

## Características Principales

- **Autenticación y Autorización**: Sistema de inicio de sesión y registro utilizando **JWT (JSON Web Tokens)**.
- **Catálogo de Productos**: Gestión de artículos, categorías y clubes.
- **Carrito de Compras**: Funcionalidad para agregar, modificar y eliminar artículos de un carrito activo por usuario.
- **Gestión de Órdenes**: Procesamiento de checkout y creación de órdenes de compra.
- **Base de Datos**: Integración con MySQL y carga de datos iniciales mediante el script `import.sql`.

## Requisitos Previos

- **Java 17** o superior.
- **MySQL 8.0** o superior.
- **Maven** (incluido mediante el wrapper `./mvnw`).

## Configuración

El proyecto utiliza variables de entorno para la configuración de la base de datos, lo que permite una fácil adaptación a diferentes entornos sin necesidad de modificar el código fuente.

### Variables de Envío Disponibles

Es necesario configurar las siguientes variables en el sistema o entorno de desarrollo:

| Variable | Descripción | Valor por Defecto |
| :--- | :--- | :--- |
| `DB_HOST` | Host de la base de datos MySQL | `localhost` |
| `DB_PORT` | Puerto de la base de datos | `3306` |
| `DB_NAME` | Nombre de la base de datos | `camisetas_db` |
| `DB_USER` | Usuario de MySQL | `tu usuario` |
| `DB_PASSWORD` | Contraseña de MySQL | `tu clave` |

## Ejecución del Proyecto

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/bizzotto99/Proyecto_UADE_Club.git
   cd ProyectoCamisetas
