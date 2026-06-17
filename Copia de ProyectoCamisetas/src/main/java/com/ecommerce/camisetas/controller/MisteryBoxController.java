package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.MisteryBoxEstadoDto;
import com.ecommerce.camisetas.model.dto.MisteryBoxResultadoDto;
import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.service.MisteryBoxService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/mistery-box")
@RequiredArgsConstructor
public class MisteryBoxController {

    private final MisteryBoxService misteryBoxService;

    @GetMapping("/estado")
    public ResponseEntity<MisteryBoxEstadoDto> getEstado(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(misteryBoxService.getEstado(usuario));
    }

    @PostMapping("/abrir")
    public ResponseEntity<MisteryBoxResultadoDto> abrir(@AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(misteryBoxService.abrir(usuario));
    }

    @PatchMapping("/aperturas/{id}/talle")
    public ResponseEntity<Void> seleccionarTalle(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Usuario usuario) {
        misteryBoxService.seleccionarTalle(id, body.get("talle"), usuario);
        return ResponseEntity.ok().build();
    }
}
