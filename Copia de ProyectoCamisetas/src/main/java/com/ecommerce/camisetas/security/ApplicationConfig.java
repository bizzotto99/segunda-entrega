package com.ecommerce.camisetas.security;

import com.ecommerce.camisetas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

// Configuración técnica del sistema de autenticación.
// Define cómo Spring Security debe cargar usuarios, verificar contraseñas y gestionar la autenticación.
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UsuarioRepository repository;

    // Se encarga de cargar el usuario desde la base de datos
    // a partir del usename
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> repository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
    }

    // Usa base de datos para autenticar
    // Conecta el UserDetailsService (usuario) con el PasswordEncoder (contraseña).
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // El AuthenticationManager es el componente que Spring usa para ejecutar el proceso de autenticación.
    // Ejecuta la verificación de credenciales durante el login.
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Configura BCrypt como algoritmo de cifrado de contraseñas.
    // BCrypt es un algoritmo seguro que aplica "salt" automáticamente, haciendo imposible
    // descifrar la contraseña aunque alguien acceda a la base de datos.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
