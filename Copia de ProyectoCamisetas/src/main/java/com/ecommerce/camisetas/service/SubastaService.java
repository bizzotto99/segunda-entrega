package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.ResourceNotFoundException;
import com.ecommerce.camisetas.model.dto.*;
import com.ecommerce.camisetas.model.entity.*;
import com.ecommerce.camisetas.model.enums.EstadoSubasta;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import com.ecommerce.camisetas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubastaService {

    private final SubastaRepository subastaRepository;
    private final OfertaRepository ofertaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CatalogService catalogService;
    private final OrdenRepository ordenRepository;

    // Obtener todas las subastas (público / usuarios comunes)
    @Transactional
    public List<SubastaDto> obtenerTodasLasSubastas() {
        return subastaRepository.findAll().stream()
                .map(this::verificarYFinalizarSubasta)
                .map(this::mapToSubastaDto)
                .collect(Collectors.toList());
    }

    // Obtener detalle de una subasta específica
    @Transactional
    public SubastaDto obtenerSubastaPorId(Long id) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + id));
        Subasta subastaActualizada = verificarYFinalizarSubasta(subasta);
        return mapToSubastaDto(subastaActualizada);
    }

    // Listar todas las subastas en el panel de administración
    @Transactional
    public List<SubastaDto> obtenerTodasLasSubastasAdmin() {
        return subastaRepository.findAll().stream()
                .map(this::verificarYFinalizarSubasta)
                .map(this::mapToSubastaDto)
                .collect(Collectors.toList());
    }

    // Crear una nueva subasta (Admin)
    @Transactional
    public SubastaDto crearSubasta(SubastaRequestDto request) {
        Producto producto = productoRepository.findById(request.getIdProducto())
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + request.getIdProducto()));

        Subasta subasta = Subasta.builder()
                .producto(producto)
                .precioInicial(request.getPrecioInicial())
                .precioActual(request.getPrecioInicial())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .estado(EstadoSubasta.ACTIVA)
                .build();

        Subasta guardada = subastaRepository.save(subasta);
        return mapToSubastaDto(guardada);
    }

    // Modificar una subasta (Admin)
    @Transactional
    public SubastaDto actualizarSubasta(Long id, SubastaRequestDto request) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + id));

        if (subasta.getEstado() == EstadoSubasta.FINALIZADA) {
            throw new IllegalStateException("No se puede editar una subasta ya finalizada.");
        }

        if (request.getIdProducto() != null) {
            Producto producto = productoRepository.findById(request.getIdProducto())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + request.getIdProducto()));
            subasta.setProducto(producto);
        }
        if (request.getPrecioInicial() != null) {
            subasta.setPrecioInicial(request.getPrecioInicial());
            // Si no tiene ofertas, reiniciamos también el precio actual
            if (ofertaRepository.countBySubasta(subasta) == 0) {
                subasta.setPrecioActual(request.getPrecioInicial());
            }
        }
        if (request.getFechaInicio() != null) {
            subasta.setFechaInicio(request.getFechaInicio());
        }
        if (request.getFechaFin() != null) {
            subasta.setFechaFin(request.getFechaFin());
        }

        Subasta guardada = subastaRepository.save(subasta);
        return mapToSubastaDto(guardada);
    }

    // Eliminar una subasta (Admin)
    @Transactional
    public void eliminarSubasta(Long id) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + id));
        subastaRepository.delete(subasta);
    }

    // Finalizar manualmente una subasta (Admin)
    @Transactional
    public SubastaDto finalizarSubastaManualmente(Long id) {
        Subasta subasta = subastaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + id));

        if (subasta.getEstado() == EstadoSubasta.FINALIZADA) {
            return mapToSubastaDto(subasta);
        }

        // Forzar finalización fijando la fecha fin al momento actual
        subasta.setFechaFin(LocalDateTime.now());
        subasta.setEstado(EstadoSubasta.FINALIZADA);

        // Buscar ganador
        Optional<Oferta> ofertaGanadora = ofertaRepository.findTopBySubastaOrderByMontoDescFechaOfertaAsc(subasta);
        if (ofertaGanadora.isPresent()) {
            subasta.setGanador(ofertaGanadora.get().getUsuario());
        }

        Subasta guardada = subastaRepository.save(subasta);
        return mapToSubastaDto(guardada);
    }

    // Realizar una oferta (Usuario)
    @Transactional
    public OfertaDto ofertar(Long idSubasta, Usuario usuarioPrincipal, Double monto) {
        Subasta subasta = subastaRepository.findById(idSubasta)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + idSubasta));

        // Verificar si la fecha de finalización ya pasó
        subasta = verificarYFinalizarSubasta(subasta);

        if (subasta.getEstado() != EstadoSubasta.ACTIVA) {
            throw new IllegalStateException("No se pueden realizar ofertas en una subasta finalizada.");
        }

        if (monto <= subasta.getPrecioActual()) {
            throw new IllegalArgumentException("El monto de la oferta debe ser estrictamente mayor al precio actual ($" + subasta.getPrecioActual() + ").");
        }

        // Recargar el usuario completo de la BD por si el principal está desactualizado
        Usuario usuario = usuarioRepository.findById(usuarioPrincipal.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + usuarioPrincipal.getIdUsuario()));

        if (usuario.getRol() == RolUsuario.VENDEDOR) {
            throw new IllegalArgumentException("Los administradores no pueden realizar ofertas en las subastas.");
        }

        // Crear la oferta
        Oferta oferta = Oferta.builder()
                .usuario(usuario)
                .subasta(subasta)
                .monto(monto)
                .fechaOferta(LocalDateTime.now())
                .build();

        Oferta guardada = ofertaRepository.save(oferta);

        // Actualizar el precio actual de la subasta
        subasta.setPrecioActual(monto);
        subastaRepository.save(subasta);

        return mapToOfertaDto(guardada);
    }

    // Registrar datos de envío para la subasta ganada y crear la orden
    @Transactional
    public SubastaDto registrarEnvioSubasta(Long idSubasta, Usuario usuarioPrincipal, String direccion, String codigoPostal) {
        Subasta subasta = subastaRepository.findById(idSubasta)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + idSubasta));

        // Verificar expiración y finalización
        subasta = verificarYFinalizarSubasta(subasta);

        if (subasta.getEstado() != EstadoSubasta.FINALIZADA) {
            throw new IllegalStateException("La subasta no ha finalizado.");
        }

        if (subasta.getGanador() == null) {
            throw new IllegalStateException("Esta subasta finalizó sin ofertas.");
        }

        if (!subasta.getGanador().getIdUsuario().equals(usuarioPrincipal.getIdUsuario())) {
            throw new IllegalStateException("Solo el usuario ganador puede registrar los datos de envío.");
        }

        if (subasta.getEnvioRegistrado()) {
            throw new IllegalStateException("Los datos de envío ya han sido registrados para esta subasta.");
        }

        // Crear la orden
        Orden orden = Orden.builder()
                .usuario(subasta.getGanador())
                .total(subasta.getPrecioActual())
                .estado(com.ecommerce.camisetas.model.enums.EstadoOrden.CONFIRMADA)
                .direccionEntrega(direccion + " (CP: " + codigoPostal + ")")
                .esSubasta(true)
                .build();

        // Crear el detalle de la orden
        DetalleOrden detalle = DetalleOrden.builder()
                .orden(orden)
                .producto(subasta.getProducto())
                .cantidad(1)
                .precioUnitario(subasta.getPrecioActual())
                .subtotal(subasta.getPrecioActual())
                .build();

        orden.setDetalles(List.of(detalle));

        // Guardar la orden
        ordenRepository.save(orden);

        // Actualizar la subasta
        subasta.setEnvioRegistrado(true);
        Subasta guardada = subastaRepository.save(subasta);

        return mapToSubastaDto(guardada);
    }

    // Obtener historial de ofertas de una subasta
    public List<OfertaDto> obtenerOfertasDeSubasta(Long idSubasta) {
        Subasta subasta = subastaRepository.findById(idSubasta)
                .orElseThrow(() -> new ResourceNotFoundException("Subasta no encontrada con ID: " + idSubasta));

        return ofertaRepository.findBySubastaOrderByFechaOfertaDesc(subasta).stream()
                .map(this::mapToOfertaDto)
                .collect(Collectors.toList());
    }

    // Rutina helper para verificar expiración y finalizar subastas
    public Subasta verificarYFinalizarSubasta(Subasta subasta) {
        if (subasta.getEstado() == EstadoSubasta.ACTIVA && LocalDateTime.now().isAfter(subasta.getFechaFin())) {
            subasta.setEstado(EstadoSubasta.FINALIZADA);

            // Obtener la oferta ganadora (la de mayor monto, desempata la más antigua)
            Optional<Oferta> ofertaGanadora = ofertaRepository.findTopBySubastaOrderByMontoDescFechaOfertaAsc(subasta);
            if (ofertaGanadora.isPresent()) {
                subasta.setGanador(ofertaGanadora.get().getUsuario());
            }

            return subastaRepository.save(subasta);
        }
        return subasta;
    }

    // Mapeo de Subasta a SubastaDto
    private SubastaDto mapToSubastaDto(Subasta s) {
        int cantidad = ofertaRepository.countBySubasta(s);
        Usuario g = s.getGanador();

        return SubastaDto.builder()
                .idSubasta(s.getIdSubasta())
                .producto(catalogService.mapToDto(s.getProducto()))
                .precioInicial(s.getPrecioInicial())
                .precioActual(s.getPrecioActual())
                .fechaInicio(s.getFechaInicio())
                .fechaFin(s.getFechaFin())
                .estado(s.getEstado())
                .idGanador(g != null ? g.getIdUsuario() : null)
                .ganadorUsername(g != null ? g.getUsername() : null)
                .ganadorNombreCompleto(g != null ? g.getNombre() + " " + g.getApellido() : null)
                .cantidadOfertas(cantidad)
                .envioRegistrado(s.getEnvioRegistrado())
                .build();
    }

    // Mapeo de Oferta a OfertaDto
    private OfertaDto mapToOfertaDto(Oferta o) {
        return OfertaDto.builder()
                .idOferta(o.getIdOferta())
                .idUsuario(o.getUsuario().getIdUsuario())
                .usuarioUsername(o.getUsuario().getUsername())
                .usuarioNombreCompleto(o.getUsuario().getNombre() + " " + o.getUsuario().getApellido())
                .monto(o.getMonto())
                .fechaOferta(o.getFechaOferta())
                .build();
    }
}
