package com.ecommerce.camisetas.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AgregarItemRequestDto {
    @NotNull(message = "El ID del producto es obligatorio")
    private Long idProducto;

    private Long idProdTalle; // Opcional, dependiendo si el producto tiene talles

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
}
