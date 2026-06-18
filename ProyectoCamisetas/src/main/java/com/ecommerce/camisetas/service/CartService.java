package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.BusinessValidationException;
import com.ecommerce.camisetas.exception.ResourceNotFoundException;
import com.ecommerce.camisetas.model.dto.AgregarItemRequestDto;
import com.ecommerce.camisetas.model.dto.CarritoDto;
import com.ecommerce.camisetas.model.dto.ItemCarritoDto;
import com.ecommerce.camisetas.model.entity.*;
import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import com.ecommerce.camisetas.repository.CarritoRepository;
import com.ecommerce.camisetas.repository.ItemCarritoRepository;
import com.ecommerce.camisetas.repository.ProductoRepository;
import com.ecommerce.camisetas.repository.ProductoTalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final ProductoTalleRepository productoTalleRepository;
    private final ItemCarritoRepository itemCarritoRepository;
    private final com.ecommerce.camisetas.repository.UsuarioRepository usuarioRepository;

    @Transactional
    public CarritoDto agregarAlCarrito(Long idUsuario, AgregarItemRequestDto request) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseGet(() -> {
                    Carrito nuevo = Carrito.builder()
                            .usuario(usuarioRepository.findById(idUsuario).orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado")))
                            .estado(EstadoCarrito.ACTIVO)
                            .items(new ArrayList<>())
                            .build();
                    return carritoRepository.save(nuevo);
                });

        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        if (!producto.getActivo()) {
            throw new BusinessValidationException("El producto no está disponible.");
        }

        ProductoTalle talle = null;
        if (request.getIdProdTalle() != null) {
            talle = productoTalleRepository.findById(request.getIdProdTalle())
                    .orElseThrow(() -> new ResourceNotFoundException("Talle de producto no encontrado"));
            
            if (!talle.getProducto().getIdProducto().equals(producto.getIdProducto())) {
                throw new BusinessValidationException("El talle no corresponde al producto.");
            }
            if (talle.getStockTalle() < request.getCantidad()) {
                throw new BusinessValidationException("Stock insuficiente para el talle seleccionado.");
            }
        } else {
            if (producto.getStock() < request.getCantidad()) {
                throw new BusinessValidationException("Stock insuficiente del producto.");
            }
        }

        // Si ya existe el mismo producto con el mismo talle se podria actualizar, pero vamos a agregar un nuevo item o buscar existente.
        List<ItemCarrito> items = carrito.getItems();
        if(items == null) {
            items = new ArrayList<>();
            carrito.setItems(items);
        }
        
        ProductoTalle finalTalle = talle;
        ItemCarrito itemExistente = items.stream()
                .filter(i -> i.getProducto().getIdProducto().equals(producto.getIdProducto()) &&
                        (finalTalle == null ? i.getProductoTalle() == null : 
                                (i.getProductoTalle() != null && i.getProductoTalle().getIdProdTalle().equals(finalTalle.getIdProdTalle()))))
                .findFirst().orElse(null);

        if (itemExistente != null) {
            // chequear nuevo stock
            int nuevaCantidad = itemExistente.getCantidad() + request.getCantidad();
            if (talle != null && talle.getStockTalle() < nuevaCantidad) {
                throw new BusinessValidationException("Stock insuficiente para la nueva cantidad del talle.");
            } else if (talle == null && producto.getStock() < nuevaCantidad) {
                throw new BusinessValidationException("Stock insuficiente para la nueva cantidad de producto.");
            }
            itemExistente.setCantidad(nuevaCantidad);
            // El precio se mantiene o se actualiza? el precio unitario debería congelarse al agregar, pero vamos a actualizarlo para coincidir.
            itemExistente.setPrecioUnitario(producto.getPrecio());
        } else {
            ItemCarrito nuevoItem = ItemCarrito.builder()
                    .carrito(carrito)
                    .producto(producto)
                    .productoTalle(talle)
                    .cantidad(request.getCantidad())
                    .precioUnitario(producto.getPrecio()) // Congelamos el precio
                    .build();
            items.add(nuevoItem);
        }

        Carrito guardado = carritoRepository.save(carrito);
        return mapToDto(guardado);
    }

    public CarritoDto obtenerCarritoActivo(Long idUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró carrito activo para el usuario."));
        return mapToDto(carrito);
    }
    
    @Transactional
    public void eliminarItem(Long idUsuario, Long idItem) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new BusinessValidationException("El usuario no tiene un carrito activo."));
                
        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new ResourceNotFoundException("Item de carrito no encontrado."));
                
        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new BusinessValidationException("El item no pertenece al carrito del usuario.");
        }
        
        carrito.getItems().remove(item);
        itemCarritoRepository.delete(item);
        carritoRepository.save(carrito);
    }

    @Transactional
    public CarritoDto modificarCantidadItem(Long idUsuario, Long idItem, Integer nuevaCantidad) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new BusinessValidationException("El usuario no tiene un carrito activo."));

        ItemCarrito item = itemCarritoRepository.findById(idItem)
                .orElseThrow(() -> new ResourceNotFoundException("Item de carrito no encontrado."));

        if (!item.getCarrito().getIdCarrito().equals(carrito.getIdCarrito())) {
            throw new BusinessValidationException("El item no pertenece al carrito del usuario.");
        }

        if (nuevaCantidad <= 0) {
            carrito.getItems().remove(item);
            itemCarritoRepository.delete(item);
        } else {
            // Verificar stock
            if (item.getProductoTalle() != null) {
                if (item.getProductoTalle().getStockTalle() < nuevaCantidad) {
                    throw new BusinessValidationException("Stock insuficiente para el talle seleccionado.");
                }
            } else {
                if (item.getProducto().getStock() < nuevaCantidad) {
                    throw new BusinessValidationException("Stock insuficiente del producto.");
                }
            }
            item.setCantidad(nuevaCantidad);
        }

        Carrito guardado = carritoRepository.save(carrito);
        return mapToDto(guardado);
    }

    @Transactional
    public void vaciarCarrito(Long idUsuario) {
        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new BusinessValidationException("El usuario no tiene un carrito activo."));
        
        if (carrito.getItems() != null && !carrito.getItems().isEmpty()) {
            itemCarritoRepository.deleteAll(carrito.getItems());
            carrito.getItems().clear();
            carritoRepository.save(carrito);
        }
    }

    private CarritoDto mapToDto(Carrito c) {
        List<ItemCarritoDto> itemsDto = c.getItems() != null ?
                c.getItems().stream().map(i -> ItemCarritoDto.builder()
                        .idItem(i.getIdItem())
                        .idProducto(i.getProducto().getIdProducto())
                        .nombreProducto(i.getProducto().getNombre())
                        .idProdTalle(i.getProductoTalle() != null ? i.getProductoTalle().getIdProdTalle() : null)
                        .talle(i.getProductoTalle() != null ? i.getProductoTalle().getTalle() : null)
                        .cantidad(i.getCantidad())
                        .precioUnitario(i.getPrecioUnitario())
                        .build()).collect(Collectors.toList())
                : new ArrayList<>();

        Double total = itemsDto.stream().mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad()).sum();

        return CarritoDto.builder()
                .idCarrito(c.getIdCarrito())
                .idUsuario(c.getUsuario().getIdUsuario())
                .estado(c.getEstado())
                .fechaCreacion(c.getFechaCreacion())
                .fechaActualizacion(c.getFechaActualizacion())
                .items(itemsDto)
                .total(total)
                .build();
    }
}
