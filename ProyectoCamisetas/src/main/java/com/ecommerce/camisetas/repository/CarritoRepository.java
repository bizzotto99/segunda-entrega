package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Carrito;
import com.ecommerce.camisetas.model.enums.EstadoCarrito;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Acceso a la tabla 'carritos' en la base de datos.
@Repository
public interface CarritoRepository extends JpaRepository<Carrito, Long> {

    // Busca el carrito activo de un usuario específico.
    // Spring lo traduce a: SELECT * FROM carritos WHERE usuario_id = ? AND estado = ?
    // Se usa en CADA operación del carrito para encontrar el carrito ACTIVO del usuario logueado.
    Optional<Carrito> findByUsuarioIdUsuarioAndEstado(Long idUsuario, EstadoCarrito estado);
}
