package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class RankingResponseDto {
    private List<UsuarioDto> ranking;
    private UsuarioRankDto usuarioLogueado;
}
