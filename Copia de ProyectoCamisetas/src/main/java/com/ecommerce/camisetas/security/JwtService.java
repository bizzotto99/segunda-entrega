package com.ecommerce.camisetas.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

// Servicio responsable de TODA la lógica relacionada con los Tokens JWT.
// Se encarga de generar, validar y leer información de los tokens.
@Service
public class JwtService {

    // Clave secreta usada para firmar los tokens digitalmente.
    // Solo el servidor conoce esta clave, por eso nadie puede falsificar un token.
    // El token esta firmado con una clave secreta para garanttizar su seguridad.

    private static final String SECRET_KEY = "NDEyZGI1NmEzZmJiMTAxODk1Y2Y3OTZkZjcyOGRlYzY0ZTUzODFiMjA0YWUwYmZmMTY0Yzg2MTExMWJlMTcxMA==";

    // Se usa para saber QUÉ usuario es el dueño del token en cada petición.
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Un "claim" es cualquier dato que está guardado dentro del token (username,
    // fecha, etc.).
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Genera un token JWT nuevo para el usuario que acaba de hacer login.
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Genera el token con todos sus datos internos (claims):
    // - Subject: el username del usuario
    // - IssuedAt: cuándo se creó el token
    // vence (24 horas desde la creación)
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // Expira en 24 horas
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Verifica si un token es válido para un usuario específico.
    // Comprueba dos cosas: que el username coincida y que el token no haya
    // expirado.
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Verifica si la fecha de expiración del token ya pasó.
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extrae la fecha de expiración del token.
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Desencripta y lee todos los datos (claims) guardados dentro del token.
    // Si la firma no coincide con la clave secreta, lanza una excepción
    // automáticamente.
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Convierte la clave secreta a un objeto Key
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
