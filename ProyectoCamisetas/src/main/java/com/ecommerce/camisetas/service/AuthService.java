package com.ecommerce.camisetas.service;

import com.ecommerce.camisetas.exception.BusinessValidationException;
import com.ecommerce.camisetas.model.dto.LoginRequestDto;
import com.ecommerce.camisetas.model.dto.LoginResponseDto;
import com.ecommerce.camisetas.model.dto.RegistroRequestDto;
import com.ecommerce.camisetas.model.dto.UsuarioDto;
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
                .build();
    }
}
