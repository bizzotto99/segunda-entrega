package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.StatsDto;
import com.ecommerce.camisetas.service.FileStorageService;
import com.ecommerce.camisetas.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final FileStorageService fileStorageService;
    private final OrderService orderService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.saveFile(file);
        String fileUrl = "/uploads/" + fileName;
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsDto> obtenerEstadisticas(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario) {
        return ResponseEntity.ok(orderService.obtenerEstadisticas(usuario));
    }
}
