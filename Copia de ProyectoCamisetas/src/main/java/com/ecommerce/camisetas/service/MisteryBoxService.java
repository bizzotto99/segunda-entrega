package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.BusinessValidationException;
import com.ecommerce.camisetas.exception.ResourceNotFoundException;
import com.ecommerce.camisetas.model.dto.MisteryBoxEstadoDto;
import com.ecommerce.camisetas.model.dto.MisteryBoxResultadoDto;
import com.ecommerce.camisetas.model.entity.MisteryBoxApertura;
import com.ecommerce.camisetas.model.entity.Producto;
import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.repository.MisteryBoxRepository;
import com.ecommerce.camisetas.repository.ProductoRepository;
import com.ecommerce.camisetas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MisteryBoxService {

    private static final int PUNTOS_NECESARIOS = 10_000;
    private static final int COSTO = 10_000;

    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;
    private final MisteryBoxRepository misteryBoxRepository;
    private final Random random = new Random();

    public MisteryBoxEstadoDto getEstado(Usuario usuario) {
        int points = usuario.getPoints() != null ? usuario.getPoints() : 0;
        int rankingPoints = usuario.getRankingPoints() != null ? usuario.getRankingPoints() : 0;
        return MisteryBoxEstadoDto.builder()
                .desbloqueada(points >= PUNTOS_NECESARIOS)
                .puntosActuales(points)
                .rankingPoints(rankingPoints)
                .puntosNecesarios(PUNTOS_NECESARIOS)
                .costo(COSTO)
                .build();
    }

    @Transactional
    public MisteryBoxResultadoDto abrir(Usuario usuario) {
        int points = usuario.getPoints() != null ? usuario.getPoints() : 0;

        if (points < PUNTOS_NECESARIOS) {
            throw new BusinessValidationException("Necesitás " + PUNTOS_NECESARIOS + " puntos disponibles para desbloquear la Mystery Box.");
        }

        List<Producto> productos = productoRepository.findByActivoTrue();
        if (productos.isEmpty()) {
            throw new BusinessValidationException("No hay productos disponibles en el catálogo.");
        }

        Producto ganado = productos.get(random.nextInt(productos.size()));

        // Recopilar talles disponibles para que el usuario elija
        List<String> tallesDisponibles;
        if (ganado.getProductoTalles() != null && !ganado.getProductoTalles().isEmpty()) {
            tallesDisponibles = ganado.getProductoTalles().stream()
                    .filter(t -> t.getStockTalle() > 0)
                    .map(t -> t.getTalle().name())
                    .collect(Collectors.toList());
            if (tallesDisponibles.isEmpty()) {
                // Sin stock en ningún talle, igual se asigna el primero disponible
                tallesDisponibles = ganado.getProductoTalles().stream()
                        .map(t -> t.getTalle().name())
                        .collect(Collectors.toList());
            }
        } else {
            tallesDisponibles = List.of("Único");
        }

        // Descontar puntos GASTABLES — ranking_points nunca se modifica
        usuario.setPoints(points - COSTO);
        usuarioRepository.save(usuario);

        // Guardar apertura sin talle aún; el usuario lo elige en el siguiente paso
        MisteryBoxApertura apertura = MisteryBoxApertura.builder()
                .usuario(usuario)
                .producto(ganado)
                .puntosGastados(COSTO)
                .talle(null)
                .build();
        misteryBoxRepository.save(apertura);

        return MisteryBoxResultadoDto.builder()
                .idApertura(apertura.getId())
                .idProducto(ganado.getIdProducto())
                .nombreProducto(ganado.getNombre())
                .club(ganado.getClub().getNombre())
                .fotoUrl(ganado.getFotoUrl())
                .talle(null)
                .tallesDisponibles(tallesDisponibles)
                .puntosGastados(COSTO)
                .puntosRestantes(usuario.getPoints())
                .fecha(apertura.getFecha())
                .build();
    }

    @Transactional
    public void seleccionarTalle(Long idApertura, String talle, Usuario usuario) {
        MisteryBoxApertura apertura = misteryBoxRepository
                .findByIdAndUsuarioIdUsuario(idApertura, usuario.getIdUsuario())
                .orElseThrow(() -> new ResourceNotFoundException("Apertura no encontrada"));

        if (apertura.getTalle() != null) {
            throw new BusinessValidationException("Ya elegiste el talle para esta apertura.");
        }

        apertura.setTalle(talle);
        misteryBoxRepository.save(apertura);
    }
}
