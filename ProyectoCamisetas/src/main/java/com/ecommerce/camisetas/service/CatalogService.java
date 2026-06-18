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
import java.util.Arrays;
import java.util.List;
import java.util.Set;
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
        List<Producto> productos = productoRepository.findFiltrados(idCategoria, precioMin, precioMax, null);
        
        if (nombre != null && !nombre.trim().isEmpty()) {
            productos = filtrarPorPalabrasAsociadas(productos, nombre);
        }
        
        return productos.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private List<Producto> filtrarPorPalabrasAsociadas(List<Producto> productos, String query) {
        String queryNorm = normalizeText(query);
        if (queryNorm.isEmpty()) {
            return productos;
        }

        // Split query into tokens
        String[] tokens = queryNorm.split("\\s+");
        List<String> activeTokens = new ArrayList<>();
        
        // Common Spanish words/prepositions to ignore in search query (stop words)
        Set<String> stopWords = Set.of(
            "de", "del", "la", "el", "con", "y", "para", "en", "un", "una", "unos", "unas", "por", "sobre", "a", "al", "los", "las", "su", "sus", "tu", "tus"
        );

        for (String token : tokens) {
            if (!stopWords.contains(token) && !token.isEmpty()) {
                activeTokens.add(token);
            }
        }

        if (activeTokens.isEmpty()) {
            // If only stop words were typed, return all items or fallback to matching tokens
            for (String token : tokens) {
                if (!token.isEmpty()) activeTokens.add(token);
            }
        }

        List<Producto> filtered = new ArrayList<>();
        for (Producto prod : productos) {
            // Build the searchable space of the product
            String nameNorm = normalizeText(prod.getNombre());
            String descNorm = normalizeText(prod.getDescripcion());
            String clubNorm = prod.getClub() != null ? normalizeText(prod.getClub().getNombre()) : "";
            String catNorm = prod.getCategoria() != null ? normalizeText(prod.getCategoria().getNombre()) : "";
            String tempNorm = normalizeText(prod.getTemporada());
            String tipoNorm = prod.getTipo() != null ? normalizeText(prod.getTipo().toString()) : "";

            String searchableSpace = String.join(" ", nameNorm, descNorm, clubNorm, catNorm, tempNorm, tipoNorm);

            boolean matchesAll = true;
            for (String queryToken : activeTokens) {
                List<String> synonyms = getSynonyms(queryToken);
                boolean matchesToken = false;
                for (String syn : synonyms) {
                    if (searchableSpace.contains(syn)) {
                        matchesToken = true;
                        break;
                    }
                }
                if (!matchesToken) {
                    matchesAll = false;
                    break;
                }
            }

            if (matchesAll) {
                filtered.add(prod);
            }
        }
        return filtered;
    }

    private String normalizeText(String text) {
        if (text == null) return "";
        String norm = text.toLowerCase();
        // Remove common Spanish accents
        norm = norm.replace("á", "a")
                  .replace("é", "e")
                  .replace("í", "i")
                  .replace("ó", "o")
                  .replace("ú", "u")
                  .replace("ü", "u")
                  .replace("ñ", "n");
        // Remove special punctuation characters
        norm = norm.replaceAll("[^a-z0-9\\s]", " ");
        return norm.trim();
    }

    private List<String> getSynonyms(String token) {
        List<String> synonyms = new ArrayList<>();
        synonyms.add(token);
        
        switch (token) {
            case "remera":
            case "remeras":
            case "remerita":
            case "remeritas":
            case "camiseta":
            case "camisetas":
            case "casaca":
            case "casacas":
            case "jersey":
            case "jerseys":
            case "remeron":
            case "remerones":
                synonyms.addAll(Arrays.asList("camiseta", "remera", "casaca", "jersey"));
                break;
            case "boca":
            case "xeneize":
            case "cabj":
                synonyms.addAll(Arrays.asList("boca", "xeneize", "cabj"));
                break;
            case "river":
            case "millonario":
                synonyms.addAll(Arrays.asList("river", "millonario"));
                break;
            case "argentina":
            case "seleccion":
            case "albiceleste":
                synonyms.addAll(Arrays.asList("argentina", "seleccion", "albiceleste"));
                break;
            case "racing":
            case "academia":
                synonyms.addAll(Arrays.asList("racing", "academia"));
                break;
            case "independiente":
            case "rojo":
            case "diablo":
            case "diablos":
                synonyms.addAll(Arrays.asList("independiente", "rojo", "diablo"));
                break;
            case "san lorenzo":
            case "ciclon":
            case "cuervo":
                synonyms.addAll(Arrays.asList("san lorenzo", "ciclon", "cuervo"));
                break;
        }
        return synonyms;
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
