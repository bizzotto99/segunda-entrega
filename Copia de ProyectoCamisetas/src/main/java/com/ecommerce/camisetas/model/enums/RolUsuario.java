package com.ecommerce.camisetas.model.enums;

// Define los tipos de usuario que pueden existir en el sistema.
// Este valor se guarda en la tabla 'usuarios' y Spring Security lo usa
// para decidir qué acciones puede hacer cada persona.
public enum RolUsuario {

    // Puede navegar el catálogo, agregar al carrito y hacer compras.
    COMPRADOR,

    // Puede todo lo del COMPRADOR más: crear, editar, eliminar productos y aplicar descuentos.
    VENDEDOR,

    // Rol de administrador con acceso total al sistema (puede ver todas las órdenes, etc.).
    ADMIN
}
