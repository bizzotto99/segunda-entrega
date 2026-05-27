package com.ecommerce.camisetas.model.entity;

import jakarta.persistence.*;
import lombok.*;

// Representa UN renglón del carrito de compras.
// Ejemplo: "Camiseta Boca, Talle M, Cantidad 2, Precio $70.000"
// Cada vez que el usuario agrega una camiseta al carrito, se crea un ItemCarrito.
@Entity
@Table(name = "item_carritos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemCarrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_item")
    private Long idItem;

    // A qué carrito pertenece este ítem
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;

    // Qué camiseta es (referencia al producto)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    // Talle específico (opcional, puede ser null si el producto no maneja talles)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_prod_talle")
    private ProductoTalle productoTalle;

    @Column(nullable = false)
    private Integer cantidad;

    // Se guarda el precio al momento de agregar al carrito.
    // Así, si el precio del producto cambia después, el carrito no se ve afectado.
    @Column(name = "precio_unitario", nullable = false)
    private Double precioUnitario;
}
