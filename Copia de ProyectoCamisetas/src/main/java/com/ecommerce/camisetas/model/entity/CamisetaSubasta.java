package com.ecommerce.camisetas.model.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "camisetas_subasta")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CamisetaSubasta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_camiseta_subasta")
    private Long idCamisetaSubasta;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "foto_url")
    private String fotoUrl;

    private String club;

    @ElementCollection
    @CollectionTable(name = "camiseta_subasta_imagenes", joinColumns = @JoinColumn(name = "id_camiseta_subasta"))
    @Column(name = "foto_url")
    private List<String> fotosUrls;
}
