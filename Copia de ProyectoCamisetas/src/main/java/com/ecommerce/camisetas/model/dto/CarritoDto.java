package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CarritoDto {
    private Long idCarrito;
    private Long idUsuario;
    private EstadoCarrito estado;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private List<ItemCarritoDto> items;
    private Double total;
}
