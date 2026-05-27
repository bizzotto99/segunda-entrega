package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.EstadoOrden;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Representa una compra finalizada. Se crea al hacer el Checkout del carrito.
// Es el equivalente a una "Factura" en el sistema.
// Una vez creada, su contenido no cambia (refleja el estado exacto de la compra en ese momento).
@Entity
@Table(name = "ordenes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Orden {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_orden")
    private Long idOrden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @Column(nullable = false)
    private Double total; // Suma de todos los subtotales (precio x cantidad) de los detalles

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoOrden estado; // Estado actual de la orden (ej: PENDIENTE, COMPLETADA)

    @Column(name = "direccion_entrega")
    private String direccionEntrega; // Dirección que ingresó el usuario al hacer el checkout

    // Los renglones de la factura: qué camisetas se compraron, a qué precio y en qué cantidad
    @OneToMany(mappedBy = "orden", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetalleOrden> detalles = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }
}
