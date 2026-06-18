package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.EstadoSubasta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubastaDto {
    private Long idSubasta;
    private ProductoDto producto;
    private Double precioInicial;
    private Double precioActual;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private EstadoSubasta estado;
    private Long idGanador;
    private String ganadorUsername;
    private String ganadorNombreCompleto;
    private Integer cantidadOfertas;
    private Boolean envioRegistrado;
}
