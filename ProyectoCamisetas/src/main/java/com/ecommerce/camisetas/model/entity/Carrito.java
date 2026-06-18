package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Representa el carrito de compras de un usuario.
// Puede tener dos estados: ACTIVO (se sigue cargando) o CERRADO (ya se finalizó la compra).
// Cada usuario tiene UN carrito ACTIVO a la vez. Al hacer checkout, se cierra y se crea uno nuevo.
@Entity
@Table(name = "carritos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Carrito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_carrito")
    private Long idCarrito;

    // Relación: MUCHOS carritos pueden pertenecer a UN usuario (uno por cada compra que hizo)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCarrito estado; // ACTIVO o CERRADO

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    // Relación: UN carrito tiene MUCHOS ítems (cada fila = una camiseta con su cantidad)
    // orphanRemoval: si quito un ítem de esta lista, se borra de la BD
    @OneToMany(mappedBy = "carrito", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ItemCarrito> items = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
        fechaActualizacion = LocalDateTime.now();
        if (estado == null) {
            estado = EstadoCarrito.ACTIVO;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}
