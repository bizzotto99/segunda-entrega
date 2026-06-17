package com.ecommerce.camisetas.config;

import com.ecommerce.camisetas.repository.UsuarioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataMigration implements ApplicationRunner {

    @PersistenceContext
    private final EntityManager entityManager;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Sincroniza ranking_points con points para usuarios que existían antes de agregar la columna
        entityManager.createQuery(
                "UPDATE Usuario u SET u.rankingPoints = u.points WHERE u.rankingPoints = 0 AND u.points > 0"
        ).executeUpdate();
    }
}
