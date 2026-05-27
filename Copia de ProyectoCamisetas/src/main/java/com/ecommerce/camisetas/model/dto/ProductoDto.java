package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.TipoProducto;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class ProductoDto {
    private Long idProducto;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private String temporada;
    private TipoProducto tipo;
    private String fotoUrl;
    private List<String> fotosUrls;
    private Long idClub;
    private String nombreClub;
    private Long idCategoria;
    private String nombreCategoria;
    private List<ProductoTalleDto> talles;
    private Double descuentoActual;
    private Double precioConDescuento;
}
