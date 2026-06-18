package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.Talle;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ItemCarritoDto {
    private Long idItem;
    private Long idProducto;
    private String nombreProducto;
    private Long idProdTalle;
    private Talle talle;
    private Integer cantidad;
    private Double precioUnitario;
}
