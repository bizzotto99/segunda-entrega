package com.ecommerce.camisetas.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MisteryBoxEstadoDto {
    private boolean desbloqueada;
    private int puntosActuales;
    private int rankingPoints;
    private int puntosNecesarios;
    private int costo;
}
