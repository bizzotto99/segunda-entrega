package com.ecommerce.camisetas;

import com.ecommerce.camisetas.model.entity.Usuario;
import com.ecommerce.camisetas.model.enums.RolUsuario;
import com.ecommerce.camisetas.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.Optional;

@SpringBootApplication
public class CamisetasApplication {

	public static void main(String[] args) {
		SpringApplication.run(CamisetasApplication.class, args);
	}

	@Bean
	CommandLineRunner initDatabase(UsuarioRepository usuarioRepository, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
		return args -> {
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
