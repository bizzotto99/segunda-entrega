//maneja el "carrito de compras" temporal antes de que se convierta en una orden oficial.
package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.AgregarItemRequestDto;
import com.ecommerce.camisetas.model.dto.CarritoDto;
import com.ecommerce.camisetas.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrito")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // Trae el carrito activo del usuario logueado con todos sus productos y el
    // total parcial
    @GetMapping
    public ResponseEntity<CarritoDto> obtenerCarritoActivo(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario) {
        return ResponseEntity.ok(cartService.obtenerCarritoActivo(usuario.getIdUsuario()));
    }

    @PostMapping("/items") // agrega una camiseta al carrito. Si el carrito no existe, lo crea
                           // automáticamente.
    public ResponseEntity<CarritoDto> agregarItem(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario,
            @RequestBody @Validated AgregarItemRequestDto request) {
        return ResponseEntity.ok(cartService.agregarAlCarrito(usuario.getIdUsuario(), request));
    }

    @DeleteMapping("/items/{idItem}") // quitar una camiseta específica del carrito.
    public ResponseEntity<Void> eliminarItem(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario,
            @PathVariable Long idItem) {
        cartService.eliminarItem(usuario.getIdUsuario(), idItem);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{idItem}") // permite cambiar la cantidad de una camiseta (sumar o restar) o eliminarla si
                                   // la cantidad es 0
    public ResponseEntity<CarritoDto> modificarCantidad(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario,
            @PathVariable Long idItem,
            @RequestParam Integer cantidad) {
        return ResponseEntity.ok(cartService.modificarCantidadItem(usuario.getIdUsuario(), idItem, cantidad));
    }

    @DeleteMapping // borra todo el carrito
    public ResponseEntity<Void> vaciarCarrito(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ecommerce.camisetas.model.entity.Usuario usuario) {
        cartService.vaciarCarrito(usuario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }
}
