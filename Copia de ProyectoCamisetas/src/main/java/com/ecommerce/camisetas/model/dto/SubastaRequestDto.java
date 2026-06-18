package com.ecommerce.camisetas.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubastaRequestDto {
    private Long idProducto;
    private Double precioInicial;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
