package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.Talle;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "producto_talles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductoTalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prod_talle")
    private Long idProdTalle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Talle talle;

    @Column(name = "stock_talle", nullable = false)
    private Integer stockTalle;
}
