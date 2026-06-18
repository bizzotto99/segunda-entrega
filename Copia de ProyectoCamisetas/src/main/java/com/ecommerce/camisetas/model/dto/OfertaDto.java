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
public class OfertaDto {
    private Long idOferta;
    private Long idUsuario;
    private String usuarioUsername;
    private String usuarioNombreCompleto;
    private Double monto;
    private LocalDateTime fechaOferta;
}
