package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ClubDto {
    private Long idClub;
    private String nombre;
    private String escudoUrl;
    private String pais;
    private Long idCategoria;
}
