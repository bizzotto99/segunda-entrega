package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// Acceso a la tabla 'usuarios' en la base de datos.
// JpaRepository<Usuario, Long> nos da gratis: save(), findById(), findAll(), delete(), etc.
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Busca un usuario por su nombre de usuario (para el login y para verificar duplicados en el registro).
    // Spring genera automáticamente el SQL: SELECT * FROM usuarios WHERE username = ?
    Optional<Usuario> findByUsername(String username);

    // Busca un usuario por su email (para verificar que no existan emails duplicados al registrarse).
    // Spring genera automáticamente el SQL: SELECT * FROM usuarios WHERE email = ?
    Optional<Usuario> findByEmail(String email);

    // Obtener los 5 usuarios compradores activos con más ranking_points, desempatando por fecha
    List<Usuario> findTop5ByRolAndActivoTrueOrderByRankingPointsDescPointsUpdatedAtAsc(RolUsuario rol);

    // Obtener la posición de un usuario en base a sus ranking_points y la fecha de desempate
    @Query("SELECT COUNT(u) + 1 FROM Usuario u WHERE u.rol = 'COMPRADOR' AND u.activo = true AND " +
           "(u.rankingPoints > :rankingPoints OR (u.rankingPoints = :rankingPoints AND u.pointsUpdatedAt < :pointsUpdatedAt))")
    int findRankByRankingPoints(@Param("rankingPoints") Integer rankingPoints, @Param("pointsUpdatedAt") LocalDateTime pointsUpdatedAt);
}
