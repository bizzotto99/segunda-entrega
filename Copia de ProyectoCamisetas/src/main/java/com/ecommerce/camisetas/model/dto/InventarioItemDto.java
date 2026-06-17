package com.ecommerce.camisetas.model.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventarioItemDto {
    private Long idProducto;
    private String nombre;
    private String club;
    private String fotoUrl;
    private String talle;
    private Integer cantidad;
    private LocalDateTime fechaAdquisicion;
}
