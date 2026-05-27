package com.ecommerce.camisetas.model.entity;

import com.ecommerce.camisetas.model.enums.TipoProducto;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

// Representa la tabla 'productos' en la base de datos.
// Cada camiseta del catálogo es una instancia de esta clase.
@Entity
@Table(name = "productos")
@Getter         // Lombok genera automáticamente todos los getters
@Setter         // Lombok genera automáticamente todos los setters
@NoArgsConstructor  // Lombok genera el constructor vacío (requerido por JPA)
@AllArgsConstructor // Lombok genera el constructor con todos los campos
@Builder        // Lombok permite crear objetos con el patrón Builder (ej: Producto.builder().nombre("x").build())
public class Producto {

    @Id                                                    // Indica que este campo es la clave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)   // El valor se auto-incrementa en la BD (1, 2, 3...)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private Double precio;

    @Column(nullable = false)
    private Integer stock;

    private String temporada;

    @Enumerated(EnumType.STRING) // Guarda el ENUM como texto en la BD (ej: "TITULAR" en vez de un número)
    private TipoProducto tipo;

    @Column(name = "foto_url")
    private String fotoUrl; // URL de la foto principal

    // Relación: MUCHOS productos pueden pertenecer a UN club (Boca, River, etc.)
    @ManyToOne(fetch = FetchType.LAZY) // LAZY: no carga el club hasta que se necesita (optimización)
    @JoinColumn(name = "id_club", nullable = false) // Columna de unión en la tabla
    private Club club;

    // Relación: MUCHOS productos pueden pertenecer a UNA categoría (Equipos, Selecciones, etc.)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_categoria", nullable = false)
    private Categoria categoria;

    @Column(name = "fecha_alta")
    private LocalDateTime fechaAlta;

    @Column(nullable = false)
    private Boolean activo;

    // Relación: UN producto puede tener MUCHOS talles (S, M, L, XL)
    // cascade: si borro el producto, borro sus talles también
    // orphanRemoval: si quito un talle de la lista, se borra de la BD
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoTalle> productoTalles;

    // Relación: UN producto puede tener MUCHOS descuentos a lo largo del tiempo
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    private List<Descuento> descuentos;

    // Relación: UN producto puede tener MUCHAS fotos adicionales
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoImagen> imagenes;

    // Se ejecuta automáticamente ANTES de insertar el registro en la BD por primera vez
    @PrePersist
    protected void onCreate() {
        if (fechaAlta == null) {
            fechaAlta = LocalDateTime.now(); // Guarda la fecha y hora de creación
        }
        if (activo == null) {
            activo = true; // Todo producto nuevo arranca como activo (visible en el catálogo)
        }
    }
}
