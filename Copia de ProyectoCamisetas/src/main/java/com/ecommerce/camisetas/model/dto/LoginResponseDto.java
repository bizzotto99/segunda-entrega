package com.ecommerce.camisetas.model.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponseDto {
    private String token; // Podria ser un simple string "Login exitoso" si no implementamos JWT temporalmente
    private UsuarioDto usuario;
}
