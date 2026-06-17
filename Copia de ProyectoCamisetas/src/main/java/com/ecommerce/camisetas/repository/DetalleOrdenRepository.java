package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.DetalleOrden;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetalleOrdenRepository extends JpaRepository<DetalleOrden, Long> {

    @Query("SELECT d FROM DetalleOrden d JOIN FETCH d.producto p JOIN FETCH p.club JOIN d.orden o WHERE o.usuario.idUsuario = :idUsuario ORDER BY o.fecha ASC")
    List<DetalleOrden> findByUsuarioId(@Param("idUsuario") Long idUsuario);
}
