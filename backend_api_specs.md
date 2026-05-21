# Especificación del Backend - Proyecto Camisetas

Este documento contiene toda la información necesaria sobre los endpoints, modelos y mecanismos de seguridad del backend de Spring Boot, para ser utilizado en el desarrollo del frontend (React).

## 1. Configuración General y Seguridad

- **URL Base:** Generalmente `http://localhost:8080` (asumiendo el puerto por defecto de Spring Boot). Todas las peticiones a la API van bajo el prefijo `/api`.
- **Autenticación:** El sistema utiliza JWT (JSON Web Tokens).
- **Headers Requeridos:** Para todos los endpoints protegidos (carrito, órdenes, perfil), se debe enviar el token en la cabecera HTTP:
  `Authorization: Bearer <TU_TOKEN_JWT>`

## 2. Endpoints de Autenticación (`/api/auth`)

Se encarga del registro, inicio de sesión y obtención del perfil de usuario.

- `POST /api/auth/registro`
  - **Uso:** Crear un nuevo usuario comprador.
  - **Body (JSON):** `username`, `email`, `password`, `nombre`, `apellido`.
  - **Respuesta:** Objeto `UsuarioDto` creado.

- `POST /api/auth/login`
  - **Uso:** Iniciar sesión y obtener el token JWT.
  - **Body (JSON):** `username`, `password`.
  - **Respuesta:** `LoginResponseDto` que incluye `{ "token": "...", "usuario": { ... } }`.

- `GET /api/auth/me`
  - **Uso:** Obtener los datos del usuario logueado actualmente.
  - **Requiere:** Token JWT en el Header.
  - **Respuesta:** `UsuarioDto`.

## 3. Endpoints del Catálogo (`/api/catalogo`)

Se encarga de mostrar los productos, categorías, clubes, y gestionar descuentos.

- `GET /api/catalogo/productos`
  - **Uso:** Obtener lista de productos. Permite filtros como Query Params: `?categoriaId=1&precioMin=1000&precioMax=5000&q=boca`
  - **Respuesta:** Lista de `ProductoDto`.

- `GET /api/catalogo/productos/{id}`
  - **Uso:** Obtener un producto específico por ID.
  - **Respuesta:** `ProductoDto`.

- `GET /api/catalogo/categorias`
  - **Uso:** Obtener las categorías disponibles.

- `GET /api/catalogo/clubes`
  - **Uso:** Obtener la lista de clubes.

> [!NOTE]  
> También existen endpoints POST y PUT en el catálogo para crear productos o modificarlos (soportando JSON y Multipart para subida de imágenes), pero esto generalmente está reservado para perfiles administradores o el panel de control.

## 4. Endpoints del Carrito (`/api/carrito`)

Maneja el carrito de compras temporal. Todos estos endpoints **requieren el JWT en el header**.

- `GET /api/carrito`
  - **Uso:** Obtener el carrito activo del usuario logueado con todos sus items y el total parcial.
  - **Respuesta:** `CarritoDto`.

- `POST /api/carrito/items`
  - **Uso:** Agregar una camiseta al carrito. Si no hay carrito activo, lo crea automáticamente.
  - **Body (JSON):** Requiere los datos del item según `AgregarItemRequestDto` (generalmente `idProducto`, `cantidad`, y posiblemente `idTalle`).
  
- `PUT /api/carrito/items/{idItem}?cantidad={nuevaCantidad}`
  - **Uso:** Modificar la cantidad de un item específico en el carrito.

- `DELETE /api/carrito/items/{idItem}`
  - **Uso:** Eliminar un item específico del carrito.

- `DELETE /api/carrito`
  - **Uso:** Vaciar completamente el carrito.

## 5. Endpoints de Órdenes (`/api/ordenes`)

Maneja el proceso de compra (checkout) y el historial de compras. Todos estos endpoints **requieren JWT**.

- `POST /api/ordenes/checkout`
  - **Uso:** Transformar el carrito activo en una orden de compra oficial, descontar stock y generar la factura.
  - **Body (JSON):** `CheckoutRequestDto` (detalles necesarios para la compra/envío).
  - **Respuesta:** `OrdenDto`.

- `GET /api/ordenes`
  - **Uso:** Ver el historial de compras del usuario.
  - **Respuesta:** Lista de `OrdenDto`.

- `GET /api/ordenes/{id}`
  - **Uso:** Ver el detalle de una factura o compra específica.
  - **Respuesta:** `OrdenDto`.

## 6. Modelos Principales (Ejemplos de Estructuras JSON)

**LoginRequestDto**
```json
{
  "username": "nino",
  "password": "mi_password_secreta"
}
```

**ProductoDto**
```json
{
  "idProducto": 1,
  "nombre": "Camiseta Titular Boca Juniors",
  "descripcion": "...",
  "precio": 50000.0,
  "stock": 100,
  "temporada": "2023",
  "tipo": "TITULAR",
  "fotoUrl": "...",
  "idClub": 2,
  "nombreClub": "Boca Juniors",
  "idCategoria": 1,
  "nombreCategoria": "Fútbol Argentino",
  "descuentoActual": 0.0,
  "precioConDescuento": 50000.0
}
```

## 7. Instrucciones para el Chat del Frontend

Esta sección es un prompt para la IA que trabajará en el frontend:

**Stack Tecnológico:**
1. Inicializar el proyecto usando **Vite** con el template de **React** y Javascript.
2. Uso de **React Router DOM** para la navegación (Rutas: `/`, `/login`, `/registro`, `/catalogo`, `/carrito`, `/perfil`).
3. Uso de **Redux Toolkit** para almacenar el estado global:
   - `authSlice`: Guardar el token JWT y los datos del usuario.
   - `cartSlice`: Guardar la cantidad de items en el carrito.
4. Las peticiones a la API deben realizarse con **Fetch API** (o Axios), recordando siempre enviar el header `Authorization: Bearer <TOKEN>` si el usuario está autenticado.
5. Renderizado condicional basado en la autenticación (ej: Ocultar el carrito si no está logueado, redirigir al login al intentar comprar).
