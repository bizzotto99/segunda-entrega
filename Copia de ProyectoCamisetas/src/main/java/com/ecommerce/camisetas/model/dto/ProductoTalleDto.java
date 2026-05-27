package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.Talle;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProductoTalleDto {
    private Long idProdTalle;
    private Talle talle;
    private Integer stockTalle;
}
