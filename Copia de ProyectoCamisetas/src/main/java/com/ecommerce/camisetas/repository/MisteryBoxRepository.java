package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.MisteryBoxApertura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MisteryBoxRepository extends JpaRepository<MisteryBoxApertura, Long> {

    Optional<MisteryBoxApertura> findByIdAndUsuarioIdUsuario(Long id, Long idUsuario);
    @org.springframework.data.jpa.repository.Query("SELECT a FROM MisteryBoxApertura a JOIN FETCH a.producto p JOIN FETCH p.club WHERE a.usuario.idUsuario = :idUsuario ORDER BY a.fecha DESC")
    List<MisteryBoxApertura> findByUsuarioIdUsuarioOrderByFechaDesc(@org.springframework.data.repository.query.Param("idUsuario") Long idUsuario);
}
