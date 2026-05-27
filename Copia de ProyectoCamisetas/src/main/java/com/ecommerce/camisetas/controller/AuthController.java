/* Se encarga de dejar entrar a los usuarios y darles su Token. */
package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.LoginRequestDto;
import com.ecommerce.camisetas.model.dto.LoginResponseDto;
import com.ecommerce.camisetas.model.dto.RegistroRequestDto;
import com.ecommerce.camisetas.model.dto.UsuarioDto;
import com.ecommerce.camisetas.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // Ruta base para todo lo relacionado con usuarios
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/registro") // Endpoint para crear una cuenta nueva (Comprador)
    public ResponseEntity<UsuarioDto> registrar(@RequestBody @Validated RegistroRequestDto request) {
        return new ResponseEntity<>(authService.registrar(request), HttpStatus.CREATED);
    }

    @PostMapping("/login") // Endpoint para iniciar sesión y obtener el Token JWT necesario para comprar o
                           // gestionar productos
    public ResponseEntity<LoginResponseDto> login(@RequestBody @Validated LoginRequestDto request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/me") // Permite al usuario ver sus propios datos (quién soy) usando el Token
    public ResponseEntity<UsuarioDto> getPerfil(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario) {
        return ResponseEntity.ok(authService.getPerfil(usuario));
    }
}
