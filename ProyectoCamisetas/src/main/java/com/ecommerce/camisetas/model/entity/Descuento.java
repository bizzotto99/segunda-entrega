package com.ecommerce.camisetas.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Representa un descuento aplicado a un producto específico.
// Un producto puede tener múltiples descuentos a lo largo del tiempo (uno por temporada, por ejemplo).
// El sistema solo aplica el descuento si la fecha actual está entre fechaInicio y fechaFin.
@Entity
@Table(name = "descuentos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Descuento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_descuento")
    private Long idDescuento;

    // Relación: UN descuento pertenece a UN producto específico
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Double porcentaje; // Ej: 15.0 = 15% de descuento sobre el precio original

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio; // Cuándo arranca la promoción

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin; // Cuándo termina la promoción

    @Column(nullable = false)
    private Boolean activo; // Flag para desactivar el descuento sin borrarlo
}
