package com.ecommerce.camisetas.model.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MisteryBoxResultadoDto {
    private Long idApertura;
    private Long idProducto;
    private String nombreProducto;
    private String club;
    private String fotoUrl;
    private String talle;
    private List<String> tallesDisponibles;
    private int puntosGastados;
    private int puntosRestantes;
    private LocalDateTime fecha;
}
