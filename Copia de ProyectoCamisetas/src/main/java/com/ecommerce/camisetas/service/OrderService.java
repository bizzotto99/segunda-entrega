package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.BusinessValidationException;
import com.ecommerce.camisetas.exception.ResourceNotFoundException;
import com.ecommerce.camisetas.model.dto.CheckoutRequestDto;
import com.ecommerce.camisetas.model.dto.DetalleOrdenDto;
import com.ecommerce.camisetas.model.dto.OrdenDto;
import com.ecommerce.camisetas.model.dto.StatsDto;
import com.ecommerce.camisetas.model.entity.*;
import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import com.ecommerce.camisetas.model.enums.EstadoOrden;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import com.ecommerce.camisetas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrdenRepository ordenRepository;
    private final CarritoRepository carritoRepository;
    private final ProductoRepository productoRepository;
    private final ProductoTalleRepository productoTalleRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public OrdenDto checkout(Long idUsuario, CheckoutRequestDto request) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        Carrito carrito = carritoRepository.findByUsuarioIdUsuarioAndEstado(idUsuario, EstadoCarrito.ACTIVO)
                .orElseThrow(() -> new BusinessValidationException("El carrito no está activo o no existe."));

        if (carrito.getItems() == null || carrito.getItems().isEmpty()) {
            throw new BusinessValidationException("El carrito está vacío, no se puede realizar el checkout.");
        }

        double totalOrden = 0.0;
        List<DetalleOrden> detalles = new ArrayList<>();

        Orden orden = Orden.builder()
                .usuario(usuario)
                .estado(EstadoOrden.CONFIRMADA)
                .direccionEntrega(request.getDireccionEntrega())
                .build();

        for (ItemCarrito item : carrito.getItems()) {
            // Descontar stock (validando nuevamente)
            if (item.getProductoTalle() != null) {
                ProductoTalle pt = productoTalleRepository.findById(item.getProductoTalle().getIdProdTalle())
                        .orElseThrow(() -> new ResourceNotFoundException("Producto-Talle no encontrado"));
                if (pt.getStockTalle() < item.getCantidad()) {
                    throw new BusinessValidationException("Stock insuficiente para el producto: " + item.getProducto().getNombre() + " en talle " + pt.getTalle());
                }
                pt.setStockTalle(pt.getStockTalle() - item.getCantidad());
                productoTalleRepository.save(pt);
            } else {
                Producto prod = productoRepository.findById(item.getProducto().getIdProducto())
                         .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
                if (prod.getStock() < item.getCantidad()) {
                    throw new BusinessValidationException("Stock insuficiente para el producto: " + prod.getNombre());
                }
                prod.setStock(prod.getStock() - item.getCantidad());
                productoRepository.save(prod);
            }

            double subtotal = item.getPrecioUnitario() * item.getCantidad();
            totalOrden += subtotal;

            DetalleOrden detalle = DetalleOrden.builder()
                    .orden(orden)
                    .producto(item.getProducto())
                    .productoTalle(item.getProductoTalle())
                    .cantidad(item.getCantidad())
                    .precioUnitario(item.getPrecioUnitario())
                    .subtotal(subtotal)
                    .build();
            detalles.add(detalle);
        }

        orden.setTotal(totalOrden);
        orden.setDetalles(detalles);

        Orden ordenGuardada = ordenRepository.save(orden);

        // Sumar puntos al usuario según el total de la compra (1 punto por cada $100 gastados)
        int pointsEarned = (int) Math.floor(totalOrden / 100.0);
        if (pointsEarned > 0) {
            int currentPoints = usuario.getPoints() != null ? usuario.getPoints() : 0;
            usuario.setPoints(currentPoints + pointsEarned);
            usuario.setPointsUpdatedAt(java.time.LocalDateTime.now());
            usuarioRepository.save(usuario);
        }

        // Cerrar carrito
        carrito.setEstado(EstadoCarrito.CERRADO);
        carritoRepository.save(carrito);

        // Crear nuevo carrito para futuras compras
        Carrito nuevoCarrito = Carrito.builder()
                .usuario(usuario)
                .estado(EstadoCarrito.ACTIVO)
                .build();
        carritoRepository.save(nuevoCarrito);

        return mapToDto(ordenGuardada);
    }

    public List<OrdenDto> obtenerOrdenesDeUsuario(Usuario usuario) {
        if (usuario.getRol() == RolUsuario.VENDEDOR || usuario.getRol() == RolUsuario.ADMIN) {
            return ordenRepository.findAll()
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        } else {
            return ordenRepository.findByUsuarioIdUsuario(usuario.getIdUsuario())
                    .stream().map(this::mapToDto).collect(Collectors.toList());
        }
    }

    public OrdenDto obtenerOrden(Usuario usuario, Long idOrden) {
        Orden orden;
        if (usuario.getRol() == RolUsuario.VENDEDOR || usuario.getRol() == RolUsuario.ADMIN) {
            orden = ordenRepository.findById(idOrden)
                    .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada"));
        } else {
            orden = ordenRepository.findByIdOrdenAndUsuarioIdUsuario(idOrden, usuario.getIdUsuario())
                    .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada"));
        }
        return mapToDto(orden);
    }

    private OrdenDto mapToDto(Orden o) {
        List<DetalleOrdenDto> detallesDto = o.getDetalles() != null ?
                o.getDetalles().stream().map(d -> DetalleOrdenDto.builder()
                        .idDetalle(d.getIdDetalle())
                        .idProducto(d.getProducto().getIdProducto())
                        .nombreProducto(d.getProducto().getNombre())
                        .idProdTalle(d.getProductoTalle() != null ? d.getProductoTalle().getIdProdTalle() : null)
                        .talle(d.getProductoTalle() != null ? d.getProductoTalle().getTalle() : null)
                        .cantidad(d.getCantidad())
                        .precioUnitario(d.getPrecioUnitario())
                        .subtotal(d.getSubtotal())
                        .build()).collect(Collectors.toList())
                : new ArrayList<>();

        return OrdenDto.builder()
                .idOrden(o.getIdOrden())
                .idUsuario(o.getUsuario().getIdUsuario())
                .fecha(o.getFecha())
                .total(o.getTotal())
                .estado(o.getEstado())
                .direccionEntrega(o.getDireccionEntrega())
                .detalles(detallesDto)
                .build();
    }

    @Transactional
    public OrdenDto actualizarEstadoOrden(Usuario usuario, Long idOrden, EstadoOrden nuevoEstado) {
        if (usuario.getRol() != RolUsuario.VENDEDOR && usuario.getRol() != RolUsuario.ADMIN) {
            throw new BusinessValidationException("No tienes permisos para actualizar el estado de una orden.");
        }
        Orden orden = ordenRepository.findById(idOrden)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada"));
        orden.setEstado(nuevoEstado);
        Orden ordenGuardada = ordenRepository.save(orden);
        return mapToDto(ordenGuardada);
    }

    public StatsDto obtenerEstadisticas(Usuario usuario) {
        if (usuario.getRol() != RolUsuario.VENDEDOR && usuario.getRol() != RolUsuario.ADMIN) {
            throw new BusinessValidationException("No tienes permisos para acceder a las estadísticas.");
        }

        double totalVentas = ordenRepository.findAll().stream()
                .mapToDouble(Orden::getTotal)
                .sum();

        long totalOrdenes = ordenRepository.count();
        long totalUsuarios = usuarioRepository.count();
        long totalProductos = productoRepository.count();

        java.util.Map<String, Long> ordenesPorEstado = ordenRepository.findAll().stream()
                .collect(Collectors.groupingBy(o -> o.getEstado().name(), Collectors.counting()));

        return StatsDto.builder()
                .totalVentas(totalVentas)
                .totalOrdenes(totalOrdenes)
                .totalUsuarios(totalUsuarios)
                .totalProductos(totalProductos)
                .ordenesPorEstado(ordenesPorEstado)
                .build();
    }
}
