package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.RolUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

// Representa la tabla 'usuarios' en la base de datos.
// Implementa UserDetails para integrarse con Spring Security (sistema de login y permisos).
@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(unique = true, nullable = false) // No puede haber dos usuarios con el mismo username
    private String username;

    @Column(unique = true, nullable = false) // No puede haber dos usuarios con el mismo email
    private String email;

    @Column(nullable = false)
    private String password; // Guardada cifrada con BCrypt, nunca en texto plano

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RolUsuario rol; // COMPRADOR o VENDEDOR. Determina los permisos del usuario.

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(nullable = false)
    private Boolean activo; // Si es false, el usuario no puede iniciar sesión

    // Spring Security llama a este método para saber qué permisos tiene el usuario.
    // Convertimos el ROL (ej: VENDEDOR) en una autoridad que Spring entiende ("ROLE_VENDEDOR").
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + rol.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // El campo 'activo' controla si el usuario puede iniciar sesión.
    // Si un admin lo desactiva, este método devuelve false y Spring Security lo bloquea automáticamente.
    @Override
    public boolean isEnabled() {
        return activo;
    }

    @PrePersist
    protected void onCreate() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
        if (activo == null) {
            activo = true;
        }
    }
}
