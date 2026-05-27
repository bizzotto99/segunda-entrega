package com.ecommerce.camisetas.model.enums;

// Define el ciclo de vida de una Orden (compra finalizada).
// Permite rastrear en qué etapa del proceso se encuentra cada compra.
public enum EstadoOrden {

    // La compra fue registrada pero todavía no fue procesada/enviada.
    // Este es el estado inicial al hacer el Checkout.
    PENDIENTE,

    // La compra fue procesada y confirmada correctamente.
    // El stock fue descontado y la orden está lista.
    CONFIRMADA,

    // La compra fue procesada correctamente y completada.
    COMPLETADA
}
