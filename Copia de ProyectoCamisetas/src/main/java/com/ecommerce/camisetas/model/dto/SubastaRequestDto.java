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
    private String nombre;
    private String descripcion;
    private String fotoUrl;
    private String club;
    private java.util.List<String> fotosUrls;
    private Double precioInicial;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
}
