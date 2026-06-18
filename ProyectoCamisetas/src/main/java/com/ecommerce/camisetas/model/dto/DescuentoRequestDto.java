package com.ecommerce.camisetas.model.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DescuentoRequestDto {
    @NotNull(message = "El porcentaje de descuento es obligatorio")
    @DecimalMin(value = "0.1", message = "El descuento debe ser al menos 0.1%")
    @DecimalMax(value = "100.0", message = "El descuento no puede ser mayor a 100%")
    private Double porcentaje;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    private LocalDateTime fechaFin;
}
