package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.TipoProducto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.util.List;

@Data
public class ProductoRequestDto {
    @NotBlank(message = "El nombre del producto es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser mayor a 0")
    private Double precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;

    private String temporada;
    private TipoProducto tipo;
    private String fotoUrl;
    private List<String> fotosUrls;

    @NotNull(message = "El club es obligatorio")
    private Long idClub;

    @NotNull(message = "La categoría es obligatoria")
    private Long idCategoria;

    private List<ProductoTalleDto> talles;
}
