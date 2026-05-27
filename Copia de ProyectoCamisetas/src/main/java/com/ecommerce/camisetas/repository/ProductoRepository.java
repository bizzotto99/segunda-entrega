package com.ecommerce.camisetas.repository;

import com.ecommerce.camisetas.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Acceso a la tabla 'productos' en la base de datos.
// Es el repositorio más complejo del proyecto porque tiene métodos de búsqueda y filtrado.
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Trae TODOS los productos que están activos (visibles en el catálogo).
    // Los productos con activo=false fueron eliminados lógicamente (siguen en la BD pero no se muestran).
    List<Producto> findByActivoTrue();

    // Filtra productos por categoría (ej: solo "Equipos Internacionales").
    List<Producto> findByCategoriaIdCategoriaAndActivoTrue(Long idCategoria);

    // Filtra productos por club (ej: solo camisetas de "Boca").
    List<Producto> findByClubIdClubAndActivoTrue(Long idClub);

    // Búsqueda avanzada con múltiples filtros opcionales a la vez.
    // Usa @Query con JPQL (lenguaje de consulta de JPA, similar a SQL pero con objetos Java).
    // Los parámetros son opcionales: si son null, ese filtro se ignora.
    // Permite filtrar por: categoría, precio mínimo, precio máximo y nombre (búsqueda parcial).
    @org.springframework.data.jpa.repository.Query("SELECT p FROM Producto p WHERE p.activo = true " +
           "AND (:idCategoria IS NULL OR p.categoria.idCategoria = :idCategoria) " +
           "AND (:precioMin IS NULL OR p.precio >= :precioMin) " +
           "AND (:precioMax IS NULL OR p.precio <= :precioMax) " +
           "AND (:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%')))")
    List<Producto> findFiltrados(@org.springframework.data.repository.query.Param("idCategoria") Long idCategoria,
                                 @org.springframework.data.repository.query.Param("precioMin") Double precioMin,
                                 @org.springframework.data.repository.query.Param("precioMax") Double precioMax,
                                 @org.springframework.data.repository.query.Param("nombre") String nombre);
}
