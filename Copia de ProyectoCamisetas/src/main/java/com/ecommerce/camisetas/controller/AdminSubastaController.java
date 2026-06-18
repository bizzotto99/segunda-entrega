package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.SubastaDto;
import com.ecommerce.camisetas.model.dto.SubastaRequestDto;
import com.ecommerce.camisetas.service.SubastaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/subastas")
@RequiredArgsConstructor
public class AdminSubastaController {

    private final SubastaService subastaService;

    // Obtener todas las subastas para el panel de administración
    @GetMapping
    public ResponseEntity<List<SubastaDto>> obtenerTodasLasSubastasAdmin() {
        return ResponseEntity.ok(subastaService.obtenerTodasLasSubastasAdmin());
    }

    // Crear una nueva subasta
    @PostMapping
    public ResponseEntity<SubastaDto> crearSubasta(@RequestBody @Validated SubastaRequestDto request) {
        return new ResponseEntity<>(subastaService.crearSubasta(request), HttpStatus.CREATED);
    }

    // Modificar una subasta existente
    @PutMapping("/{id}")
    public ResponseEntity<SubastaDto> actualizarSubasta(
            @PathVariable Long id,
            @RequestBody @Validated SubastaRequestDto request) {
        return ResponseEntity.ok(subastaService.actualizarSubasta(id, request));
    }

    // Eliminar una subasta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSubasta(@PathVariable Long id) {
        subastaService.eliminarSubasta(id);
        return ResponseEntity.noContent().build();
    }

    // Finalizar una subasta manualmente en el momento actual
    @PostMapping("/{id}/finalizar")
    public ResponseEntity<SubastaDto> finalizarSubastaManualmente(@PathVariable Long id) {
        return ResponseEntity.ok(subastaService.finalizarSubastaManualmente(id));
    }
}
