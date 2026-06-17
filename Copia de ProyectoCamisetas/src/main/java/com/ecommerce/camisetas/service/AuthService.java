package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.BusinessValidationException;
import com.ecommerce.camisetas.model.dto.*;
import com.ecommerce.camisetas.model.entity.Carrito;
import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import com.ecommerce.camisetas.repository.CarritoRepository;
import com.ecommerce.camisetas.repository.UsuarioRepository;
import com.ecommerce.camisetas.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final CarritoRepository carritoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UsuarioDto registrar(RegistroRequestDto request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BusinessValidationException("El username ya está en uso.");
        }
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BusinessValidationException("El email ya está registrado.");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .rol(RolUsuario.COMPRADOR)
                .points(0)
                .pointsUpdatedAt(LocalDateTime.now())
                .build();

        usuarioRepository.save(nuevoUsuario);

        Carrito carrito = Carrito.builder()
                .usuario(nuevoUsuario)
                .estado(EstadoCarrito.ACTIVO)
                .build();
        carritoRepository.save(carrito);

        return mapToDto(nuevoUsuario);
    }

    public LoginResponseDto login(LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessValidationException("Credenciales inválidas."));

        if (!usuario.getActivo()) {
            throw new BusinessValidationException("El usuario está inactivo.");
        }

        String jwtToken = jwtService.generateToken(usuario);

        return LoginResponseDto.builder()
                .token(jwtToken)
                .usuario(mapToDto(usuario))
                .build();
    }

    public UsuarioDto getPerfil(Usuario usuario) {
        return mapToDto(usuario);
    }

    public UsuarioDto getUsuarioPublico(Long idUsuario) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new com.ecommerce.camisetas.exception.ResourceNotFoundException("Usuario no encontrado"));
        return mapToDto(usuario);
    }

    public RankingResponseDto getRanking(Usuario usuarioLogueado) {
        List<Usuario> top5 = usuarioRepository.findTop5ByRolAndActivoTrueOrderByRankingPointsDescPointsUpdatedAtAsc(RolUsuario.COMPRADOR);
        List<UsuarioDto> top5Dto = top5.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        UsuarioRankDto rankDto = null;
        if (usuarioLogueado != null && usuarioLogueado.getRol() == RolUsuario.COMPRADOR) {
            int rankingPoints = usuarioLogueado.getRankingPoints() != null ? usuarioLogueado.getRankingPoints() : 0;
            LocalDateTime pointsUpdatedAt = usuarioLogueado.getPointsUpdatedAt() != null ? usuarioLogueado.getPointsUpdatedAt() : usuarioLogueado.getFechaRegistro();
            if (pointsUpdatedAt == null) {
                pointsUpdatedAt = LocalDateTime.now();
            }
            int rank = usuarioRepository.findRankByRankingPoints(rankingPoints, pointsUpdatedAt);
            rankDto = UsuarioRankDto.builder()
                    .posicion(rank)
                    .points(rankingPoints)
                    .build();
        }

        return RankingResponseDto.builder()
                .ranking(top5Dto)
                .usuarioLogueado(rankDto)
                .build();
    }

    private UsuarioDto mapToDto(Usuario u) {
        return UsuarioDto.builder()
                .idUsuario(u.getIdUsuario())
                .username(u.getUsername())
                .email(u.getEmail())
                .nombre(u.getNombre())
                .apellido(u.getApellido())
                .rol(u.getRol())
                .fechaRegistro(u.getFechaRegistro())
                .activo(u.getActivo())
                .points(u.getPoints())
                .rankingPoints(u.getRankingPoints())
                .pointsUpdatedAt(u.getPointsUpdatedAt())
                .avatarUrl(u.getAvatarUrl())
                .build();
    }
}
