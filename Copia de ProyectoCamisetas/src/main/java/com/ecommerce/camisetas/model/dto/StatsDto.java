package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class StatsDto {
    private Double totalVentas;
    private Long totalOrdenes;
    private Long totalUsuarios;
    private Long totalProductos;
    private Map<String, Long> ordenesPorEstado;
}
