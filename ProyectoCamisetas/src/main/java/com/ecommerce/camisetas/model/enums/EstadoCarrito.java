package com.ecommerce.camisetas.model.enums;

// Define el ciclo de vida de un carrito de compras.
// Un carrito empieza ACTIVO y pasa a CERRADO cuando el usuario hace el Checkout.
public enum EstadoCarrito {

    // El carrito está en uso. El usuario puede seguir agregando o quitando productos.
    ACTIVO,

    // El carrito fue procesado (se hizo el checkout). Ya no se puede modificar.
    // Al cerrarse, el sistema crea automáticamente un carrito ACTIVO nuevo para el usuario.
    CERRADO
}
