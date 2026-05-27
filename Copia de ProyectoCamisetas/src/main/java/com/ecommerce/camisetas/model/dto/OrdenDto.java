package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.EstadoOrden;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrdenDto {
    private Long idOrden;
    private Long idUsuario;
    private LocalDateTime fecha;
    private Double total;
    private EstadoOrden estado;
    private String direccionEntrega;
    private List<DetalleOrdenDto> detalles;
}
