package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.ProductoTalle;
import com.ecommerce.camisetas.model.enums.Talle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Acceso a la tabla 'producto_talles' en la base de datos.
// Gestiona los talles disponibles para cada camiseta (S, M, L, XL, etc.).
@Repository
public interface ProductoTalleRepository extends JpaRepository<ProductoTalle, Long> {

    // Trae todos los talles disponibles de una camiseta específica.
    // Se usa para mostrar qué talles tiene disponible una camiseta en su detalle.
    List<ProductoTalle> findByProductoIdProducto(Long idProducto);

    // Busca si una camiseta tiene stock en un talle específico.
    // Se usa al agregar al carrito para verificar disponibilidad de ese talle exacto.
    Optional<ProductoTalle> findByProductoIdProductoAndTalle(Long idProducto, Talle talle);
}
