package com.ecommerce.camisetas.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

// define quién puede entrar a cada área.
// Esta clase centraliza TODAS las reglas de seguridad de la aplicación.
@Configuration
@EnableWebSecurity // Activa el sistema de seguridad de Spring
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter; // El guardia de la puerta
    private final AuthenticationProvider authenticationProvider; // El verificador de credenciales

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Habilitamos CORS con la configuración que definimos más abajo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Deshabilitamos CSRF porque usamos JWT (no cookies de sesión, que son
                // vulnerables a CSRF).
                .csrf(csrf -> csrf.disable())

                // Definimos las reglas de acceso por URL y método HTTP:
                .authorizeHttpRequests(auth -> auth

                        // RUTAS PÚBLICAS (sin necesidad de estar logueado):
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Permitir preflight de CORS
                        .requestMatchers("/api/auth/**").permitAll() // Registro y Login
                        .requestMatchers(HttpMethod.GET, "/api/catalogo/**").permitAll() // Ver el catálogo
                        .requestMatchers(HttpMethod.GET, "/api/ordenes/inventario/**").permitAll() // Inventario público
                        .requestMatchers("/uploads/**").permitAll() // Ver imágenes subidas

                        // RUTAS EXCLUSIVAS PARA VENDEDORES:
                        // Solo usuarios con rol VENDEDOR pueden crear, modificar o borrar
                        // productos/descuentos.
                        .requestMatchers(HttpMethod.POST, "/api/catalogo/**").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.PUT, "/api/catalogo/**").hasRole("VENDEDOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/catalogo/**").hasRole("VENDEDOR")
                        .requestMatchers("/api/admin/**").hasRole("VENDEDOR")

                        // CUALQUIER OTRA RUTA requiere estar logueado (ej: carrito, órdenes).
                        .anyRequest().authenticated())

                // Configuramos sesiones STATELESS: el servidor no guarda estado del usuario
                // entre peticiones.
                // Toda la información (quién es el usuario) viaja dentro del Token JWT en cada
                // petición.
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authenticationProvider(authenticationProvider)

                // Registramos nuestro filtro JWT para que se ejecute ANTES del filtro estándar
                // de Spring.
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:5173", "http://127.0.0.1:5173",
                "http://localhost:5174", "http://127.0.0.1:5174",
                "http://localhost:5175", "http://127.0.0.1:5175"
        ));
        // Permitimos los métodos HTTP comunes
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permitimos los headers necesarios para JWT y JSON
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        // Permitimos que se envíen credenciales (cookies, headers de autorización)
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplicamos esta configuración de CORS a TODAS las rutas de la API
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
