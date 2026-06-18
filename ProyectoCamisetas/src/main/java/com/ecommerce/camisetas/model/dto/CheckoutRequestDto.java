package com.ecommerce.camisetas.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CheckoutRequestDto {
    @NotBlank(message = "La dirección de entrega es obligatoria")
    private String direccionEntrega;
}
