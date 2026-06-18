package com.ecommerce.camisetas.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClubRequestDto {
    @NotBlank(message = "El nombre del club es obligatorio")
    private String nombre;
    
    private String pais;
    
    private String escudoUrl;
    
    @NotNull(message = "Debes indicar a qué categoría pertenece el club")
    private Long idCategoria;
}
