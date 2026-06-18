package com.ecommerce.camisetas.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// lee el header Authorization de cada petición, extrae el token, verifica que sea válido y no haya vencido,
//  y si todo está bien le avisa a Spring quién es el usuario y qué permisos tiene.

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request, // La petición HTTP que llega
            @NonNull HttpServletResponse response, // La respuesta HTTP que se enviará
            @NonNull FilterChain filterChain // La cadena de filtros que sigue después de este
    ) throws ServletException, IOException {

        // Paso 1: Leer el header "Authorization" de la petición.
        // El token llega en el formato: "Bearer eyJhbGciOiJIUzI1NiJ9..."
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Si no hay header o no empieza con "Bearer ", dejamos pasar la petición sin
        // autenticar.
        // Esto permite que las rutas públicas (como GET /api/catalogo) funcionen sin
        // token.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Paso 2: Extraer solo el token (quitamos el "Bearer " del principio, que son 7
        // caracteres).
        jwt = authHeader.substring(7);
        try {
            // Paso 3: Extraer el username guardado dentro del token.
            username = jwtService.extractUsername(jwt);

            // Paso 4: Si encontramos username y el usuario aún no está autenticado en esta
            // petición...
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Buscamos el usuario en la base de datos para verificar que sigue existiendo.
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                // Paso 5: Verificamos que el token sea válido (buen username + no expirado).
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // Paso 6: Creamos el objeto de autenticación con los permisos del usuario.
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities() // Los roles (COMPRADOR o VENDEDOR)
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    // Paso 7: Registramos la autenticación en el contexto de seguridad de Spring.
                    // A partir de acá, Spring Security sabe quién es el usuario en toda esta
                    // petición.
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Si el token es inválido o expiró, simplemente no autenticamos al usuario.
            // Spring Security bloqueará el acceso si la ruta lo requiere.
            System.out.println("Token JWT inválido o expirado");
        }

        // Paso 8: Pasamos la petición al siguiente filtro/controller en la cadena.
        filterChain.doFilter(request, response);
    }
}
