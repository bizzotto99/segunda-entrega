package com.ecommerce.camisetas.model.dto;

import com.ecommerce.camisetas.model.enums.RolUsuario;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UsuarioDto {
    private Long idUsuario;
    private String username;
    private String email;
    private String nombre;
    private String apellido;
    private RolUsuario rol;
    private LocalDateTime fechaRegistro;
    private Boolean activo;
}
