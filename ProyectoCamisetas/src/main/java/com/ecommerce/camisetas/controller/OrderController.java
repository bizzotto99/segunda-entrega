//Aquí es donde el carrito se transforma en una "Orden de Compra" real.

package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.CheckoutRequestDto;
import com.ecommerce.camisetas.model.dto.OrdenDto;
import com.ecommerce.camisetas.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ordenes")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout") // Valida stock, cierra el carrito, resta productos del depósito y genera la
                              // factura. se hace todo (cobrar, restar stock, cerrar carrito)

    public ResponseEntity<OrdenDto> realizarCheckout(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario,
            @RequestBody @Validated CheckoutRequestDto request) {
        return new ResponseEntity<>(orderService.checkout(usuario.getIdUsuario(), request), HttpStatus.CREATED);
    }

    @GetMapping // Historial: Permite al usuario ver todas las compras que realizó en el pasado.
    public ResponseEntity<List<OrdenDto>> obtenerMisOrdenes(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario) {
        return ResponseEntity.ok(orderService.obtenerOrdenesDeUsuario(usuario));
    }

    @GetMapping("/{id}") // Muestra la factura completa de una compra específica.
    public ResponseEntity<OrdenDto> obtenerOrden(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario,
            @PathVariable Long id) {
        return ResponseEntity.ok(orderService.obtenerOrden(usuario, id));
    }
}
