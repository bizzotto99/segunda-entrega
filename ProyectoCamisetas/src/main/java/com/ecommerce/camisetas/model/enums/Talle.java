package com.ecommerce.camisetas.model.enums;

// Define los talles disponibles para las camisetas.
// Usar un Enum garantiza que no se pueda cargar un talle inválido (ej: "Grande" o "XLL").
// Se usa en la entidad ProductoTalle para gestionar el stock por talle.
public enum Talle {
    XS,  // Extra Small
    S,   // Small
    M,   // Medium
    L,   // Large
    XL,  // Extra Large
    XXL  // Extra Extra Large
}
