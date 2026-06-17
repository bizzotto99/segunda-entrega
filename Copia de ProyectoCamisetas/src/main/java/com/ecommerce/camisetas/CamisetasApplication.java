package com.ecommerce.camisetas;

import com.ecommerce.camisetas.model.entity.Orden;
import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import com.ecommerce.camisetas.repository.OrdenRepository;
import com.ecommerce.camisetas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@SpringBootApplication
public class CamisetasApplication {

	public static void main(String[] args) {
		SpringApplication.run(CamisetasApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, OrdenRepository ordenRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
			// Inicializar/Recalcular puntos para usuarios existentes basados en compras históricas
			usuarioRepository.findAll().forEach(u -> {
				List<Orden> ordenes = ordenRepository.findByUsuarioIdUsuario(u.getIdUsuario());
				int totalPoints = 0;
				LocalDateTime lastPurchaseDate = null;
				for (Orden o : ordenes) {
					totalPoints += (int) Math.floor(o.getTotal() / 100.0);
					if (lastPurchaseDate == null || o.getFecha().isAfter(lastPurchaseDate)) {
						lastPurchaseDate = o.getFecha();
					}
				}

				boolean updated = false;
				if (u.getPoints() == null || !u.getPoints().equals(totalPoints)) {
					u.setPoints(totalPoints);
					updated = true;
				}
				
				LocalDateTime expectedUpdatedAt = lastPurchaseDate != null ? lastPurchaseDate : u.getFechaRegistro();
				if (expectedUpdatedAt == null) {
					expectedUpdatedAt = LocalDateTime.now();
				}
				if (u.getPointsUpdatedAt() == null || !u.getPointsUpdatedAt().equals(expectedUpdatedAt)) {
					u.setPointsUpdatedAt(expectedUpdatedAt);
					updated = true;
				}

				if (updated) {
					usuarioRepository.save(u);
				}
			});

			// Verificamos si ya existe el vendedor maestro
			Optional<Usuario> vendedor = usuarioRepository.findByEmail("admin@camisetas.com");
			
			if (vendedor.isEmpty()) {
				// Creamos el vendedor por defecto con rol VENDEDOR
				Usuario nuevoVendedor = Usuario.builder()
						.username("admin_vendedor")
						.email("admin@camisetas.com")
						.password(passwordEncoder.encode("admin123"))
						.nombre("Nino")
						.apellido("Admin")
						.rol(RolUsuario.VENDEDOR)
						.points(0)
						.pointsUpdatedAt(LocalDateTime.now())
						.activo(true)
						.build();
				
				usuarioRepository.save(nuevoVendedor);
				System.out.println("===============================================");
				System.out.println("Vendedor oficial creado en la base de datos:");
				System.out.println("Email: admin@camisetas.com");
				System.out.println("Password: admin123");
				System.out.println("===============================================");
			}
		};
	}
}
