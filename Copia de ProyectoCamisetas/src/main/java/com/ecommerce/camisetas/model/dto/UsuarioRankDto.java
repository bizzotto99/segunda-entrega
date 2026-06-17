package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioRankDto {
    private Integer posicion;
    private Integer points;
}
