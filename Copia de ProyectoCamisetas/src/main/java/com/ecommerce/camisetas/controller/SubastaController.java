package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.OfertaDto;
import com.ecommerce.camisetas.model.dto.OfertaRequestDto;
import com.ecommerce.camisetas.model.dto.SubastaDto;
import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.service.SubastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subastas")
@RequiredArgsConstructor
public class SubastaController {

    private final SubastaService subastaService;

    // Obtener todas las subastas disponibles (público)
    @GetMapping
    public ResponseEntity<List<SubastaDto>> obtenerTodasLasSubastas() {
        return ResponseEntity.ok(subastaService.obtenerTodasLasSubastas());
    }

    // Obtener detalles de una subasta específica (público)
    @GetMapping("/{id}")
    public ResponseEntity<SubastaDto> obtenerSubastaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.obtenerSubastaPorId(id));
    }

    // Realizar una oferta (Autenticado)
    @PostMapping("/{id}/ofertar")
    public ResponseEntity<OfertaDto> ofertar(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody @Validated OfertaRequestDto request) {
        return ResponseEntity.ok(subastaService.ofertar(id, usuario, request.getMonto()));
    }

    // Registrar datos de envío del ganador de la subasta
    @PostMapping("/{id}/envio")
    public ResponseEntity<SubastaDto> registrarEnvio(
            @PathVariable Long id,
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody Map<String, String> request) {
        String direccion = request.get("direccion");
        String codigoPostal = request.get("codigoPostal");
        if (direccion == null || direccion.trim().isEmpty() || codigoPostal == null || codigoPostal.trim().isEmpty()) {
            throw new IllegalArgumentException("La dirección y el código postal son requeridos.");
        }
        return ResponseEntity.ok(subastaService.registrarEnvioSubasta(id, usuario, direccion, codigoPostal));
    }

    // Obtener el historial de ofertas de una subasta (público)
    @GetMapping("/{id}/ofertas")
    public ResponseEntity<List<OfertaDto>> obtenerOfertasDeSubasta(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.obtenerOfertasDeSubasta(id));
    }
}
