package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Orden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Acceso a la tabla 'ordenes' en la base de datos.
@Repository
public interface OrdenRepository extends JpaRepository<Orden, Long> {

    // Trae el historial completo de compras de un usuario.
    // Se usa en el endpoint GET /api/ordenes para que el usuario vea todas sus facturas.
    List<Orden> findByUsuarioIdUsuario(Long idUsuario);

    // Busca una orden específica que pertenezca a un usuario específico.
    // La doble validación (idOrden + idUsuario) evita que un usuario pueda ver la factura de otro.
    java.util.Optional<Orden> findByIdOrdenAndUsuarioIdUsuario(Long idOrden, Long idUsuario);
}
