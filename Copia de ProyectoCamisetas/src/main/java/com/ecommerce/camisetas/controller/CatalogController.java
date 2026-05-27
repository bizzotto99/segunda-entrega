//Productos y tambien la carga de ellos

package com.ecommerce.camisetas.controller;

import com.ecommerce.camisetas.model.dto.*;
import com.ecommerce.camisetas.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo")
@RequiredArgsConstructor
public class CatalogController {

    private final CatalogService catalogService;

    @GetMapping("/productos") // Busca productos. Permite filtrar por nombre, club, categoría o rango de
                              // precios.
    public ResponseEntity<List<ProductoDto>> obtenerProductos(
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Double precioMin,
            @RequestParam(required = false) Double precioMax,
            @RequestParam(required = false) String q) {
        return ResponseEntity.ok(catalogService.obtenerProductosActivos(categoriaId, precioMin, precioMax, q));
    }

    @GetMapping("/productos/{id}")
    public ResponseEntity<ProductoDto> obtenerProductoPorId(@PathVariable Long id) {
        return ResponseEntity.ok(catalogService.obtenerProducto(id));
    }

    @PostMapping(value = "/productos", consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE) // CREACIÓN
                                                                                                             // (Soporta
                                                                                                             // JSON o
                                                                                                             // carga de
                                                                                                             // imagen
                                                                                                             // física
                                                                                                             // MULTIPART)
    public ResponseEntity<ProductoDto> crearProductoJson(@RequestBody @Validated ProductoRequestDto request) {
        return new ResponseEntity<>(catalogService.crearProducto(request, null), HttpStatus.CREATED);
    }

    @PostMapping(value = "/productos", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDto> crearProductoMultipart(
            @RequestPart("producto") @Validated ProductoRequestDto request,
            @RequestPart(value = "imagen", required = false) org.springframework.web.multipart.MultipartFile imagen) {
        return new ResponseEntity<>(catalogService.crearProducto(request, imagen), HttpStatus.CREATED);
    }

    @DeleteMapping("/productos/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        catalogService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/productos/{id}", consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ProductoDto> actualizarProductoJson(@PathVariable Long id,
            @RequestBody ProductoRequestDto request) {
        return ResponseEntity.ok(catalogService.actualizarProducto(id, request, null));
    }

    @PutMapping(value = "/productos/{id}", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductoDto> actualizarProductoMultipart(
            @PathVariable Long id,
            @RequestPart("producto") ProductoRequestDto request,
            @RequestPart(value = "imagen", required = false) org.springframework.web.multipart.MultipartFile imagen) {
        return ResponseEntity.ok(catalogService.actualizarProducto(id, request, imagen));
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaDto>> obtenerCategorias() {
        return ResponseEntity.ok(catalogService.obtenerCategorias());
    }

    @GetMapping("/clubes")
    public ResponseEntity<List<ClubDto>> obtenerClubes() {
        return ResponseEntity.ok(catalogService.obtenerClubes());
    }

    @PostMapping("/clubes")
    public ResponseEntity<ClubDto> crearClub(@RequestBody @Validated ClubRequestDto request) {
        return new ResponseEntity<>(catalogService.crearClub(request), HttpStatus.CREATED);
    }

    // -- Endpoints de Descuentos --

    @PostMapping("/productos/{productoId}/descuentos")
    public ResponseEntity<DescuentoDto> aplicarDescuento(
            @PathVariable Long productoId,
            @RequestBody @Validated DescuentoRequestDto request) {
        return new ResponseEntity<>(catalogService.aplicarDescuento(productoId, request), HttpStatus.CREATED);
    }

    @GetMapping("/productos/{productoId}/descuentos")
    public ResponseEntity<List<DescuentoDto>> obtenerDescuentos(@PathVariable Long productoId) {
        return ResponseEntity.ok(catalogService.obtenerDescuentosDeProducto(productoId));
    }

    @DeleteMapping("/descuentos/{id}")
    public ResponseEntity<Void> eliminarDescuento(@PathVariable Long id) {
        catalogService.eliminarDescuento(id);
        return ResponseEntity.noContent().build();
    }
}
