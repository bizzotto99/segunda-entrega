package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CategoriaDto {
    private Long idCategoria;
    private String nombre;
}
