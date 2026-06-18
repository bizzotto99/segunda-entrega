package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
