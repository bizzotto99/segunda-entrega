package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.ResourceNotFoundException;
import com.ecommerce.camisetas.model.dto.*;
import com.ecommerce.camisetas.model.entity.*;
import com.ecommerce.camisetas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private final ProductoRepository productoRepository;
    private final ProductoTalleRepository productoTalleRepository;
    private final CategoriaRepository categoriaRepository;
    private final ClubRepository clubRepository;
    private final ProductoImagenRepository productoImagenRepository;
    private final DescuentoRepository descuentoRepository;
    private final FileStorageService fileStorageService;

    public List<ProductoDto> obtenerProductosActivos(Long idCategoria, Double precioMin, Double precioMax, String nombre) {
        return productoRepository.findFiltrados(idCategoria, precioMin, precioMax, nombre).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProductoDto obtenerProducto(Long id) {
        Producto p = getProductoEntity(id);
        if (!p.getActivo()) throw new ResourceNotFoundException("Producto no encontrado o inactivo");
        return mapToDto(p);
    }

    @Transactional
    public ProductoDto crearProducto(ProductoRequestDto request, org.springframework.web.multipart.MultipartFile imagen) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        Club club = clubRepository.findById(request.getIdClub())
                .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado"));

        String fotoUrl = request.getFotoUrl();
        if (imagen != null && !imagen.isEmpty()) {
            String fileName = fileStorageService.saveFile(imagen);
            fotoUrl = "/uploads/" + fileName;
        }

        Producto prod = Producto.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .stock(request.getStock())
                .temporada(request.getTemporada())
                .tipo(request.getTipo())
                .fotoUrl(fotoUrl)
                .club(club)
                .categoria(categoria)
                .build();
        
        Producto guardado = productoRepository.save(prod);

        if (request.getTalles() != null) {
            List<ProductoTalle> talles = request.getTalles().stream().map(t -> ProductoTalle.builder()
                    .producto(guardado)
                    .talle(t.getTalle())
                    .stockTalle(t.getStockTalle())
                    .build()).collect(Collectors.toList());
            productoTalleRepository.saveAll(talles);
            guardado.setProductoTalles(talles);
        } else {
            guardado.setProductoTalles(new ArrayList<>());
        }

        // Guardar múltiples imágenes (si vienen como URLs en el request por ahora se mantienen)
        if (request.getFotosUrls() != null && !request.getFotosUrls().isEmpty()) {
            List<com.ecommerce.camisetas.model.entity.ProductoImagen> imagenes = request.getFotosUrls().stream()
                    .map(url -> com.ecommerce.camisetas.model.entity.ProductoImagen.builder()
                            .url(url)
                            .producto(guardado)
                            .build())
                    .collect(Collectors.toList());
            productoImagenRepository.saveAll(imagenes);
            guardado.setImagenes(imagenes);
        } else {
            guardado.setImagenes(new ArrayList<>());
        }

        return mapToDto(guardado);
    }

    @Transactional
    public void eliminarProducto(Long id) {
        Producto p = getProductoEntity(id);
        p.setActivo(false);
        productoRepository.save(p);
    }

    @Transactional
    public ProductoDto actualizarProducto(Long id, ProductoRequestDto request, org.springframework.web.multipart.MultipartFile imagen) {
        Producto p = getProductoEntity(id);

        if (request.getNombre() != null) p.setNombre(request.getNombre());
        if (request.getDescripcion() != null) p.setDescripcion(request.getDescripcion());
        if (request.getPrecio() != null) p.setPrecio(request.getPrecio());
        if (request.getStock() != null) p.setStock(request.getStock());
        if (request.getTemporada() != null) p.setTemporada(request.getTemporada());
        if (request.getTipo() != null) p.setTipo(request.getTipo());
        
        if (imagen != null && !imagen.isEmpty()) {
            String fileName = fileStorageService.saveFile(imagen);
            p.setFotoUrl("/uploads/" + fileName);
        } else if (request.getFotoUrl() != null) {
            p.setFotoUrl(request.getFotoUrl());
        }

        if (request.getIdCategoria() != null) {
            Categoria cat = categoriaRepository.findById(request.getIdCategoria())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
            p.setCategoria(cat);
        }
        if (request.getIdClub() != null) {
            Club club = clubRepository.findById(request.getIdClub())
                    .orElseThrow(() -> new ResourceNotFoundException("Club no encontrado"));
            p.setClub(club);
        }

        // Actualizar imágenes si se enviaron nuevas
        if (request.getFotosUrls() != null) {
            if (p.getImagenes() != null) {
                p.getImagenes().clear();
            } else {
                p.setImagenes(new ArrayList<>());
            }
            List<com.ecommerce.camisetas.model.entity.ProductoImagen> nuevasImagenes = request.getFotosUrls().stream()
                    .map(url -> com.ecommerce.camisetas.model.entity.ProductoImagen.builder()
                            .url(url)
                            .producto(p)
                            .build())
                    .collect(Collectors.toList());
            p.getImagenes().addAll(nuevasImagenes);
        }

        Producto guardado = productoRepository.save(p);
        return mapToDto(guardado);
    }

    // -- Gestión de Descuentos --
    @Transactional
    public DescuentoDto aplicarDescuento(Long idProducto, DescuentoRequestDto request) {
        Producto producto = getProductoEntity(idProducto);
        
        Descuento descuento = Descuento.builder()
                .producto(producto)
                .porcentaje(request.getPorcentaje())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .activo(true)
                .build();
        
        Descuento guardado = descuentoRepository.save(descuento);
        return mapToDescuentoDto(guardado);
    }

    public List<DescuentoDto> obtenerDescuentosDeProducto(Long idProducto) {
        Producto p = getProductoEntity(idProducto);
        return p.getDescuentos().stream()
                .map(this::mapToDescuentoDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarDescuento(Long idDescuento) {
        Descuento d = descuentoRepository.findById(idDescuento)
                .orElseThrow(() -> new ResourceNotFoundException("Descuento no encontrado"));
        descuentoRepository.delete(d);
    }

    private DescuentoDto mapToDescuentoDto(Descuento d) {
        return DescuentoDto.builder()
                .idDescuento(d.getIdDescuento())
                .porcentaje(d.getPorcentaje())
                .fechaInicio(d.getFechaInicio())
                .fechaFin(d.getFechaFin())
                .activo(d.getActivo())
                .build();
    }

    // -- Métodos de Categorías y Clubes --
    public List<CategoriaDto> obtenerCategorias() {
        return categoriaRepository.findAll().stream()
                .map(c -> CategoriaDto.builder().idCategoria(c.getIdCategoria()).nombre(c.getNombre()).build())
                .collect(Collectors.toList());
    }

    public List<ClubDto> obtenerClubes() {
        return clubRepository.findAll().stream()
                .map(c -> ClubDto.builder()
                        .idClub(c.getIdClub())
                        .nombre(c.getNombre())
                        .escudoUrl(c.getEscudoUrl())
                        .pais(c.getPais())
                        .idCategoria(c.getCategoria().getIdCategoria())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public ClubDto crearClub(com.ecommerce.camisetas.model.dto.ClubRequestDto request) {
        Categoria categoria = categoriaRepository.findById(request.getIdCategoria())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada para el club: " + request.getIdCategoria()));

        Club club = Club.builder()
                .nombre(request.getNombre())
                .pais(request.getPais())
                .escudoUrl(request.getEscudoUrl())
                .categoria(categoria)
                .activo(true)
                .build();
        
        Club guardado = clubRepository.save(club);
        
        return ClubDto.builder()
                .idClub(guardado.getIdClub())
                .nombre(guardado.getNombre())
                .pais(guardado.getPais())
                .escudoUrl(guardado.getEscudoUrl())
                .idCategoria(guardado.getCategoria().getIdCategoria())
                .build();
    }

    public Producto getProductoEntity(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con el ID: " + id));
    }

    public ProductoDto mapToDto(Producto p) {
        List<ProductoTalleDto> tallesDto = p.getProductoTalles() != null ? 
                p.getProductoTalles().stream().map(pt -> ProductoTalleDto.builder()
                        .idProdTalle(pt.getIdProdTalle())
                        .talle(pt.getTalle())
                        .stockTalle(pt.getStockTalle())
                        .build()).collect(Collectors.toList()) 
                : new ArrayList<>();

        ProductoDto dto = ProductoDto.builder()
                .idProducto(p.getIdProducto())
                .nombre(p.getNombre())
                .descripcion(p.getDescripcion())
                .precio(p.getPrecio())
                .stock(p.getStock())
                .temporada(p.getTemporada())
                .tipo(p.getTipo())
                .fotoUrl(p.getFotoUrl())
                .fotosUrls(p.getImagenes() != null ?
                        p.getImagenes().stream().map(com.ecommerce.camisetas.model.entity.ProductoImagen::getUrl).collect(Collectors.toList())
                        : new ArrayList<>())
                .idClub(p.getClub() != null ? p.getClub().getIdClub() : null)
                .nombreClub(p.getClub() != null ? p.getClub().getNombre() : "Sin Club")
                .idCategoria(p.getCategoria() != null ? p.getCategoria().getIdCategoria() : null)
                .nombreCategoria(p.getCategoria() != null ? p.getCategoria().getNombre() : "Sin Categoría")
                .talles(tallesDto)
                .build();

        // Calcular descuento activo
        LocalDateTime ahora = LocalDateTime.now();
        if (p.getDescuentos() != null) {
            p.getDescuentos().stream()
                .filter(d -> d.getActivo() && ahora.isAfter(d.getFechaInicio()) && ahora.isBefore(d.getFechaFin()))
                .findFirst()
                .ifPresent(d -> {
                    dto.setDescuentoActual(d.getPorcentaje());
                    dto.setPrecioConDescuento(p.getPrecio() * (1 - d.getPorcentaje() / 100));
                });
        }
        
        if (dto.getPrecioConDescuento() == null) {
            dto.setPrecioConDescuento(p.getPrecio());
        }

        return dto;
    }
}
