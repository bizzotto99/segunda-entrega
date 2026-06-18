package com.ecommerce.camisetas.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

// Representa la tabla 'ofertas' en la base de datos.
@Entity
@Table(name = "ofertas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Oferta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_oferta")
    private Long idOferta;

    // Relación: MUCHAS ofertas pueden ser realizadas por UN usuario.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    // Relación: MUCHAS ofertas pertenecen a UNA subasta.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_subasta", nullable = false)
    private Subasta subasta;

    @Column(nullable = false)
    private Double monto;

    @Column(name = "fecha_oferta", nullable = false)
    private LocalDateTime fechaOferta;
}
