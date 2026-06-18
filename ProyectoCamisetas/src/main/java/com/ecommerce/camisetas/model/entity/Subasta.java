package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.EstadoSubasta;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Representa la tabla 'subastas' en la base de datos.
@Entity
@Table(name = "subastas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subasta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_subasta")
    private Long idSubasta;

    // Relación: MUCHAS subastas pueden pertenecer a UN producto (pero normalmente es una subasta activa por producto).
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Column(name = "precio_inicial", nullable = false)
    private Double precioInicial;

    @Column(name = "precio_actual", nullable = false)
    private Double precioActual;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDateTime fechaFin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoSubasta estado; // ACTIVA o FINALIZADA

    // Relación: MUCHAS subastas pueden tener al mismo usuario como ganador.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario_ganador")
    private Usuario ganador; // El ganador al finalizar la subasta, nullable al principio

    @Column(name = "envio_registrado", nullable = false, columnDefinition = "boolean default false")
    @Builder.Default
    private Boolean envioRegistrado = false;
}
